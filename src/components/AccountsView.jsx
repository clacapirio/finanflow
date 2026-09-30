import React, { useState } from 'react';
import { 
  Landmark, CreditCard, ShieldCheck, Wallet, Plus, 
  TrendingUp, ArrowRightLeft, Edit2, Trash2, Banknote, PiggyBank, DollarSign
} from 'lucide-react';
import { ACCOUNT_TYPES } from '../constants/accounts';
import { formatCurrency } from '../utils/formatters';

export function AccountsView({ accounts, accountBalances, netWorthMetrics, onAddAccount, onEditAccount, onDeleteAccount, onOpenTransferModal }) {
  const { totalAssets, totalLiabilities, pendingDebts, netWorth } = netWorthMetrics;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  
  const [name, setName] = useState('');
  const [type, setType] = useState('checking');
  const [initialBalance, setInitialBalance] = useState('0');
  const [color, setColor] = useState('#a855f7');

  const handleOpenAdd = () => {
    setEditingAcc(null);
    setName('');
    setType('checking');
    setInitialBalance('0');
    setColor('#a855f7');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAcc(acc);
    setName(acc.name);
    setType(acc.type);
    setInitialBalance(acc.initialBalance.toString());
    setColor(acc.color || '#a855f7');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingAcc) {
      onEditAccount(editingAcc.id, {
        name: name.trim(),
        type,
        initialBalance: parseFloat(initialBalance) || 0,
        color
      });
    } else {
      onAddAccount({
        name: name.trim(),
        type,
        initialBalance: parseFloat(initialBalance) || 0,
        color
      });
    }
    setIsModalOpen(false);
  };

  const getAccountIcon = (accType) => {
    switch (accType) {
      case 'credit': return <CreditCard size={20} />;
      case 'investment': return <ShieldCheck size={20} />;
      case 'cash': return <Wallet size={20} />;
      case 'savings': return <PiggyBank size={20} />;
      default: return <Landmark size={20} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Net Worth (Patrimônio Líquido) Summary Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Patrimônio Líquido Consolidado (Net Worth)
            </span>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: netWorth >= 0 ? '#10b981' : '#f43f5e', letterSpacing: '-0.03em', marginTop: '4px' }}>
              {formatCurrency(netWorth)}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Soma de todas as suas contas, investimentos e dinheiro físico menos faturas e pendências.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={onOpenTransferModal} style={{ padding: '10px 16px' }}>
              <ArrowRightLeft size={16} /> Transferência entre Contas
            </button>
            <button className="btn btn-primary" onClick={handleOpenAdd} style={{ padding: '10px 16px' }}>
              <Plus size={16} /> Nova Conta / Carteira
            </button>
          </div>
        </div>

        {/* 3 Metrics breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ativos Totais (Saldos & Reserva)</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-income)' }}>
              {formatCurrency(totalAssets)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Faturas & Dívidas de Cartão</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-expense)' }}>
              {formatCurrency(totalLiabilities)}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contas Pendentes no Mês</span>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b' }}>
              {formatCurrency(pendingDebts)}
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '10px' }}>Suas Contas & Carteiras</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
        {accounts.map(acc => {
          const currentBal = accountBalances[acc.id] || 0;
          return (
            <div key={acc.id} className="glass-card" style={{ position: 'relative', overflow: 'hidden', borderLeft: `4px solid ${acc.color || 'var(--accent-primary)'}` }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: `${acc.color || '#6366f1'}20`,
                    color: acc.color || '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getAccountIcon(acc.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{acc.name}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'capitalize' }}>
                      {ACCOUNT_TYPES.find(t => t.id === acc.type)?.name || acc.type}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn-icon" onClick={() => handleOpenEdit(acc)} title="Editar conta">
                    <Edit2 size={15} />
                  </button>
                  <button className="btn-icon" onClick={() => onDeleteAccount(acc.id)} title="Excluir conta" style={{ color: '#ef4444' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Saldo Atual</span>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', color: currentBal >= 0 ? 'var(--text-main)' : 'var(--accent-expense)' }}>
                  {formatCurrency(currentBal)}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                <span>Saldo Inicial: {formatCurrency(acc.initialBalance)}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                  Ativa
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Account Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
              {editingAcc ? 'Editar Conta / Carteira' : 'Nova Conta / Carteira'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome da Conta (ex: Nubank, Carteira...)</label>
                <input 
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do banco ou carteira"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo de Conta</label>
                  <select 
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {ACCOUNT_TYPES.map(t => (
                      <option key={t.id} value={t.id} style={{ background: 'var(--bg-modal)' }}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Saldo Inicial (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cor de Identificação</label>
                <input 
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Conta</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
