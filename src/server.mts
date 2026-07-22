import express from 'express';
import { runAgent } from './agent.mjs';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
} else {
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  const { message, tenant = 'personal' } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (type: string, data: string) => {
    res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  console.log(`[chat] tenant=${tenant} msg="${message.slice(0, 80)}..."`);

  try {
    await runAgent(message, tenant, {
      onTextDelta: (delta) => send('delta', delta),
      onToolStart: (toolName) => send('tool_start', toolName),
      onToolEnd: (toolName, isError) =>
        send('tool_end', JSON.stringify({ toolName, isError })),
      onError: (error) => send('error', error),
      onDone: () => send('done', ''),
    });
  } catch (err: any) {
    send('error', err.message || String(err));
  }

  res.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Saddle listening on :${PORT}`);
});