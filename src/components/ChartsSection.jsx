import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { CATEGORIES } from '../constants/categories';
import { formatCurrency, getMonthName } from '../utils/formatters';

// Register Chart.js modules
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export function ChartsSection({ categoryExpenses, monthlyFlowData }) {
  
  // Prepare Doughnut Chart Data (Expenses by Category)
  const categoryMap = React.useMemo(() => {
    const map = {};
    CATEGORIES.forEach(c => { map[c.id] = c; });
    return map;
  }, []);

  const catLabels = [];
  const catData = [];
  const catColors = [];

  Object.entries(categoryExpenses).forEach(([catId, amount]) => {
    if (amount > 0) {
      const catInfo = categoryMap[catId] || { name: catId, color: '#64748b' };
      catLabels.push(catInfo.name);
      catData.push(amount);
      catColors.push(catInfo.color);
    }
  });

  const doughnutData = {
    labels: catLabels.length > 0 ? catLabels : ['Sem despesas'],
    datasets: [
      {
        data: catData.length > 0 ? catData : [1],
        backgroundColor: catColors.length > 0 ? catColors : ['rgba(255,255,255,0.1)'],
        borderWidth: 2,
        borderColor: 'rgba(21, 28, 44, 0.9)'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          padding: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return ` ${context.label}: ${formatCurrency(val)}`;
          }
        }
      }
    },
    cutout: '70%'
  };

  // Prepare Bar Chart Data (Monthly Income vs Expense)
  const barLabels = monthlyFlowData.map(d => {
    const [y, m] = d.period.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
  });

  const barData = {
    labels: barLabels.length > 0 ? barLabels : ['Mês'],
    datasets: [
      {
        label: 'Receitas',
        data: monthlyFlowData.map(d => d.income),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6
      },
      {
        label: 'Despesas',
        data: monthlyFlowData.map(d => d.expense),
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatCurrency(context.raw)}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Inter' },
          callback: (val) => `R$ ${val}`
        }
      }
    }
  };

  return (
    <div className="charts-grid">
      
      {/* Bar Chart: Fluxo Recorrente */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Fluxo de Caixa (Histórico)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comparativo de Entradas vs Saídas nos últimos meses</p>
          </div>
        </div>
        <div style={{ height: '240px', position: 'relative' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Doughnut Chart: Gastos Por Categoria */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Distribuição de Despesas</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gastos por categoria no período</p>
          </div>
        </div>
        <div style={{ height: '240px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {catData.length === 0 ? (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)' }}>Nenhuma despesa gravada no período.</p>
          ) : (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          )}
        </div>
      </div>

    </div>
  );
}
