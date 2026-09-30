import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { formatCurrency } from '../utils/formatters';

export function FinancialHealth({ metrics, categoryExpenses, transactions }) {
  const { totalIncome, totalExpenses, netBalance, savingsRate, pendingExpenses } = metrics;

  // Find top category expense
  const categoryMap = React.useMemo(() => {
    const map = {};
    CATEGORIES.forEach(c => { map[c.id] = c; });
    return map;
  }, []);

  let maxCatId = null;
  let maxCatAmount = 0;

  Object.entries(categoryExpenses).forEach(([catId, amt]) => {
    if (amt > maxCatAmount) {
      maxCatAmount = amt;
      maxCatId = catId;
    }
  });

  const topCategory = maxCatId ? (categoryMap[maxCatId]?.name || maxCatId) : null;
  const topCategoryPercent = totalExpenses > 0 ? ((maxCatAmount / totalExpenses) * 100).toFixed(0) : 0;

  // Pending count
  const pendingCount = transactions.filter(t => t.type === 'despesa' && t.status === 'pending').length;

  return (
    <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b'
        }}>
          <Lightbulb size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Diagnóstico & Dicas Financeiras</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Análise automática baseada nas suas movimentações</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        
        {/* Tip 1: Top Category */}
        {topCategory && (
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <TrendingUp size={20} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Maior Categoria de Gasto</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                <strong style={{ color: 'var(--text-main)' }}>{topCategory}</strong> representa <strong>{topCategoryPercent}%</strong> das suas saídas ({formatCurrency(maxCatAmount)}).
              </div>
            </div>
          </div>
        )}

        {/* Tip 2: Pending Bills */}
        {pendingCount > 0 ? (
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#f59e0b' }}>Contas a Pagar Pendentes</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Você tem <strong>{pendingCount}</strong> conta(s) pendente(s) totalizando <strong>{formatCurrency(pendingExpenses)}</strong>.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <CheckCircle2 size={20} color="var(--accent-income)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-income)' }}>Contas em Dia</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Nenhuma conta pendente de pagamento gravada no período.
              </div>
            </div>
          </div>
        )}

        {/* Tip 3: Savings Health */}
        <div style={{ background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
          <ShieldCheck size={20} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>Saúde Financeira</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {savingsRate >= 20 ? (
                <span>Excelente! Você está poupando <strong>{savingsRate.toFixed(1)}%</strong> da sua renda.</span>
              ) : savingsRate > 0 ? (
                <span>Você economizou <strong>{savingsRate.toFixed(1)}%</strong>. Tente atingir 20% para sua reserva de emergência.</span>
              ) : (
                <span style={{ color: 'var(--accent-expense)' }}>Atenção: Suas despesas ultrapassaram as receitas no período.</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
