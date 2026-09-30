import React, { useState, useEffect } from 'react';
import { X, Check, Target } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

export function BudgetModal({ isOpen, onClose, categoryBudgets, onSaveBudget }) {
  const [budgets, setBudgets] = useState({});

  useEffect(() => {
    if (categoryBudgets) {
      setBudgets({ ...categoryBudgets });
    }
  }, [categoryBudgets, isOpen]);

  const handleChange = (catId, val) => {
    setBudgets(prev => ({
      ...prev,
      [catId]: val
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    Object.entries(budgets).forEach(([catId, val]) => {
      onSaveBudget(catId, parseFloat(val) || 0);
    });
    onClose();
  };

  if (!isOpen) return null;

  const expenseCategories = CATEGORIES.filter(c => c.type === 'despesa');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Definir Limites Mensais</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Defina o teto máximo de gastos desejado para cada categoria de despesa.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '6px' }}>
            {expenseCategories.map(cat => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{cat.name}</span>
                </div>
                <div style={{ width: '150px' }}>
                  <input 
                    type="number" 
                    step="50" 
                    min="0"
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                    value={budgets[cat.id] !== undefined ? budgets[cat.id] : (cat.defaultBudget || 0)}
                    onChange={(e) => handleChange(cat.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} /> Salvar Limites
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
