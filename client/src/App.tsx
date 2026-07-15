function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.title}>Saddle</span>
      </header>
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
};

export default App;