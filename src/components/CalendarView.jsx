import React from 'react';
import { Calendar, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export function CalendarView({ upcomingBills, onToggleStatus, onOpenNewModal }) {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Agenda de Vencimentos & Pendências</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Acompanhe e quite suas contas em dia para evitar juros ou esquecimentos.
              </p>
            </div>
          </div>

          <button className="btn btn-primary" onClick={onOpenNewModal}>
            + Agendar Nova Conta
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>
          Próximas Contas a Pagar ({upcomingBills.length})
        </h3>

        {upcomingBills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <CheckCircle2 size={36} color="var(--accent-income)" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent-income)' }}>
              Parabéns! Nenhuma conta pendente gravada.
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              Todas as suas obrigações financeiras do período estão em dia.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingBills.map(bill => {
              const isOverdue = bill.date < todayStr;
              const isToday = bill.date === todayStr;

              return (
                <div 
                  key={bill.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: isOverdue 
                      ? 'rgba(244, 63, 94, 0.1)' 
                      : isToday 
                        ? 'rgba(245, 158, 11, 0.1)' 
                        : 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${isOverdue ? 'rgba(244, 63, 94, 0.3)' : isToday ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isOverdue ? '#f43f5e' : isToday ? '#f59e0b' : 'var(--accent-primary)'
                    }}>
                      <Clock size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{bill.description}</h4>
                        {isOverdue && (
                          <span className="badge badge-expense" style={{ fontSize: '0.65rem' }}>
                            <AlertTriangle size={10} /> Atrasado
                          </span>
                        )}
                        {isToday && (
                          <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>
                            Vence Hoje
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Vencimento: <strong>{formatDate(bill.date)}</strong> {bill.notes ? `• ${bill.notes}` : ''}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-expense)' }}>
                      {formatCurrency(bill.amount)}
                    </div>

                    <button 
                      className="btn btn-success"
                      onClick={() => onToggleStatus(bill.id)}
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      title="Dar baixa e marcar como pago"
                    >
                      <CheckCircle2 size={16} /> Dar Baixa (Pago)
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
