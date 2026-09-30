import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Wallet, 
  PiggyBank, ArrowUpRight, ArrowDownRight, Clock, Eye, EyeOff 
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export function SummaryCards({ metrics }) {
  const [isHidden, setIsHidden] = useState(false);

  const {
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
    pendingExpenses,
    incomeChangePercent
  } = metrics;

  const displayVal = (val, colorStyle) => {
    if (isHidden) {
      return <span style={{ letterSpacing: '2px', color: 'var(--text-muted)' }}>R$ ••••••</span>;
    }
    return formatCurrency(val);
  };

  return (
    <div className="dashboard-grid">
      
      {/* 1. Saldo Total */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Saldo do Período
            </span>
            <button 
              onClick={() => setIsHidden(!isHidden)} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: 0 }}
              title={isHidden ? 'Exibir valores' : 'Ocultar valores (Privacidade)'}
            >
              {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-balance)'
          }}>
            <Wallet size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.03em', color: netBalance >= 0 ? 'var(--text-main)' : 'var(--accent-expense)' }}>
          {displayVal(netBalance)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span className={`badge ${netBalance >= 0 ? 'badge-income' : 'badge-expense'}`} style={{ padding: '2px 8px' }}>
            {netBalance >= 0 ? 'Positivo' : 'Em déficit'}
          </span>
          <span>Resultado final do mês</span>
        </div>
      </div>

      {/* 2. Total Receitas */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Receitas (Entradas)
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--accent-income-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-income)'
          }}>
            <TrendingUp size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--accent-income)' }}>
          {displayVal(totalIncome)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {incomeChangePercent !== 0 && (
            <span style={{ color: incomeChangePercent >= 0 ? 'var(--accent-income)' : 'var(--accent-expense)', fontWeight: '600', display: 'inline-flex', alignItems: 'center' }}>
              {incomeChangePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(incomeChangePercent).toFixed(1)}%
            </span>
          )}
          <span>vs mês anterior</span>
        </div>
      </div>

      {/* 3. Total Despesas */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Despesas (Saídas)
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--accent-expense-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-expense)'
          }}>
            <TrendingDown size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--accent-expense)' }}>
          {displayVal(totalExpenses)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {pendingExpenses > 0 && (
            <span className="badge badge-pending" style={{ padding: '2px 8px' }}>
              <Clock size={12} /> {isHidden ? 'R$ •••••' : `R$ ${pendingExpenses.toFixed(0)}`} a pagar
            </span>
          )}
          {pendingExpenses === 0 && (
            <span style={{ color: 'var(--text-subtle)' }}>Tudo em dia</span>
          )}
        </div>
      </div>

      {/* 4. Taxa de Poupança */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Taxa de Economia
          </span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4'
          }}>
            <PiggyBank size={20} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#06b6d4' }}>
          {savingsRate.toFixed(1)}%
        </div>
        <div style={{ marginTop: '10px' }}>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(Math.max(savingsRate, 0), 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '6px' }}>
            {savingsRate >= 20 ? '🎉 Meta ideal (+20%) atingida!' : 'Meta recomendada: 20% das receitas'}
          </p>
        </div>
      </div>

    </div>
  );
}
