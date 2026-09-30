import React from 'react';
import { Target, Edit3, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { formatCurrency } from '../utils/formatters';

export function CategoryBudgets({ categoryExpenses, categoryBudgets, onOpenBudgetModal }) {
  const expenseCategories = CATEGORIES.filter(c => c.type === 'despesa');

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Metas & Tetos por Categoria</h3>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={onOpenBudgetModal}
          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
        >
          <Edit3 size={14} /> Editar Limites
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {expenseCategories.map(cat => {
          const spent = categoryExpenses[cat.id] || 0;
          const limit = categoryBudgets[cat.id] || cat.defaultBudget || 1000;
          const percent = limit > 0 ? (spent / limit) * 100 : 0;

          let progressColor = 'var(--accent-income)'; // Green
          if (percent >= 100) progressColor = 'var(--accent-expense)'; // Red
          else if (percent >= 80) progressColor = '#f59e0b'; // Amber

          return (
            <div key={cat.id} style={{ background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{cat.name}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: '700', color: spent > limit ? 'var(--accent-expense)' : 'var(--text-main)' }}>
                    {formatCurrency(spent)}
                  </span> 
                  <span style={{ color: 'var(--text-subtle)' }}> / {formatCurrency(limit)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(percent, 100)}%`,
                  height: '100%',
                  background: progressColor,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Status note */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.7rem' }}>
                <span style={{ color: 'var(--text-subtle)' }}>
                  {percent.toFixed(0)}% do limite utilizado
                </span>
                {percent >= 100 && (
                  <span style={{ color: 'var(--accent-expense)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <AlertTriangle size={11} /> Excedido em {formatCurrency(spent - limit)}
                  </span>
                )}
                {percent < 100 && (
                  <span style={{ color: 'var(--text-subtle)' }}>
                    Rrestante: {formatCurrency(limit - spent)}
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
