import { useState, useCallback, useEffect, useRef } from 'react';
import type { Message } from '../types';

let nextId = 1;

export function useChat(tenant: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages([]);
  }, [tenant]);

  const send = useCallback(
    async (text: string) => {
      const userMsg: Message = { id: String(nextId++), role: 'user', text };
      const agentMsg: Message = { id: String(nextId++), role: 'agent', text: '' };
      setMessages((prev) => [...prev, userMsg, agentMsg]);
      setLoading(true);
      setCurrentTool(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, tenant }),
          signal: controller.signal,
        });

        if (!res.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === agentMsg.id ? { ...m, text: `HTTP ${res.status}` } : m,
            ),
          );
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          let eventType = '';
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ') && eventType === 'delta') {
              const delta = JSON.parse(line.slice(6)) as string;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === agentMsg.id ? { ...m, text: m.text + delta } : m,
                ),
              );
            } else if (line.startsWith('data: ') && eventType === 'tool_start') {
              setCurrentTool(JSON.parse(line.slice(6)) as string);
            } else if (line.startsWith('data: ') && eventType === 'tool_end') {
              setCurrentTool(null);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === agentMsg.id
                ? { ...m, text: m.text + '\n' + err.message }
                : m,
            ),
          );
        }
      } finally {
        setLoading(false);
        setCurrentTool(null);
        abortRef.current = null;
      }
    },
    [tenant],
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, loading, currentTool, send, abort };
}