export const CATEGORIES = [
  { id: 'moradia', name: 'Moradia', type: 'despesa', icon: 'Home', color: '#6366f1', defaultBudget: 2500 },
  { id: 'alimentacao', name: 'Alimentação', type: 'despesa', icon: 'Utensils', color: '#f59e0b', defaultBudget: 1200 },
  { id: 'transporte', name: 'Transporte', type: 'despesa', icon: 'Car', color: '#3b82f6', defaultBudget: 600 },
  { id: 'lazer', name: 'Lazer & Estilo', type: 'despesa', icon: 'Smile', color: '#ec4899', defaultBudget: 500 },
  { id: 'saude', name: 'Saúde & Bem-estar', type: 'despesa', icon: 'HeartPulse', color: '#ef4444', defaultBudget: 400 },
  { id: 'educacao', name: 'Educação & Cursos', type: 'despesa', icon: 'GraduationCap', color: '#8b5cf6', defaultBudget: 300 },
  { id: 'servicos', name: 'Contas & Assinaturas', type: 'despesa', icon: 'Zap', color: '#06b6d4', defaultBudget: 450 },
  { id: 'compras', name: 'Compras Pessoais', type: 'despesa', icon: 'ShoppingBag', color: '#14b8a6', defaultBudget: 400 },
  { id: 'outros_despesa', name: 'Outras Despesas', type: 'despesa', icon: 'MoreHorizontal', color: '#64748b', defaultBudget: 300 },
  
  // Receitas
  { id: 'salario', name: 'Salário / Renda Principal', type: 'receita', icon: 'Briefcase', color: '#10b981' },
  { id: 'freelance', name: 'Freelance & Extras', type: 'receita', icon: 'Laptop', color: '#059669' },
  { id: 'investimentos', name: 'Rendimentos & Dividendo', type: 'receita', icon: 'TrendingUp', color: '#34d399' },
  { id: 'outros_receita', name: 'Outras Receitas', type: 'receita', icon: 'PlusCircle', color: '#10b981' }
];

export const PAYMENT_METHODS = [
  { id: 'pix', name: 'PIX', icon: 'Zap' },
  { id: 'credit_card', name: 'Cartão de Crédito', icon: 'CreditCard' },
  { id: 'debit_card', name: 'Cartão de Débito', icon: 'CreditCard' },
  { id: 'boleto', name: 'Boleto Bancário', icon: 'FileText' },
  { id: 'bank_transfer', name: 'Transferência Bancária', icon: 'ArrowRightLeft' },
  { id: 'cash', name: 'Dinheiro', icon: 'Banknote' }
];
