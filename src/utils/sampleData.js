import { getCurrentYearMonth } from './formatters';

export const generateSampleTransactions = () => {
  const currentYM = getCurrentYearMonth();
  const [year, month] = currentYM.split('-');
  const prevMonthNum = parseInt(month) - 1;
  const prevMonthStr = prevMonthNum > 0 
    ? `${year}-${String(prevMonthNum).padStart(2, '0')}`
    : `${parseInt(year) - 1}-12`;

  return [
    // Current month transactions
    {
      id: 'tx-1',
      description: 'Salário Mensal',
      amount: 6500.00,
      type: 'receita',
      category: 'salario',
      accountId: 'acc-nubank',
      date: `${currentYM}-05`,
      paymentMethod: 'bank_transfer',
      status: 'paid',
      notes: 'Recebimento conta principal'
    },
    {
      id: 'tx-2',
      description: 'Aporte Reserva de Emergência',
      amount: 800.00,
      type: 'transferencia',
      category: 'investimentos',
      accountId: 'acc-nubank',
      toAccountId: 'acc-reserva',
      date: `${currentYM}-06`,
      paymentMethod: 'bank_transfer',
      status: 'paid',
      notes: 'Transferência automática para a reserva'
    },
    {
      id: 'tx-3',
      description: 'Projeto Frontend Freelance',
      amount: 1800.00,
      type: 'receita',
      category: 'freelance',
      accountId: 'acc-nubank',
      date: `${currentYM}-12`,
      paymentMethod: 'pix',
      status: 'paid',
      notes: 'Website landing page client'
    },
    {
      id: 'tx-4',
      description: 'Aluguel & Condomínio',
      amount: 2150.00,
      type: 'despesa',
      category: 'moradia',
      accountId: 'acc-nubank',
      date: `${currentYM}-10`,
      paymentMethod: 'pix',
      status: 'paid',
      notes: 'Pago via aplicativo do banco'
    },
    {
      id: 'tx-5',
      description: 'Supermercado Semanal',
      amount: 485.60,
      type: 'despesa',
      category: 'alimentacao',
      accountId: 'acc-nubank',
      date: `${currentYM}-08`,
      paymentMethod: 'debit_card',
      status: 'paid'
    },
    {
      id: 'tx-6',
      description: 'Restaurante Fim de Semana',
      amount: 160.00,
      type: 'despesa',
      category: 'alimentacao',
      accountId: 'acc-credit',
      date: `${currentYM}-15`,
      paymentMethod: 'credit_card',
      status: 'paid'
    },
    {
      id: 'tx-7',
      description: 'Abastecimento Carro (Gasolina)',
      amount: 250.00,
      type: 'despesa',
      category: 'transporte',
      accountId: 'acc-credit',
      date: `${currentYM}-11`,
      paymentMethod: 'credit_card',
      status: 'paid'
    },
    {
      id: 'tx-8',
      description: 'Plano de Internet & Fibra',
      amount: 129.90,
      type: 'despesa',
      category: 'servicos',
      accountId: 'acc-nubank',
      date: `${currentYM}-14`,
      paymentMethod: 'pix',
      status: 'paid'
    },
    {
      id: 'tx-9',
      description: 'Academia Mensalidade',
      amount: 119.00,
      type: 'despesa',
      category: 'saude',
      accountId: 'acc-credit',
      date: `${currentYM}-03`,
      paymentMethod: 'credit_card',
      status: 'paid'
    },
    {
      id: 'tx-10',
      description: 'Cinema & Pipoca',
      amount: 85.00,
      type: 'despesa',
      category: 'lazer',
      accountId: 'acc-carteira',
      date: `${currentYM}-18`,
      paymentMethod: 'cash',
      status: 'paid'
    },
    {
      id: 'tx-11',
      description: 'Assinatura Streaming & Softwares',
      amount: 79.90,
      type: 'despesa',
      category: 'servicos',
      accountId: 'acc-credit',
      date: `${currentYM}-20`,
      paymentMethod: 'credit_card',
      status: 'pending'
    },
    {
      id: 'tx-12',
      description: 'Fatura Cartão Nubank',
      amount: 680.00,
      type: 'despesa',
      category: 'compras',
      accountId: 'acc-nubank',
      date: `${currentYM}-25`,
      paymentMethod: 'boleto',
      status: 'pending',
      notes: 'Vencimento dia 25 do mês'
    },
    {
      id: 'tx-13',
      description: 'Rendimento CDB Reserva',
      amount: 145.20,
      type: 'receita',
      category: 'investimentos',
      accountId: 'acc-reserva',
      date: `${currentYM}-15`,
      paymentMethod: 'bank_transfer',
      status: 'paid'
    },

    // Previous month transactions
    {
      id: 'tx-prev-1',
      description: 'Salário Mensal',
      amount: 6500.00,
      type: 'receita',
      category: 'salario',
      accountId: 'acc-nubank',
      date: `${prevMonthStr}-05`,
      paymentMethod: 'bank_transfer',
      status: 'paid'
    },
    {
      id: 'tx-prev-2',
      description: 'Aluguel & Condomínio',
      amount: 2150.00,
      type: 'despesa',
      category: 'moradia',
      accountId: 'acc-nubank',
      date: `${prevMonthStr}-10`,
      paymentMethod: 'pix',
      status: 'paid'
    }
  ];
};

export const defaultBudgets = {
  moradia: 2500,
  alimentacao: 1200,
  transporte: 600,
  lazer: 500,
  saude: 400,
  educacao: 300,
  servicos: 450,
  compras: 500,
  outros_despesa: 300
};
