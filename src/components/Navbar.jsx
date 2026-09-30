import React, { useRef } from 'react';
import { 
  Wallet, PlusCircle, Download, Upload, 
  Sun, Moon, Calendar, Sparkles, LayoutDashboard, CreditCard, ListFilter, Clock
} from 'lucide-react';
import { getMonthName, exportToJSON } from '../utils/formatters';

export function Navbar({ 
  selectedPeriod, 
  setSelectedPeriod, 
  availablePeriods, 
  activeTab,
  setActiveTab,
  onOpenNewModal, 
  loadDemoData, 
  importFromJSON,
  transactions,
  categoryBudgets,
  accounts,
  isDarkMode,
  setIsDarkMode
}) {
  const fileInputRef = useRef(null);

  const handleExportBackup = () => {
    exportToJSON({ transactions, budgets: categoryBudgets, accounts });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        importFromJSON(parsed);
      } catch (err) {
        alert('Erro ao carregar o arquivo JSON. Certifique-se que o arquivo é válido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="glass-card" style={{ marginBottom: '24px', padding: '16px 24px', borderRadius: '16px' }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Wallet size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', margin: 0 }}>
                Finan<span style={{ color: 'var(--accent-primary)' }}>Flow</span>
              </h1>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.65rem' }}>
                Full Hybrid MVP
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Controle Financeiro Pessoal Completo & Privado
            </p>
          </div>
        </div>

        {/* Center: Period selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 0, 0, 0.2)', padding: '6px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <Calendar size={18} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500' }}>Período:</span>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontWeight: '700',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL" style={{ background: 'var(--bg-modal)' }}>Todos os Tempos</option>
            {availablePeriods.map(p => (
              <option key={p} value={p} style={{ background: 'var(--bg-modal)' }}>
                {getMonthName(p)}
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          <button 
            className="btn btn-secondary" 
            onClick={loadDemoData}
            title="Carregar exemplo de transações e contas"
            style={{ fontSize: '0.8rem', padding: '8px 12px' }}
          >
            <Sparkles size={16} color="#f59e0b" />
            <span>Dados de Exemplo</span>
          </button>

          <button 
            className="btn btn-icon" 
            onClick={handleExportBackup}
            title="Exportar Backup dos Dados (JSON)"
          >
            <Download size={18} />
          </button>

          <button 
            className="btn btn-icon" 
            onClick={() => fileInputRef.current?.click()}
            title="Restaurar Backup JSON"
          >
            <Upload size={18} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            style={{ display: 'none' }} 
          />

          <button 
            className="btn btn-icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Alternar Tema Claro / Escuro"
          >
            {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          <button 
            className="btn btn-primary" 
            onClick={onOpenNewModal}
            style={{ padding: '9px 16px' }}
          >
            <PlusCircle size={18} />
            <span>Novo Lançamento</span>
          </button>

        </div>

      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'dashboard' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LayoutDashboard size={16} /> Visão Geral (Dashboard)
        </button>

        <button
          onClick={() => setActiveTab('accounts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'accounts' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'accounts' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <CreditCard size={16} /> Contas & Carteiras
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'transactions' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'transactions' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ListFilter size={16} /> Lançamentos
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'calendar' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'calendar' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Clock size={16} /> Vencimentos & Agenda
        </button>
      </nav>

    </header>
  );
}
