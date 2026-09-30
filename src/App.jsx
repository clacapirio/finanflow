import React, { useState } from 'react';
import { useFinance } from './hooks/useFinance';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { ChartsSection } from './components/ChartsSection';
import { FinancialHealth } from './components/FinancialHealth';
import { TransactionList } from './components/TransactionList';
import { CategoryBudgets } from './components/CategoryBudgets';
import { AccountsView } from './components/AccountsView';
import { CalendarView } from './components/CalendarView';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { CloudStatusBanner } from './components/CloudStatusBanner';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ShieldCheck } from 'lucide-react';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const {
    transactions,
    filteredTransactions,
    accounts,
    accountBalances,
    netWorthMetrics,
    selectedPeriod,
    setSelectedPeriod,
    availablePeriods,
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
    metrics,
    categoryExpenses,
    categoryBudgets,
    monthlyFlowData,
    upcomingBills,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toggleTransactionStatus,
    addAccount,
    updateAccount,
    deleteAccount,
    updateCategoryBudget,
    loadDemoData,
    clearAllData,
    importFromJSON
  } = useFinance();

  const handleOpenNewModal = () => {
    setEditingTransaction(null);
    setIsTxModalOpen(true);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const handleSaveTransaction = (txData) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, txData);
    } else {
      addTransaction(txData);
    }
  };

  const handleDeleteTransaction = (id) => {
    if (confirm('Deseja realmente apagar este lançamento?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className={`app-root ${isDarkMode ? 'dark-theme' : 'light-theme'}`} style={{ paddingBottom: '70px' }}>
      <div className="app-container">
        
        {/* Navigation Bar & Tabs */}
        <Navbar 
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          availablePeriods={availablePeriods}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewModal={handleOpenNewModal}
          loadDemoData={loadDemoData}
          clearAllData={clearAllData}
          importFromJSON={importFromJSON}
          transactions={transactions}
          categoryBudgets={categoryBudgets}
          accounts={accounts}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        {/* Cloud / Family Sync Status Banner */}
        <CloudStatusBanner 
          isCloudConnected={Boolean(activeUser)}
          activeUser={activeUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Tab 1: Dashboard (Visão Geral) */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <SummaryCards metrics={metrics} />

            <FinancialHealth 
              metrics={metrics} 
              categoryExpenses={categoryExpenses} 
              transactions={filteredTransactions} 
            />

            <ChartsSection 
              categoryExpenses={categoryExpenses} 
              monthlyFlowData={monthlyFlowData} 
            />

            <div className="main-content-grid">
              <div>
                <TransactionList 
                  transactions={filteredTransactions.slice(0, 8)}
                  accounts={accounts}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  filterAccount={filterAccount}
                  setFilterAccount={setFilterAccount}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteTransaction}
                  onToggleStatus={toggleTransactionStatus}
                  onOpenNewModal={handleOpenNewModal}
                />
              </div>

              <div>
                <CategoryBudgets 
                  categoryExpenses={categoryExpenses}
                  categoryBudgets={categoryBudgets}
                  onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Accounts & Wallets */}
        {activeTab === 'accounts' && (
          <div className="animate-fade-in">
            <AccountsView 
              accounts={accounts}
              accountBalances={accountBalances}
              netWorthMetrics={netWorthMetrics}
              onAddAccount={addAccount}
              onEditAccount={updateAccount}
              onDeleteAccount={deleteAccount}
              onOpenTransferModal={handleOpenNewModal}
            />
          </div>
        )}

        {/* Tab 3: Transactions Full View */}
        {activeTab === 'transactions' && (
          <div className="animate-fade-in">
            <TransactionList 
              transactions={filteredTransactions}
              accounts={accounts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterAccount={filterAccount}
              setFilterAccount={setFilterAccount}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTransaction}
              onToggleStatus={toggleTransactionStatus}
              onOpenNewModal={handleOpenNewModal}
            />
          </div>
        )}

        {/* Tab 4: Calendar & Upcoming Bills */}
        {activeTab === 'calendar' && (
          <div className="animate-fade-in">
            <CalendarView 
              upcomingBills={upcomingBills}
              onToggleStatus={toggleTransactionStatus}
              onOpenNewModal={handleOpenNewModal}
            />
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--accent-income)" />
            <span>FinanFlow App — Dados seguros e integrados.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={clearAllData}
              style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', opacity: 0.8 }}
            >
              Resetar Todos os Dados
            </button>
            <span>FinanFlow App &copy; {new Date().getFullYear()}</span>
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewModal={handleOpenNewModal}
        />

        {/* Modals */}
        <TransactionModal 
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          onSave={handleSaveTransaction}
          editingTransaction={editingTransaction}
          accounts={accounts}
        />

        <BudgetModal 
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          categoryBudgets={categoryBudgets}
          onSaveBudget={updateCategoryBudget}
        />

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(userData) => setActiveUser(userData)}
        />

      </div>
    </div>
  );
}

export default App;
