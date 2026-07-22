export interface Message {
  id: string;
  role: 'user' | 'agent';
  text: string;
}

export interface Tenant {
  name: string;
  label: string;
}