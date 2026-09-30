// Format number to BRL (R$ 1.250,00)
export const formatCurrency = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(number);
};

// Format date YYYY-MM-DD to DD/MM/YYYY
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Get current year and month (YYYY-MM)
export const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Get list of last N months for selection (e.g. "Setembro 2026")
export const getMonthName = (yearMonthStr) => {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  const monthName = date.toLocaleString('pt-BR', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} de ${year}`;
};

// Export transactions to CSV
export const exportToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert('Nenhuma transação para exportar.');
    return;
  }

  const headers = ['ID', 'Data', 'Tipo', 'Descrição', 'Categoria', 'Valor (R$)', 'Forma de Pagamento', 'Status'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type === 'receita' ? 'Receita' : 'Despesa',
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.category,
    t.amount.toString().replace('.', ','),
    t.paymentMethod || '-',
    t.status === 'paid' ? 'Pago' : 'Pendente'
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
    [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `FinanFlow_Export_${getCurrentYearMonth()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Backup data to JSON file
export const exportToJSON = (data) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FinanFlow_Backup_${getCurrentYearMonth()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
