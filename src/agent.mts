import {
  createAgentSession,
  SessionManager,
  AuthStorage,
  ModelRegistry,
  resolveCliModel,
} from '@earendil-works/pi-coding-agent';
import type { AgentSession } from '@earendil-works/pi-coding-agent';
import path from 'path';
import fs from 'fs';

const TENANTS_ROOT = '/opt/saddle/tenants';

// Load .env into process.env (if not already)
function loadEnv(): void {
  const envPath = path.join('/opt/saddle', '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const eq = line.indexOf('=');
    if (eq > 0 && !line.startsWith('#')) {
      const key = line.slice(0, eq).trim();
      if (!process.env[key]) {
        process.env[key] = line.slice(eq + 1).trim();
      }
    }
  }
}
loadEnv();

let _authStorage: AuthStorage | null = null;
let _modelRegistry: ModelRegistry | null = null;

function getAuthStorage(): AuthStorage {
  if (!_authStorage) _authStorage = AuthStorage.create();
  return _authStorage;
}

function getModelRegistry(): ModelRegistry {
  if (!_modelRegistry) _modelRegistry = ModelRegistry.create(getAuthStorage());
  return _modelRegistry;
}

export interface AgentCallbacks {
  onTextDelta: (delta: string) => void;
  onToolStart: (toolName: string) => void;
  onToolEnd: (toolName: string, isError: boolean) => void;
  onError: (error: string) => void;
  onDone: () => void;
}

export async function runAgent(
  prompt: string,
  tenant: string,
  callbacks: AgentCallbacks,
): Promise<void> {
  const tenantDir = path.join(TENANTS_ROOT, tenant);
  fs.mkdirSync(tenantDir, { recursive: true });

  // Resume most recent session, or start fresh
  let sessionManager: SessionManager;
  try {
    const result = SessionManager.continueRecent(tenantDir);
    sessionManager = result.sessionManager;
  } catch {
    sessionManager = SessionManager.create(tenantDir);
  }

  const modelRegistry = getModelRegistry();
  const cliModel = resolveCliModel({
    cliModel: 'openrouter/deepseek/deepseek-chat',
    modelRegistry,
  });

  const { session } = await createAgentSession({
    sessionManager,
    authStorage: getAuthStorage(),
    modelRegistry,
    model: cliModel.error ? undefined : cliModel.model,
    cwd: tenantDir,
    tools: ['read', 'bash', 'edit', 'write', 'grep', 'find', 'ls'],
    thinkingLevel: 'off',
  });

  let errored = false;

  const unsubscribe = session.subscribe((event) => {
    switch (event.type) {
      case 'message_update':
        if (event.assistantMessageEvent.type === 'text_delta') {
          callbacks.onTextDelta(event.assistantMessageEvent.delta);
        }
        break;
      case 'tool_execution_start':
        callbacks.onToolStart(event.toolName);
        break;
      case 'tool_execution_end':
        callbacks.onToolEnd(event.toolName, event.isError);
        break;
      case 'agent_end':
        callbacks.onDone();
        break;
    }
  });

  try {
    await session.prompt(prompt);
  } catch (err: any) {
    errored = true;
    callbacks.onError(err.message || String(err));
  } finally {
    unsubscribe();
    session.dispose();
    if (!errored) callbacks.onDone();
  }
}