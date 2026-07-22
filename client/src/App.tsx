import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, loading, send } = useChat('default');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.title}>Saddle</span>
        {loading && <span style={styles.status}>Thinking...</span>}
      </header>
      <MessageList messages={messages} />
      <ChatInput onSend={send} disabled={loading} />
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