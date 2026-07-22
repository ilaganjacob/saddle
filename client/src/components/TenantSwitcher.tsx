import type { Tenant } from '../types';

interface Props {
  tenants: Tenant[];
  active: string;
  onChange: (name: string) => void;
}

function TenantSwitcher({ tenants, active, onChange }: Props) {
  return (
    <select
      style={styles.select}
      value={active}
      onChange={(e) => onChange(e.target.value)}
    >
      {tenants.map((t) => (
        <option key={t.name} value={t.name}>
          {t.label}
        </option>
      ))}
    </select>
  );
}

const styles: Record<string, React.CSSProperties> = {
  select: {
    background: '#161b22',
    color: '#c9d1d9',
    border: '1px solid #30363d',
    borderRadius: 6,
    padding: '4px 8px',
    fontSize: 13,
    outline: 'none',
  },
};

export default TenantSwitcher;