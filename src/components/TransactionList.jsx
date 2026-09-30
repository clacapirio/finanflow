import React from 'react';
import { 
  Search, Edit2, Trash2, CheckCircle2, Clock, 
  Download, Plus, AlertCircle, ArrowRightLeft 
} from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../constants/categories';
import { formatCurrency, formatDate, exportToCSV } from '../utils/formatters';

export function TransactionList({
  transactions,
  accounts,
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
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenNewModal
}) {
  
  const categoryMap = React.useMemo(() => {
    const map = {};
    CATEGORIES.forEach(c => { map[c.id] = c; });
    return map;
  }, []);

  const accountMap = React.useMemo(() => {
    const map = {};
    (accounts || []).forEach(a => { map[a.id] = a; });
    return map;
  }, [accounts]);

  const paymentMethodMap = React.useMemo(() => {
    const map = {};
    PAYMENT_METHODS.forEach(pm => { map[pm.id] = pm.name; });
    return map;
  }, []);

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      
      {/* Header & Controls Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Lançamentos & Movimentações</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total de {transactions.length} registro(s) encontrado(s)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => exportToCSV(transactions)}
              style={{ fontSize: '0.8rem', padding: '8px 14px' }}
              title="Exportar para arquivo CSV (Excel)"
            >
              <Download size={16} />
              <span>Exportar CSV</span>
            </button>

            <button 
              className="btn btn-primary"
              onClick={onOpenNewModal}
              style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            >
              <Plus size={16} />
              <span>Novo Lançamento</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          
          {/* Search Box */}
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Buscar por descrição, nota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
            />
          </div>

          {/* Filter Type Pills */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setFilterType('ALL')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: filterType === 'ALL' ? 'var(--accent-primary)' : 'transparent',
                color: filterType === 'ALL' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilterType('receita')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: filterType === 'receita' ? 'var(--accent-income)' : 'transparent',
                color: filterType === 'receita' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Receitas
            </button>
            <button 
              onClick={() => setFilterType('despesa')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: filterType === 'despesa' ? 'var(--accent-expense)' : 'transparent',
                color: filterType === 'despesa' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Despesas
            </button>
            <button 
              onClick={() => setFilterType('transferencia')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: filterType === 'transferencia' ? '#06b6d4' : 'transparent',
                color: filterType === 'transferencia' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Transf.
            </button>
          </div>

          {/* Account Dropdown Filter */}
          <select 
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="form-select"
            style={{ width: 'auto', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="ALL" style={{ background: 'var(--bg-modal)' }}>Todas as Contas</option>
            {(accounts || []).map(a => (
              <option key={a.id} value={a.id} style={{ background: 'var(--bg-modal)' }}>
                {a.name}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-select"
            style={{ width: 'auto', height: '38px', fontSize: '0.85rem' }}
          >
            <option value="ALL" style={{ background: 'var(--bg-modal)' }}>Todas Categorias</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id} style={{ background: 'var(--bg-modal)' }}>
                {c.name}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* Table / List Container */}
      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          <AlertCircle size={36} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Nenhum lançamento encontrado
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
            Tente ajustar os filtros ou adicione uma nova transação.
          </p>
          <button className="btn btn-primary" onClick={onOpenNewModal}>
            <Plus size={16} /> Adicionar Lançamento
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px' }}>Data</th>
                <th style={{ padding: '12px 14px' }}>Descrição</th>
                <th style={{ padding: '12px 14px' }}>Conta</th>
                <th style={{ padding: '12px 14px' }}>Categoria</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Valor</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => {
                const catInfo = categoryMap[t.category] || { name: t.category, color: '#64748b' };
                const sourceAcc = accountMap[t.accountId]?.name || 'Conta';
                const targetAcc = accountMap[t.toAccountId]?.name || 'Conta';

                return (
                  <tr 
                    key={t.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Date */}
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.8125rem' }}>
                      {formatDate(t.date)}
                    </td>

                    {/* Description & Notes */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {t.type === 'transferencia' && <ArrowRightLeft size={14} color="#06b6d4" />}
                        {t.description}
                      </div>
                      {t.notes && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                          {t.notes}
                        </div>
                      )}
                    </td>

                    {/* Account Name */}
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {t.type === 'transferencia' ? (
                        <span>{sourceAcc} ➔ {targetAcc}</span>
                      ) : (
                        <span>{sourceAcc}</span>
                      )}
                    </td>

                    {/* Category Tag */}
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: `${catInfo.color}20`,
                        color: catInfo.color,
                        border: `1px solid ${catInfo.color}40`
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: catInfo.color }} />
                        {catInfo.name}
                      </span>
                    </td>

                    {/* Status Badge Toggle */}
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => onToggleStatus(t.id)}
                        title="Clique para alternar Pago / Pendente"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {t.status === 'paid' ? (
                          <span className="badge badge-paid">
                            <CheckCircle2 size={12} /> {t.type === 'receita' ? 'Recebido' : 'Efetivado'}
                          </span>
                        ) : (
                          <span className="badge badge-pending">
                            <Clock size={12} /> Pendente
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Amount */}
                    <td style={{
                      padding: '12px 14px',
                      textAlign: 'right',
                      fontWeight: '700',
                      whiteSpace: 'nowrap',
                      fontSize: '0.95rem',
                      color: t.type === 'receita' 
                        ? 'var(--accent-income)' 
                        : t.type === 'despesa' 
                          ? 'var(--accent-expense)' 
                          : '#06b6d4'
                    }}>
                      {t.type === 'receita' ? '+' : t.type === 'despesa' ? '-' : '⇄'} {formatCurrency(t.amount)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => onEdit(t)}
                          title="Editar lançamento"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => onDelete(t.id)}
                          title="Excluir lançamento"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
