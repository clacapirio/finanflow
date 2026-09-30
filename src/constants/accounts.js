export const DEFAULT_ACCOUNTS = [
  {
    id: 'acc-nubank',
    name: 'Nubank (Conta Corrente)',
    type: 'checking',
    initialBalance: 2450.00,
    color: '#a855f7',
    icon: 'Landmark'
  },
  {
    id: 'acc-reserva',
    name: 'Reserva de Emergência',
    type: 'investment',
    initialBalance: 15000.00,
    color: '#10b981',
    icon: 'ShieldCheck'
  },
  {
    id: 'acc-credit',
    name: 'Cartão de Crédito Utama',
    type: 'credit',
    initialBalance: 0.00,
    color: '#ec4899',
    icon: 'CreditCard'
  },
  {
    id: 'acc-carteira',
    name: 'Dinheiro na Carteira',
    type: 'cash',
    initialBalance: 180.00,
    color: '#f59e0b',
    icon: 'Wallet'
  }
];

export const ACCOUNT_TYPES = [
  { id: 'checking', name: 'Conta Corrente', icon: 'Landmark' },
  { id: 'investment', name: 'Investimentos / Reserva', icon: 'TrendingUp' },
  { id: 'credit', name: 'Cartão de Crédito', icon: 'CreditCard' },
  { id: 'cash', name: 'Dinheiro Físico', icon: 'Banknote' },
  { id: 'savings', name: 'Poupança', icon: 'PiggyBank' }
];
