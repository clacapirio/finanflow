import { useState, useEffect, useMemo } from 'react';
import { generateSampleTransactions, defaultBudgets } from '../utils/sampleData';
import { DEFAULT_ACCOUNTS } from '../constants/accounts';
import { getCurrentYearMonth } from '../utils/formatters';

const STORAGE_KEY_TX = 'finanflow_transactions_v1';
const STORAGE_KEY_BUDGETS = 'finanflow_budgets_v1';
const STORAGE_KEY_ACCOUNTS = 'finanflow_accounts_v1';

export function useFinance() {
  // 1. Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TX);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return generateSampleTransactions();
  });

  // 2. Category Budgets State
  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUDGETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultBudgets;
  });

  // 3. Accounts State
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_ACCOUNTS;
  });

  // Filters State
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentYearMonth());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'receita', 'despesa', 'transferencia'
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterAccount, setFilterAccount] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'paid', 'pending'

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  // Dynamic calculation of current balance for each account
  const accountBalances = useMemo(() => {
    const balanceMap = {};
    accounts.forEach(acc => {
      balanceMap[acc.id] = Number(acc.initialBalance) || 0;
    });

    transactions.forEach(t => {
      if (t.status !== 'paid') return; // Only count completed/paid transactions
      const amt = Number(t.amount) || 0;

      if (t.type === 'receita') {
        const accId = t.accountId || accounts[0]?.id;
        if (balanceMap[accId] !== undefined) {
          balanceMap[accId] += amt;
        }
      } else if (t.type === 'despesa') {
        const accId = t.accountId || accounts[0]?.id;
        if (balanceMap[accId] !== undefined) {
          balanceMap[accId] -= amt;
        }
      } else if (t.type === 'transferencia') {
        const fromId = t.accountId;
        const toId = t.toAccountId;
        if (balanceMap[fromId] !== undefined) balanceMap[fromId] -= amt;
        if (balanceMap[toId] !== undefined) balanceMap[toId] += amt;
      }
    });

    return balanceMap;
  }, [accounts, transactions]);

  // Net Worth (Patrimônio Líquido) Total Calculation
  const netWorthMetrics = useMemo(() => {
    let totalAssets = 0; // Sum of checking, investments, cash, savings balances
    let totalLiabilities = 0; // Sum of credit card balances if negative or pending debts

    accounts.forEach(acc => {
      const bal = accountBalances[acc.id] || 0;
      if (acc.type === 'credit') {
        if (bal < 0) totalLiabilities += Math.abs(bal);
      } else {
        totalAssets += bal;
      }
    });

    // Also include pending expenses as short-term liabilities
    let pendingDebts = 0;
    transactions.forEach(t => {
      if (t.type === 'despesa' && t.status === 'pending') {
        pendingDebts += Number(t.amount) || 0;
      }
    });

    const netWorth = totalAssets - totalLiabilities;

    return {
      totalAssets,
      totalLiabilities,
      pendingDebts,
      netWorth
    };
  }, [accounts, accountBalances, transactions]);

  // Available Periods
  const availablePeriods = useMemo(() => {
    const periods = new Set();
    periods.add(getCurrentYearMonth());
    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        periods.add(t.date.substring(0, 7));
      }
    });
    return Array.from(periods).sort().reverse();
  }, [transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (selectedPeriod !== 'ALL' && (!t.date || !t.date.startsWith(selectedPeriod))) {
        return false;
      }
      if (filterType !== 'ALL' && t.type !== filterType) {
        return false;
      }
      if (filterCategory !== 'ALL' && t.category !== filterCategory) {
        return false;
      }
      if (filterAccount !== 'ALL' && t.accountId !== filterAccount && t.toAccountId !== filterAccount) {
        return false;
      }
      if (filterStatus !== 'ALL' && t.status !== filterStatus) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchDesc = t.description?.toLowerCase().includes(q);
        const matchNotes = t.notes?.toLowerCase().includes(q);
        const matchCat = t.category?.toLowerCase().includes(q);
        if (!matchDesc && !matchNotes && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, selectedPeriod, filterType, filterCategory, filterAccount, filterStatus, searchQuery]);

  // Period Financial Metrics
  const metrics = useMemo(() => {
    const periodTxs = selectedPeriod === 'ALL' 
      ? transactions 
      : transactions.filter(t => t.date && t.date.startsWith(selectedPeriod));

    let totalIncome = 0;
    let totalExpenses = 0;
    let pendingIncome = 0;
    let pendingExpenses = 0;

    periodTxs.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'receita') {
        totalIncome += amt;
        if (t.status === 'pending') pendingIncome += amt;
      } else if (t.type === 'despesa') {
        totalExpenses += amt;
        if (t.status === 'pending') pendingExpenses += amt;
      }
    });

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

    let prevPeriodStr = '';
    if (selectedPeriod !== 'ALL' && selectedPeriod.includes('-')) {
      const [y, m] = selectedPeriod.split('-');
      const pM = parseInt(m) - 1;
      prevPeriodStr = pM > 0 ? `${y}-${String(pM).padStart(2, '0')}` : `${parseInt(y) - 1}-12`;
    }

    const prevTxs = prevPeriodStr 
      ? transactions.filter(t => t.date && t.date.startsWith(prevPeriodStr)) 
      : [];

    let prevIncome = 0;
    let prevExpenses = 0;
    prevTxs.forEach(t => {
      if (t.type === 'receita') prevIncome += Number(t.amount) || 0;
      if (t.type === 'despesa') prevExpenses += Number(t.amount) || 0;
    });

    const incomeChangePercent = prevIncome > 0 ? (((totalIncome - prevIncome) / prevIncome) * 100) : 0;
    const expenseChangePercent = prevExpenses > 0 ? (((totalExpenses - prevExpenses) / prevExpenses) * 100) : 0;

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate,
      pendingIncome,
      pendingExpenses,
      incomeChangePercent,
      expenseChangePercent,
      transactionCount: periodTxs.length
    };
  }, [transactions, selectedPeriod]);

  // Expenses breakdown by category
  const categoryExpenses = useMemo(() => {
    const periodTxs = selectedPeriod === 'ALL' 
      ? transactions 
      : transactions.filter(t => t.date && t.date.startsWith(selectedPeriod));

    const map = {};
    periodTxs.forEach(t => {
      if (t.type === 'despesa') {
        const cat = t.category || 'outros_despesa';
        map[cat] = (map[cat] || 0) + (Number(t.amount) || 0);
      }
    });
    return map;
  }, [transactions, selectedPeriod]);

  // Monthly Flow Data
  const monthlyFlowData = useMemo(() => {
    const monthsMap = {};
    transactions.forEach(t => {
      if (!t.date || t.date.length < 7) return;
      const monthKey = t.date.substring(0, 7);
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { income: 0, expense: 0 };
      }
      const amt = Number(t.amount) || 0;
      if (t.type === 'receita') {
        monthsMap[monthKey].income += amt;
      } else if (t.type === 'despesa') {
        monthsMap[monthKey].expense += amt;
      }
    });

    const sortedKeys = Object.keys(monthsMap).sort().slice(-6);
    return sortedKeys.map(k => ({
      period: k,
      income: monthsMap[k].income,
      expense: monthsMap[k].expense
    }));
  }, [transactions]);

  // Upcoming Bills (Pending bills ordered by date)
  const upcomingBills = useMemo(() => {
    return transactions
      .filter(t => t.status === 'pending' && t.type === 'despesa')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Actions
  const addTransaction = (newTx) => {
    const created = {
      ...newTx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      amount: Number(newTx.amount) || 0,
      accountId: newTx.accountId || accounts[0]?.id
    };
    setTransactions(prev => [created, ...prev]);
  };

  const updateTransaction = (id, updatedFields) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields, amount: Number(updatedFields.amount) || t.amount } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const toggleTransactionStatus = (id) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'paid' ? 'pending' : 'paid' };
      }
      return t;
    }));
  };

  const addAccount = (newAcc) => {
    const created = {
      ...newAcc,
      id: 'acc-' + Date.now(),
      initialBalance: Number(newAcc.initialBalance) || 0
    };
    setAccounts(prev => [...prev, created]);
  };

  const updateAccount = (id, updatedFields) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields, initialBalance: Number(updatedFields.initialBalance) || a.initialBalance } : a));
  };

  const deleteAccount = (id) => {
    if (accounts.length <= 1) {
      alert('Você precisa ter pelo menos uma conta cadastrada.');
      return;
    }
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const updateCategoryBudget = (categoryId, newLimit) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: Number(newLimit) || 0
    }));
  };

  const loadDemoData = () => {
    setTransactions(generateSampleTransactions());
    setCategoryBudgets(defaultBudgets);
    setAccounts(DEFAULT_ACCOUNTS);
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados registrados?')) {
      setTransactions([]);
      setCategoryBudgets(defaultBudgets);
      setAccounts(DEFAULT_ACCOUNTS);
    }
  };

  const importFromJSON = (importedData) => {
    if (importedData && (Array.isArray(importedData.transactions) || Array.isArray(importedData.accounts))) {
      if (importedData.transactions) setTransactions(importedData.transactions);
      if (importedData.budgets) setCategoryBudgets(importedData.budgets);
      if (importedData.accounts) setAccounts(importedData.accounts);
      alert('Dados importados com sucesso!');
    } else {
      alert('Formato de arquivo JSON inválido.');
    }
  };

  return {
    transactions,
    filteredTransactions,
    accounts,
    accountBalances,
    netWorthMetrics,
    selectedPeriod,
    setSelectedPeriod,
    availablePeriods,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    filterAccount,
    setFilterAccount,
    filterStatus,
    setFilterStatus,
    metrics,
    categoryExpenses,
    categoryBudgets,
    monthlyFlowData,
    upcomingBills,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toggleTransactionStatus,
    addAccount,
    updateAccount,
    deleteAccount,
    updateCategoryBudget,
    loadDemoData,
    clearAllData,
    importFromJSON
  };
}
