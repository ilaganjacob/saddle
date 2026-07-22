import { useEffect, useRef } from 'react';
import type { Message } from '../types';

interface Props {
  messages: Message[];
}

function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            ...styles.bubble,
            ...(msg.role === 'user' ? styles.user : styles.agent),
          }}
        >
          {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  bubble: {
    maxWidth: '85%',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  user: {
    alignSelf: 'flex-end',
    background: '#1f6feb',
    color: '#fff',
  },
  agent: {
    alignSelf: 'flex-start',
    background: '#161b22',
    border: '1px solid #30363d',
  },
};

export default MessageList;