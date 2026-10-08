import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  HardDrive, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Share2, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  Check, 
  X, 
  Sparkles,
  Phone,
  Server as ServerIcon,
  Filter
} from 'lucide-react';
import { ClientSale, PaymentMethod, PaymentStatus, VpnExpense } from '../types';
import { formatLKR, formatGB, formatDateDisplay } from '../utils/formatters';

interface SalesManagerProps {
  sales: ClientSale[];
  expenses: VpnExpense[];
  currentMonth: string;
  onAddSale: (sale: Omit<ClientSale, 'id' | 'createdAt'>) => void;
  onUpdateSale: (id: string, updates: Partial<ClientSale>) => void;
  onDeleteSale: (id: string) => void;
  onSelectForReceipt: (sale: ClientSale) => void;
}

export const SalesManager: React.FC<SalesManagerProps> = ({
  sales,
  expenses,
  currentMonth,
  onAddSale,
  onUpdateSale,
  onDeleteSale,
  onSelectForReceipt,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'pending'>('all');

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [dataSoldGb, setDataSoldGb] = useState<string>('50');
  const [paymentReceivedLkr, setPaymentReceivedLkr] = useState<string>('650');
  const [agreedPriceLkr, setAgreedPriceLkr] = useState<string>('650');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Commercial Bank');
  const [serverName, setServerName] = useState(expenses[0]?.name || 'Leaseweb Singapore');
  const [protocol, setProtocol] = useState('VLESS Reality (XTLS)');
  const [dateSold, setDateSold] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('');

  // Quick preset data buttons (GB)
  const gbPresets = [25, 50, 80, 100, 150, 200];

  const handlePresetSelect = (gb: number) => {
    setDataSoldGb(gb.toString());
    // Auto calculate suggested price based on typical LKR 12-15/GB rate
    const suggestedPrice = Math.round(gb * 12);
    setAgreedPriceLkr(suggestedPrice.toString());
    setPaymentReceivedLkr(suggestedPrice.toString());
  };

  const openAddModal = () => {
    setEditingId(null);
    setClientName('');
    setClientContact('');
    setDataSoldGb('50');
    setPaymentReceivedLkr('650');
    setAgreedPriceLkr('650');
    setPaymentMethod('Commercial Bank');
    setServerName(expenses[0]?.name || 'Leaseweb Singapore');
    setProtocol('VLESS Reality (XTLS)');
    setDateSold(new Date().toISOString().slice(0, 10));
    setExpiryDate(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (sale: ClientSale) => {
    setEditingId(sale.id);
    setClientName(sale.clientName);
    setClientContact(sale.clientContact || '');
    setDataSoldGb(sale.dataSoldGb.toString());
    setPaymentReceivedLkr(sale.paymentReceivedLkr.toString());
    setAgreedPriceLkr((sale.agreedPriceLkr || sale.paymentReceivedLkr).toString());
    setPaymentMethod(sale.paymentMethod || 'Commercial Bank');
    setServerName(sale.serverName || 'Leaseweb Singapore');
    setProtocol(sale.protocol || 'VLESS Reality (XTLS)');
    setDateSold(sale.dateSold || new Date().toISOString().slice(0, 10));
    setExpiryDate(sale.expiryDate || '');
    setNotes(sale.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gb = parseFloat(dataSoldGb) || 0;
    const received = parseFloat(paymentReceivedLkr) || 0;
    const agreed = parseFloat(agreedPriceLkr) || received;

    if (!clientName.trim() || gb <= 0) return;

    let computedStatus: PaymentStatus = 'paid';
    if (received === 0) {
      computedStatus = 'pending';
    } else if (received < agreed) {
      computedStatus = 'partial';
    }

    if (editingId) {
      onUpdateSale(editingId, {
        clientName: clientName.trim(),
        clientContact: clientContact.trim(),
        dataSoldGb: gb,
        paymentReceivedLkr: received,
        agreedPriceLkr: agreed,
        status: computedStatus,
        paymentMethod,
        serverName: serverName.trim(),
        protocol,
        dateSold,
        expiryDate,
        notes: notes.trim(),
      });
    } else {
      onAddSale({
        clientName: clientName.trim(),
        clientContact: clientContact.trim(),
        dataSoldGb: gb,
        paymentReceivedLkr: received,
        agreedPriceLkr: agreed,
        status: computedStatus,
        paymentMethod,
        serverName: serverName.trim(),
        protocol,
        dateSold,
        expiryDate,
        month: currentMonth,
        notes: notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const quickMarkAsPaid = (sale: ClientSale) => {
    const fullAmount = sale.agreedPriceLkr > 0 ? sale.agreedPriceLkr : sale.paymentReceivedLkr;
    onUpdateSale(sale.id, {
      paymentReceivedLkr: fullAmount,
      status: 'paid',
    });
  };

  // Filter sales
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchesSearch =
        sale.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sale.clientContact && sale.clientContact.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.serverName && sale.serverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sale.protocol && sale.protocol.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'paid') return sale.status === 'paid';
      if (statusFilter === 'partial') return sale.status === 'partial';
      if (statusFilter === 'pending') return sale.status === 'pending';
      return true;
    });
  }, [sales, searchQuery, statusFilter]);

  const totalFilteredGb = filteredSales.reduce((acc, s) => acc + s.dataSoldGb, 0);
  const totalFilteredReceived = filteredSales.reduce((acc, s) => acc + s.paymentReceivedLkr, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/70 border border-cyan-800/80 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">
              Client Data Sales Ledger
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {sales.length} client{sales.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Log data sold (GB), client names, and payments received in LKR
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Enter Data Sale
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by client name, contact, server, protocol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-500" /> Filter:
          </span>
          {(['all', 'paid', 'partial', 'pending'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Sales List Table */}
      <div className="overflow-x-auto">
        {filteredSales.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium text-slate-300">No client data sales found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Click "Enter Data Sale" above to log a new client purchase with GB quota and payment received.'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-500"
              >
                <Plus className="w-3.5 h-3.5" /> Log First Sale
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Client Name & Node</th>
                <th className="py-3 px-4 font-semibold">Data Sold (GB)</th>
                <th className="py-3 px-4 font-semibold">Payment Received</th>
                <th className="py-3 px-4 font-semibold">Rate / GB</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date & Validity</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSales.map((sale) => {
                const ratePerGb = sale.dataSoldGb > 0 
                  ? sale.paymentReceivedLkr / sale.dataSoldGb 
                  : 0;
                const outstanding = (sale.agreedPriceLkr || sale.paymentReceivedLkr) - sale.paymentReceivedLkr;

                return (
                  <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors group">
                    {/* Client Name & Server Node */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {sale.clientName}
                        </div>
                        {sale.clientContact && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-cyan-500" />
                            {sale.clientContact}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            <ServerIcon className="w-2.5 h-2.5 text-rose-400" />
                            {sale.serverName || 'Leaseweb SG'}
                          </span>
                          {sale.protocol && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/80">
                              {sale.protocol}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Data Sold GB */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-sm font-bold text-white">
                          {sale.dataSoldGb} GB
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">VPN Bandwidth</span>
                    </td>

                    {/* Payment Received */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400 text-sm">
                        {formatLKR(sale.paymentReceivedLkr)}
                      </div>
                      {outstanding > 0 ? (
                        <div className="text-[11px] text-amber-400 font-medium">
                          +{formatLKR(outstanding)} pending
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">
                          via {sale.paymentMethod || 'Bank Transfer'}
                        </div>
                      )}
                    </td>

                    {/* Rate / GB */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-slate-200">
                        {formatLKR(ratePerGb, { showCents: true })}
                        <span className="text-slate-400 text-[10px]">/GB</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {sale.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Paid
                        </span>
                      )}
                      {sale.status === 'partial' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                          <AlertCircle className="w-3 h-3 text-amber-400" /> Partial
                        </span>
                      )}
                      {sale.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                          <Clock className="w-3 h-3 text-rose-400" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Date & Validity */}
                    <td className="py-3.5 px-4 text-slate-400">
                      <div>Sold: {formatDateDisplay(sale.dateSold)}</div>
                      {sale.expiryDate && (
                        <div className="text-[11px] text-slate-400">
                          Exp: {formatDateDisplay(sale.expiryDate)}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* WhatsApp / Telegram Receipt Slip */}
                        <button
                          type="button"
                          onClick={() => onSelectForReceipt(sale)}
                          className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-md transition-colors"
                          title="Generate WhatsApp Client Slip"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Mark as Paid if partial/pending */}
                        {sale.status !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => quickMarkAsPaid(sale)}
                            className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-md transition-colors"
                            title="Mark as Fully Paid"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => openEditModal(sale)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                          title="Edit Sale"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDeleteSale(sale.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                          title="Delete Sale"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Sub-footer with table metrics */}
      {filteredSales.length > 0 && (
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing <strong className="text-slate-200">{filteredSales.length}</strong> sales
          </div>
          <div className="flex items-center gap-4">
            <span>
              Total Bandwidth: <strong className="text-cyan-400">{formatGB(totalFilteredGb)}</strong>
            </span>
            <span>
              Total Revenue: <strong className="text-emerald-400">{formatLKR(totalFilteredReceived)}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Sale */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-base">
                  {editingId ? 'Edit Client Data Sale' : 'Record New Client Data Sale'}
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

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Client's Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Bandara"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Contact / WhatsApp / Telegram
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +94 77 123 4567"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Data Sold GB with Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Amount of Data Sold (GB) *
                  </label>
                  <span className="text-[11px] text-slate-400">Quick GB Presets</span>
                </div>

                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  {gbPresets.map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => handlePresetSelect(gb)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        dataSoldGb === gb.toString()
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {gb} GB
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    placeholder="e.g. 50"
                    value={dataSoldGb}
                    onChange={(e) => setDataSoldGb(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                    GB
                  </span>
                </div>
              </div>

              {/* Financials: Payment Received & Total Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Received (LKR) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      placeholder="650"
                      value={paymentReceivedLkr}
                      onChange={(e) => setPaymentReceivedLkr(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-emerald-400">
                      LKR
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Agreed Total Price (LKR)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="650"
                      value={agreedPriceLkr}
                      onChange={(e) => setAgreedPriceLkr(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">
                      LKR
                    </span>
                  </div>
                </div>
              </div>

              {/* Rate feedback */}
              {parseFloat(dataSoldGb) > 0 && parseFloat(paymentReceivedLkr) > 0 && (
                <div className="text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-900/50 rounded-lg p-2.5 flex items-center justify-between">
                  <span>
                    Selling Rate:{' '}
                    <strong>
                      {formatLKR(
                        parseFloat(paymentReceivedLkr) / parseFloat(dataSoldGb),
                        { showCents: true }
                      )}
                    </strong>{' '}
                    per GB
                  </span>
                  <span>
                    Status:{' '}
                    <strong className="capitalize">
                      {parseFloat(paymentReceivedLkr) >= (parseFloat(agreedPriceLkr) || 0)
                        ? 'Fully Paid'
                        : 'Partial Payment'}
                    </strong>
                  </span>
                </div>
              )}

              {/* Payment Method & Server Assigned */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="BOC">Bank of Ceylon (BOC)</option>
                    <option value="Sampath Bank">Sampath Bank</option>
                    <option value="HNB">Hatton National Bank (HNB)</option>
                    <option value="Bank Transfer">Other Bank Transfer</option>
                    <option value="eZ Cash">eZ Cash (Dialog)</option>
                    <option value="mCash">mCash (Mobitel)</option>
                    <option value="Crypto (USDT)">Crypto (USDT / Binance)</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Server Node Assigned
                  </label>
                  <select
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {expenses.length > 0 ? (
                      expenses.map((exp) => (
                        <option key={exp.id} value={exp.name}>
                          {exp.name} ({exp.location || 'SG'})
                        </option>
                      ))
                    ) : (
                      <option value="Leaseweb Singapore">Leaseweb Singapore</option>
                    )}
                    <option value="Leaseweb Singapore">Leaseweb Singapore</option>
                    <option value="Linode Singapore">Linode Singapore</option>
                    <option value="DigitalOcean SG">DigitalOcean SG</option>
                  </select>
                </div>
              </div>

              {/* Protocol & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    VPN Protocol
                  </label>
                  <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="VLESS Reality (XTLS)">VLESS Reality (XTLS)</option>
                    <option value="VMess + WebSocket">VMess + WebSocket</option>
                    <option value="Shadowsocks">Shadowsocks</option>
                    <option value="Trojan">Trojan + TLS</option>
                    <option value="WireGuard">WireGuard</option>
                    <option value="SSH / SSL Tunnel">SSH / SSL Tunnel</option>
                    <option value="OpenVPN">OpenVPN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date Sold
                  </label>
                  <input
                    type="date"
                    value={dateSold}
                    onChange={(e) => setDateSold(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notes / Package Info
                </label>
                <input
                  type="text"
                  placeholder="e.g. YouTube & Gaming streaming setup, Sing-box / v2rayNG client"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Form buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition-colors"
                >
                  {editingId ? 'Save Sale' : 'Add Sale Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
