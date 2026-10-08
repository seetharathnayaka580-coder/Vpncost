/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  loadExpenses, 
  saveExpenses, 
  loadSales, 
  saveSales, 
  resetToSampleData 
} from './utils/storage';
import { getCurrentMonthStr, formatMonthName, formatLKR } from './utils/formatters';
import { VpnExpense, ClientSale, MonthSummary } from './types';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { ExpenseManager } from './components/ExpenseManager';
import { SalesManager } from './components/SalesManager';
import { ClientReceiptModal } from './components/ClientReceiptModal';
import { PricingCalculatorModal } from './components/PricingCalculatorModal';
import { ExportModal } from './components/ExportModal';
import { LoginPage } from './components/LoginPage';
import { InstallChromeAppModal } from './components/InstallChromeAppModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { getSavedUser, saveUser, clearUser, AuthUser } from './utils/authSession';
import { 
  subscribeExpenses,
  subscribeSales,
  writeExpenseToFirestore,
  deleteExpenseFromFirestore,
  writeSaleToFirestore,
  deleteSaleFromFirestore,
  syncLocalDataToFirestore
} from './services/firebaseSync';
import { 
  Server, 
  Users, 
  Layers, 
  HelpCircle, 
  Plus, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonthStr());
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getSavedUser());
  const [expenses, setExpenses] = useState<VpnExpense[]>([]);
  const [sales, setSales] = useState<ClientSale[]>([]);
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses' | 'all'>('all');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const isInitialSyncDone = useRef<boolean>(false);

  // Chrome PWA Install Hook
  const { 
    isInstallable, 
    isInstalled, 
    isIOS, 
    showGuideModal, 
    setShowGuideModal, 
    triggerInstall 
  } = usePWAInstall();

  // Modals state
  const [selectedSaleForReceipt, setSelectedSaleForReceipt] = useState<ClientSale | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize data from localStorage initially for instantaneous first paint
  useEffect(() => {
    const loadedExp = loadExpenses();
    const loadedSl = loadSales();
    setExpenses(loadedExp);
    setSales(loadedSl);
  }, []);

  // Automatically connect & subscribe to Firebase Firestore in real-time
  useEffect(() => {
    let unsubExpenses: (() => void) | undefined;
    let unsubSales: (() => void) | undefined;

    setIsSyncing(true);

    try {
      unsubExpenses = subscribeExpenses((cloudExpenses) => {
        setIsSyncing(false);
        if (cloudExpenses && cloudExpenses.length > 0) {
          setExpenses(cloudExpenses);
          saveExpenses(cloudExpenses);
          isInitialSyncDone.current = true;
        } else if (!isInitialSyncDone.current) {
          // If Firestore is empty initially, seed existing local data to Firestore
          const localExp = loadExpenses();
          const localSl = loadSales();
          syncLocalDataToFirestore(localExp, localSl).then(() => {
            isInitialSyncDone.current = true;
          }).catch(console.error);
        }
      });

      unsubSales = subscribeSales((cloudSales) => {
        setIsSyncing(false);
        if (cloudSales && cloudSales.length > 0) {
          setSales(cloudSales);
          saveSales(cloudSales);
          isInitialSyncDone.current = true;
        }
      });
    } catch (err) {
      console.warn('Real-time Firestore listener fallback:', err);
      setIsSyncing(false);
    }

    return () => {
      if (unsubExpenses) unsubExpenses();
      if (unsubSales) unsubSales();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Filter expenses and sales for current month
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter((e) => e.month === currentMonth || !e.month);
  }, [expenses, currentMonth]);

  const currentMonthSales = useMemo(() => {
    return sales.filter((s) => s.month === currentMonth || !s.month);
  }, [sales, currentMonth]);

  // Compute Financial Summary for current month
  const summary: MonthSummary = useMemo(() => {
    const activeExpenses = currentMonthExpenses.filter((e) => e.isActive);
    const totalExpenseLkr = activeExpenses.reduce((sum, e) => sum + e.costLkr, 0);

    const totalRevenueLkr = currentMonthSales.reduce((sum, s) => sum + s.paymentReceivedLkr, 0);
    const totalAgreedLkr = currentMonthSales.reduce(
      (sum, s) => sum + (s.agreedPriceLkr || s.paymentReceivedLkr),
      0
    );
    const totalPendingLkr = Math.max(0, totalAgreedLkr - totalRevenueLkr);
    const totalDataSoldGb = currentMonthSales.reduce((sum, s) => sum + s.dataSoldGb, 0);

    const netProfitLkr = totalRevenueLkr - totalExpenseLkr;
    const profitMarginPercent = totalRevenueLkr > 0 ? (netProfitLkr / totalRevenueLkr) * 100 : 0;
    const avgPricePerGb = totalDataSoldGb > 0 ? totalRevenueLkr / totalDataSoldGb : 0;
    const costPerGb = totalDataSoldGb > 0 ? totalExpenseLkr / totalDataSoldGb : 0;

    // Calculate total bandwidth pool across active servers (TB to GB)
    const totalBandwidthCapacityGb = activeExpenses.reduce((sum, e) => {
      const tb = e.bandwidthLimitTb || (e.name.toLowerCase().includes('leaseweb') ? 30 : 0);
      return sum + (tb * 1000); // 30 TB = 30,000 GB
    }, 0);

    const remainingBandwidthGb = Math.max(0, totalBandwidthCapacityGb - totalDataSoldGb);
    const bandwidthUsagePercent = totalBandwidthCapacityGb > 0 
      ? (totalDataSoldGb / totalBandwidthCapacityGb) * 100 
      : 0;

    return {
      month: currentMonth,
      totalExpenseLkr,
      totalRevenueLkr,
      totalAgreedLkr,
      totalPendingLkr,
      totalDataSoldGb,
      netProfitLkr,
      profitMarginPercent,
      avgPricePerGb,
      costPerGb,
      clientCount: currentMonthSales.length,
      totalBandwidthCapacityGb,
      remainingBandwidthGb,
      bandwidthUsagePercent,
    };
  }, [currentMonth, currentMonthExpenses, currentMonthSales]);

  // Expense Handlers (Syncs with Firebase Firestore automatically)
  const handleAddExpense = async (newExpenseData: Omit<VpnExpense, 'id' | 'createdAt'>) => {
    const newExpense: VpnExpense = {
      ...newExpenseData,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);

    try {
      setIsSyncing(true);
      await writeExpenseToFirestore(newExpense);
    } catch (err) {
      console.warn('Firestore write warning:', err);
    } finally {
      setIsSyncing(false);
    }

    showNotification(`Added expense: ${newExpense.name} (${formatLKR(newExpense.costLkr)})`);
  };

  const handleUpdateExpense = async (id: string, updates: Partial<VpnExpense>) => {
    const updated = expenses.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setExpenses(updated);
    saveExpenses(updated);

    const itemToSave = updated.find((e) => e.id === id);
    if (itemToSave) {
      try {
        setIsSyncing(true);
        await writeExpenseToFirestore(itemToSave);
      } catch (err) {
        console.warn('Firestore update warning:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    showNotification('Server expense updated');
  };

  const handleDeleteExpense = async (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);

    try {
      setIsSyncing(true);
      await deleteExpenseFromFirestore(id);
    } catch (err) {
      console.warn('Firestore delete warning:', err);
    } finally {
      setIsSyncing(false);
    }

    showNotification('Expense removed');
  };

  // Sales Handlers (Syncs with Firebase Firestore automatically)
  const handleAddSale = async (newSaleData: Omit<ClientSale, 'id' | 'createdAt'>) => {
    const newSale: ClientSale = {
      ...newSaleData,
      id: `sale-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newSale, ...sales];
    setSales(updated);
    saveSales(updated);

    try {
      setIsSyncing(true);
      await writeSaleToFirestore(newSale);
    } catch (err) {
      console.warn('Firestore sale write warning:', err);
    } finally {
      setIsSyncing(false);
    }

    showNotification(`Recorded sale for ${newSale.clientName}: ${newSale.dataSoldGb} GB`);
  };

  const handleUpdateSale = async (id: string, updates: Partial<ClientSale>) => {
    const updated = sales.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSales(updated);
    saveSales(updated);

    const itemToSave = updated.find((s) => s.id === id);
    if (itemToSave) {
      try {
        setIsSyncing(true);
        await writeSaleToFirestore(itemToSave);
      } catch (err) {
        console.warn('Firestore sale update warning:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    showNotification('Sale updated');
  };

  const handleDeleteSale = async (id: string) => {
    const updated = sales.filter((s) => s.id !== id);
    setSales(updated);
    saveSales(updated);

    try {
      setIsSyncing(true);
      await deleteSaleFromFirestore(id);
    } catch (err) {
      console.warn('Firestore sale delete warning:', err);
    } finally {
      setIsSyncing(false);
    }

    showNotification('Sale record removed');
  };

  // Carry forward recurring expenses to next month (Syncs to Firebase)
  const handleDuplicateToNextMonth = async () => {
    const [yearStr, monthStr] = currentMonth.split('-');
    let nextYear = parseInt(yearStr, 10);
    let nextMonth = parseInt(monthStr, 10) + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    const nextMonthStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;

    const newExpensesToClone = currentMonthExpenses
      .filter((e) => e.isActive)
      .map((e) => ({
        ...e,
        id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        month: nextMonthStr,
        createdAt: new Date().toISOString(),
      }));

    if (newExpensesToClone.length === 0) {
      showNotification('No active expenses to copy.');
      return;
    }

    const updated = [...newExpensesToClone, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    setCurrentMonth(nextMonthStr);

    try {
      setIsSyncing(true);
      for (const item of newExpensesToClone) {
        await writeExpenseToFirestore(item);
      }
    } catch (err) {
      console.warn('Firestore clone warning:', err);
    } finally {
      setIsSyncing(false);
    }

    showNotification(
      `Copied ${newExpensesToClone.length} server expenses to ${formatMonthName(nextMonthStr)}!`
    );
  };

  // Reset to sample data
  const handleResetData = async () => {
    if (window.confirm('Reset data to default Leaseweb Singapore server & sample clients?')) {
      const reset = resetToSampleData();
      setExpenses(reset.expenses);
      setSales(reset.sales);

      try {
        setIsSyncing(true);
        await syncLocalDataToFirestore(reset.expenses, reset.sales);
      } catch (err) {
        console.warn('Firestore reset sync warning:', err);
      } finally {
        setIsSyncing(false);
      }

      showNotification('Sample Leaseweb data loaded and synced to Firebase');
    }
  };

  // Import JSON data
  const handleImportData = async (data: { expenses?: VpnExpense[]; sales?: ClientSale[] }) => {
    if (data.expenses) {
      setExpenses(data.expenses);
      saveExpenses(data.expenses);
    }
    if (data.sales) {
      setSales(data.sales);
      saveSales(data.sales);
    }
    try {
      setIsSyncing(true);
      await syncLocalDataToFirestore(data.expenses || expenses, data.sales || sales);
    } catch (err) {
      console.warn('Firestore import sync warning:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // If not logged in with username-xxx, render the dedicated Password-Free Login Page
  if (!currentUser) {
    return (
      <>
        <LoginPage
          onLogin={(username) => {
            const user = saveUser(username);
            setCurrentUser(user);
            showNotification(`Welcome, ${user.username}! Session ready.`);
          }}
          onOpenInstallModal={triggerInstall}
          isInstallable={isInstallable}
          isInstalled={isInstalled}
        />
        <InstallChromeAppModal
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          isIOS={isIOS}
          onTriggerInstall={triggerInstall}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header with live automatic sync indicator */}
      <Header
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        summary={summary}
        isSyncing={isSyncing}
        currentUser={currentUser.username}
        onLogout={() => {
          clearUser();
          setCurrentUser(null);
        }}
        onOpenCalculator={() => setIsPricingModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onResetData={handleResetData}
        onOpenInstallModal={triggerInstall}
        isInstalled={isInstalled}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-800 border border-slate-700 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI / Stats Section */}
        <StatsCards
          summary={summary}
          expensesCount={currentMonthExpenses.length}
        />

        {/* View Toggle Tabs for Mobile / Desktop convenience */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              All Panels
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Client Data Sales ({currentMonthSales.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'expenses'
                  ? 'bg-slate-800 text-rose-300 border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-rose-400" />
              Server Expenses ({currentMonthExpenses.length})
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Viewing: <span className="font-semibold text-slate-300">{formatMonthName(currentMonth)}</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="space-y-6">
          {/* Client Data Sales Ledger */}
          {(activeTab === 'all' || activeTab === 'sales') && (
            <SalesManager
              sales={currentMonthSales}
              expenses={currentMonthExpenses}
              currentMonth={currentMonth}
              onAddSale={handleAddSale}
              onUpdateSale={handleUpdateSale}
              onDeleteSale={handleDeleteSale}
              onSelectForReceipt={setSelectedSaleForReceipt}
            />
          )}

          {/* Monthly Server Expenses Manager */}
          {(activeTab === 'all' || activeTab === 'expenses') && (
            <ExpenseManager
              expenses={currentMonthExpenses}
              currentMonth={currentMonth}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              onDuplicateToNextMonth={handleDuplicateToNextMonth}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            VPN Bandwidth Ledger & Monthly Expense Tracker • Sri Lankan Rupee (LKR)
          </div>
          <div className="text-slate-400 flex items-center gap-1.5">
            <span>Primary Node: Leaseweb Singapore (4 vCPU • 6G RAM • 100G NVMe • 30 TB Bandwidth • LKR 2,150/mo)</span>
          </div>
        </div>
      </footer>

      {/* Client Receipt Slip Modal */}
      <ClientReceiptModal
        sale={selectedSaleForReceipt}
        onClose={() => setSelectedSaleForReceipt(null)}
      />

      {/* Pricing / Break-even Simulator Modal */}
      <PricingCalculatorModal
        serverMonthlyCostLkr={summary.totalExpenseLkr}
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />

      {/* Export & Backup Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentMonth={currentMonth}
        expenses={currentMonthExpenses}
        sales={currentMonthSales}
        onImportData={handleImportData}
      />

      {/* Chrome App Shortcut Install Guide Modal */}
      <InstallChromeAppModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onTriggerInstall={triggerInstall}
      />
    </div>
  );
}
