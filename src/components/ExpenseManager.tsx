import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  Trash2, 
  Edit3, 
  Globe, 
  Calendar, 
  Check, 
  X, 
  Copy, 
  Zap,
  Info
} from 'lucide-react';
import { VpnExpense } from '../types';
import { formatLKR, formatMonthName } from '../utils/formatters';

interface ExpenseManagerProps {
  expenses: VpnExpense[];
  currentMonth: string;
  onAddExpense: (expense: Omit<VpnExpense, 'id' | 'createdAt'>) => void;
  onUpdateExpense: (id: string, updates: Partial<VpnExpense>) => void;
  onDeleteExpense: (id: string) => void;
  onDuplicateToNextMonth: () => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  currentMonth,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onDuplicateToNextMonth,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VpnExpense['category']>('server');
  const [costLkr, setCostLkr] = useState<string>('2150');
  const [location, setLocation] = useState('Singapore (SG)');
  const [dcLocation, setDcLocation] = useState('Singapore');
  const [bandwidthLimitTb, setBandwidthLimitTb] = useState<number>(30);
  const [cpuCores, setCpuCores] = useState<number>(4);
  const [ramGb, setRamGb] = useState<number>(6);
  const [diskNvmeGb, setDiskNvmeGb] = useState<number>(100);
  const [billingCycle, setBillingCycle] = useState<VpnExpense['billingCycle']>('monthly');
  const [renewalDay, setRenewalDay] = useState<number>(15);
  const [notes, setNotes] = useState('');

