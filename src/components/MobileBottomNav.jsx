import React from 'react';
import { LayoutDashboard, CreditCard, Plus, ListFilter, Clock } from 'lucide-react';

export function MobileBottomNav({ activeTab, setActiveTab, onOpenNewModal }) {
  return (
    <div 
      className="mobile-nav-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        background: 'var(--bg-modal)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 900,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.4)',
        padding: '0 10px'
      }}
    >
      {/* 1. Dashboard Tab */}
      <button 
        onClick={() => setActiveTab('dashboard')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          background: 'transparent',
          border: 'none',
          color: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-subtle)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'dashboard' ? '700' : '500',
          cursor: 'pointer'
        }}
      >
        <LayoutDashboard size={20} />
        <span>Início</span>
      </button>

      {/* 2. Accounts Tab */}
      <button 
        onClick={() => setActiveTab('accounts')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          background: 'transparent',
          border: 'none',
          color: activeTab === 'accounts' ? 'var(--accent-primary)' : 'var(--text-subtle)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'accounts' ? '700' : '500',
          cursor: 'pointer'
        }}
      >
        <CreditCard size={20} />
        <span>Contas</span>
      </button>

      {/* 3. Center FAB (Floating Action Button +) */}
      <div style={{ position: 'relative', top: '-16px' }}>
        <button 
          onClick={onOpenNewModal}
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            border: '4px solid var(--bg-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.6)',
            cursor: 'pointer'
          }}
          title="Nova Transação"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* 4. Transactions Tab */}
      <button 
        onClick={() => setActiveTab('transactions')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          background: 'transparent',
          border: 'none',
          color: activeTab === 'transactions' ? 'var(--accent-primary)' : 'var(--text-subtle)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'transactions' ? '700' : '500',
          cursor: 'pointer'
        }}
      >
        <ListFilter size={20} />
        <span>Lançamentos</span>
      </button>

      {/* 5. Calendar Tab */}
      <button 
        onClick={() => setActiveTab('calendar')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          background: 'transparent',
          border: 'none',
          color: activeTab === 'calendar' ? 'var(--accent-primary)' : 'var(--text-subtle)',
          fontSize: '0.68rem',
          fontWeight: activeTab === 'calendar' ? '700' : '500',
          cursor: 'pointer'
        }}
      >
        <Clock size={20} />
        <span>Vencimentos</span>
      </button>

    </div>
  );
}
