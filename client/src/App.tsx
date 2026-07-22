import { useState } from 'react';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import type { Message } from './types';

let nextId = 1;

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  function handleSend(text: string) {
    const userMsg: Message = { id: String(nextId++), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const agentMsg: Message = {
        id: String(nextId++),
        role: 'agent',
        text: '(coming soon)',
      };
      setMessages((prev) => [...prev, agentMsg]);
      setLoading(false);
    }, 500);
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.title}>Saddle</span>
        {loading && <span style={styles.status}>Thinking...</span>}
      </header>
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: '#0d1117',
    color: '#c9d1d9',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #21262d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 14, fontWeight: 600, color: '#58a6ff' },
  status: { fontSize: 12, color: '#8b949e' },
};

export default App;