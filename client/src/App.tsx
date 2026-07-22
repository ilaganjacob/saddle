import { useState } from 'react';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import TenantSwitcher from './components/TenantSwitcher';
import { useChat } from './hooks/useChat';
import type { Tenant } from './types';

const TENANTS: Tenant[] = [
  { name: 'personal', label: 'Personal' },
  { name: 'htss', label: 'HTSS' },
  { name: 'elm', label: 'ELM' },
];

function App() {
  const [tenant, setTenant] = useState('personal');
  const { messages, loading, send } = useChat(tenant);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.title}>Saddle</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {loading && <span style={styles.status}>Thinking...</span>}
          <TenantSwitcher tenants={TENANTS} active={tenant} onChange={setTenant} />
        </div>
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