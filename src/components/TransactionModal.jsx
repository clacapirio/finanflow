import React, { useState, useEffect } from 'react';
import { X, Check, ArrowDownCircle, ArrowUpCircle, ArrowRightLeft } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories';

export function TransactionModal({ isOpen, onClose, onSave, editingTransaction, accounts }) {
  const [type, setType] = useState('despesa');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('moradia');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'acc-nubank');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || 'acc-reserva');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [status, setStatus] = useState('paid');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'despesa');
      setDescription(editingTransaction.description || '');
      setAmount(editingTransaction.amount ? editingTransaction.amount.toString() : '');
      setCategory(editingTransaction.category || 'moradia');
      setAccountId(editingTransaction.accountId || accounts[0]?.id);
      setToAccountId(editingTransaction.toAccountId || accounts[1]?.id);
      setDate(editingTransaction.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingTransaction.paymentMethod || 'pix');
      setStatus(editingTransaction.status || 'paid');
      setNotes(editingTransaction.notes || '');
    } else {
      setType('despesa');
      setDescription('');
      setAmount('');
      setCategory('alimentacao');
      setAccountId(accounts[0]?.id || '');
      setToAccountId(accounts[1]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('pix');
      setStatus('paid');
      setNotes('');
    }
  }, [editingTransaction, isOpen, accounts]);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'receita') {
      setCategory('salario');
    } else if (newType === 'despesa') {
      setCategory('alimentacao');
    } else if (newType === 'transferencia') {
      setCategory('investimentos');
      setDescription('Transferência entre contas');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Por favor, informe a descrição da transação.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (type === 'transferencia' && accountId === toAccountId) {
      alert('A conta de origem e destino devem ser diferentes.');
      return;
    }

    onSave({
      ...(editingTransaction ? { id: editingTransaction.id } : {}),
      type,
      description: description.trim(),
      amount: parsedAmount,
      category,
      accountId,
      ...(type === 'transferencia' ? { toAccountId } : {}),
      date,
      paymentMethod,
      status,
      notes: notes.trim()
    });

    onClose();
  };

  if (!isOpen) return null;

  const filteredCategories = CATEGORIES.filter(c => type === 'transferencia' ? true : c.type === type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
            {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Type Selector Toggle (Despesa / Receita / Transferência) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => handleTypeChange('despesa')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                borderRadius: '10px',
                border: type === 'despesa' ? '2px solid var(--accent-expense)' : '1px solid var(--border-color)',
                background: type === 'despesa' ? 'var(--accent-expense-bg)' : 'transparent',
                color: type === 'despesa' ? 'var(--accent-expense)' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowDownCircle size={16} /> Despesa
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('receita')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                borderRadius: '10px',
                border: type === 'receita' ? '2px solid var(--accent-income)' : '1px solid var(--border-color)',
                background: type === 'receita' ? 'var(--accent-income-bg)' : 'transparent',
                color: type === 'receita' ? 'var(--accent-income)' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowUpCircle size={16} /> Receita
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('transferencia')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px',
                borderRadius: '10px',
                border: type === 'transferencia' ? '2px solid #06b6d4' : '1px solid var(--border-color)',
                background: type === 'transferencia' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: type === 'transferencia' ? '#06b6d4' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowRightLeft size={16} /> Transferência
            </button>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ex: Supermercado, Salário, Aporte Reserva..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Accounts Selector */}
          {type === 'transferencia' ? (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Conta de Origem (Sai da)</label>
                <select 
                  className="form-select"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id} style={{ background: 'var(--bg-modal)' }}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Conta de Destino (Vai para)</label>
                <select 
                  className="form-select"
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id} style={{ background: 'var(--bg-modal)' }}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Conta / Carteira</label>
              <select 
                className="form-select"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id} style={{ background: 'var(--bg-modal)' }}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount & Date Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Valor (R$)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>
                  R$
                </span>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Data</label>
              <input 
                type="date" 
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category & Payment Method Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select 
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id} style={{ background: 'var(--bg-modal)' }}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Forma de Pagamento</label>
              <select 
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm.id} value={pm.id} style={{ background: 'var(--bg-modal)' }}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="form-group">
            <label className="form-label">Status do Lançamento</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input 
                  type="radio" 
                  name="status" 
                  value="paid" 
                  checked={status === 'paid'}
                  onChange={() => setStatus('paid')} 
                />
                <span className="badge badge-paid" style={{ textTransform: 'none' }}>
                  Efetivado / Pago
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input 
                  type="radio" 
                  name="status" 
                  value="pending" 
                  checked={status === 'pending'}
                  onChange={() => setStatus('pending')} 
                />
                <span className="badge badge-pending" style={{ textTransform: 'none' }}>
                  Pendente / Agendado
                </span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Observações (Opcional)</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Detalhes adicionais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={`btn ${type === 'receita' ? 'btn-success' : 'btn-primary'}`}>
              <Check size={18} />
              {editingTransaction ? 'Salvar Alterações' : 'Adicionar Lançamento'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
