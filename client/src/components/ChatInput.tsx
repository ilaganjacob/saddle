import { useState, type KeyboardEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <footer style={styles.footer}>
      <input
        style={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        autoFocus
      />
      <button
        style={styles.button}
        onClick={handleSend}
        disabled={disabled || !text.trim()}
      >
        Send
      </button>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid #21262d',
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    background: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: 6,
    color: '#c9d1d9',
    fontSize: 14,
    outline: 'none',
  },
  button: {
    padding: '10px 16px',
    background: '#238636',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
  },
};

export default ChatInput;