  const openAddModal = (preset?: {
    name: string;
    cost: number;
    location: string;
    category: VpnExpense['category'];
    bandwidthLimitTb?: number;
    cpuCores?: number;
    ramGb?: number;
    diskNvmeGb?: number;
  }) => {
    setEditingId(null);
    if (preset) {
      setName(preset.name);
      setCostLkr(preset.cost.toString());
      setLocation(preset.location);
      setDcLocation(preset.location.includes('Singapore') ? 'Singapore' : preset.location);
      setCategory(preset.category);
      setBandwidthLimitTb(preset.bandwidthLimitTb ?? 30);
      setCpuCores(preset.cpuCores ?? 4);
      setRamGb(preset.ramGb ?? 6);
      setDiskNvmeGb(preset.diskNvmeGb ?? 100);
    } else {
      setName('Leaseweb Singapore Server');
      setCostLkr('2150');
      setLocation('Singapore (SG)');
      setDcLocation('Singapore');
      setCategory('server');
      setBandwidthLimitTb(30);
      setCpuCores(4);
      setRamGb(6);
      setDiskNvmeGb(100);
    }
    setBillingCycle('monthly');
    setRenewalDay(15);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: VpnExpense) => {
    setEditingId(exp.id);
    setName(exp.name);
    setCategory(exp.category);
    setCostLkr(exp.costLkr.toString());
    setLocation(exp.location || '');
    setDcLocation(exp.dcLocation || 'Singapore');
    setBandwidthLimitTb(exp.bandwidthLimitTb ?? (exp.name.toLowerCase().includes('leaseweb') ? 30 : 0));
    setCpuCores(exp.cpuCores ?? (exp.name.toLowerCase().includes('leaseweb') ? 4 : 0));
    setRamGb(exp.ramGb ?? (exp.name.toLowerCase().includes('leaseweb') ? 6 : 0));
    setDiskNvmeGb(exp.diskNvmeGb ?? (exp.name.toLowerCase().includes('leaseweb') ? 100 : 0));
    setBillingCycle(exp.billingCycle);
    setRenewalDay(exp.renewalDayOfMonth || 1);
    setNotes(exp.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(costLkr) || 0;
    if (!name.trim() || cost <= 0) return;

    if (editingId) {
      onUpdateExpense(editingId, {
        name: name.trim(),
        category,
        costLkr: cost,
        location: location.trim(),
        dcLocation: dcLocation.trim(),
        bandwidthLimitTb: category === 'server' ? bandwidthLimitTb : undefined,
        cpuCores: category === 'server' ? cpuCores : undefined,
        ramGb: category === 'server' ? ramGb : undefined,
        diskNvmeGb: category === 'server' ? diskNvmeGb : undefined,
        billingCycle,
        renewalDayOfMonth: renewalDay,
        notes: notes.trim(),
      });
    } else {
      onAddExpense({
        name: name.trim(),
        category,
        costLkr: cost,
        location: location.trim(),
        dcLocation: dcLocation.trim(),
        bandwidthLimitTb: category === 'server' ? bandwidthLimitTb : undefined,
        cpuCores: category === 'server' ? cpuCores : undefined,
        ramGb: category === 'server' ? ramGb : undefined,
        diskNvmeGb: category === 'server' ? diskNvmeGb : undefined,
        billingCycle,
        renewalDayOfMonth: renewalDay,
        month: currentMonth,
        notes: notes.trim(),
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  const totalExpense = expenses
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + e.costLkr, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-950/70 border border-rose-800/80 text-rose-400">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              Monthly Server & Infrastructure Expenses
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {expenses.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fixed monthly infrastructure costs for {formatMonthName(currentMonth)} (Total: <span className="font-semibold text-rose-300">{formatLKR(totalExpense)}</span>)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDuplicateToNextMonth}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Carry forward all current monthly expenses to next month"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Copy to</span> Next Month
          </button>

          <button
            type="button"
            onClick={() => openAddModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Server Expense
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Quick Add:
        </span>
        <button
          type="button"
          onClick={() => openAddModal({ 
            name: 'Leaseweb Singapore Server', 
            cost: 2150, 
            location: 'Singapore (SG)', 
            category: 'server',
            bandwidthLimitTb: 30,
            cpuCores: 4,
            ramGb: 6,
            diskNvmeGb: 100
          })}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-rose-300 hover:text-white transition-colors"
        >
          + Leaseweb SG 30TB (4vCPU / 6G RAM / 100G NVMe - LKR 2,150)
        </button>
        <button
          type="button"
          onClick={() => openAddModal({ name: 'Linode SG Node', cost: 1850, location: 'Singapore (SG)', category: 'server', bandwidthLimitTb: 4, cpuCores: 2, ramGb: 4, diskNvmeGb: 80 })}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
        >
          + Linode SG (LKR 1,850)
        </button>
        <button
          type="button"
          onClick={() => openAddModal({ name: 'Domain & Cloudflare DNS', cost: 450, location: 'Global CDN', category: 'domain' })}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
        >
          + Cloudflare / Domain (LKR 450)
        </button>
      </div>

      {/* Expense List Table / Cards */}
      <div className="divide-y divide-slate-800/60">
        {expenses.length === 0 ? (
          <div className="p-8 text-center">
            <Server className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium text-slate-300">No server expenses recorded for this month</p>
            <p className="text-xs text-slate-500 mt-1">
              Add your monthly VPN server bill (e.g. Leaseweb Singapore 30TB at LKR 2,150) to start calculating profit.
            </p>
            <button
              type="button"
              onClick={() => openAddModal()}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500"
            >
              <Plus className="w-3.5 h-3.5" /> Add Leaseweb Server (LKR 2,150)
            </button>
          </div>
        ) : (
          expenses.map((expense) => {
            const isLeaseweb = expense.name.toLowerCase().includes('leaseweb');
            const bandwidthTb = expense.bandwidthLimitTb ?? (isLeaseweb ? 30 : null);
            const cpu = expense.cpuCores ?? (isLeaseweb ? 4 : null);
            const ram = expense.ramGb ?? (isLeaseweb ? 6 : null);
            const disk = expense.diskNvmeGb ?? (isLeaseweb ? 100 : null);

            return (
              <div
                key={expense.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors ${
                  !expense.isActive ? 'opacity-60 bg-slate-950/40' : ''
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-800/70 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 sm:mt-0">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">
                        {expense.name}
                      </span>
                      {expense.location && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          <Globe className="w-3 h-3 text-cyan-400" />
                          {expense.location}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-950 text-rose-300 border border-rose-800/80">
                        {expense.category}
                      </span>
                    </div>

                    {/* Hardware & Bandwidth Specs Badge Row */}
                    {(bandwidthTb || cpu || ram || disk) && (
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {bandwidthTb && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80 flex items-center gap-1">
                            🌐 {bandwidthTb} TB Bandwidth / mo
                          </span>
                        )}
                        {cpu && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            ⚡ {cpu} vCPU
                          </span>
                        )}
                        {ram && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            🧠 {ram}G RAM
                          </span>
                        )}
                        {disk && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            💾 {disk}G NVMe
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                          SG Datacenter
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Renews day {expense.renewalDayOfMonth} of month ({expense.billingCycle})
                      </span>
                      {expense.notes && (
                        <span className="text-slate-400 italic">
                          • {expense.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                  <div className="text-right">
                    <div className="text-base font-bold text-rose-400">
                      {formatLKR(expense.costLkr)}
                    </div>
                    <span className="text-[11px] text-slate-400">per month</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(expense)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      title="Edit Expense"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Adding/Editing Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
                  <Server className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-base">
                  {editingId ? 'Edit Server Expense' : 'Add Server / Infrastructure Expense'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Server / Expense Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leaseweb Singapore Server"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Monthly Cost (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    placeholder="2150"
                    value={costLkr}
                    onChange={(e) => setCostLkr(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VpnExpense['category'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="server">VPS / Dedicated Server</option>
                    <option value="bandwidth">Bandwidth Overage</option>
                    <option value="domain">Domain / CDN / Cloudflare</option>
                    <option value="license">Panel / Software License</option>
                    <option value="other">Other Expense</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Location / Datacenter
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Singapore (SG)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Renewal Day of Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={renewalDay}
                    onChange={(e) => setRenewalDay(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Hardware Specs & Monthly Bandwidth Pool */}
              {category === 'server' && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                    <span>Server Hardware & Bandwidth Specs</span>
                    <span className="text-[10px] text-slate-500">Singapore Node</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Bandwidth (TB)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="30"
                        value={bandwidthLimitTb}
                        onChange={(e) => setBandwidthLimitTb(parseFloat(e.target.value) || 30)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        vCPU Cores
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="4"
                        value={cpuCores}
                        onChange={(e) => setCpuCores(parseInt(e.target.value, 10) || 4)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        RAM (GB)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="6"
                        value={ramGb}
                        onChange={(e) => setRamGb(parseInt(e.target.value, 10) || 6)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        NVMe Disk (GB)
                      </label>
                      <input
                        type="number"
                        min="10"
                        step="10"
                        placeholder="100"
                        value={diskNvmeGb}
                        onChange={(e) => setDiskNvmeGb(parseInt(e.target.value, 10) || 100)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notes / IP / Spec
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1Gbps unmetered port, Leaseweb SG invoice #1042"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
