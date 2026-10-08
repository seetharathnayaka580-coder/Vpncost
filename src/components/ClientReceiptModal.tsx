import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Server, 
  HardDrive, 
  ShieldCheck, 
  Calendar,
  DollarSign,
  Send
} from 'lucide-react';
import { ClientSale } from '../types';
import { formatLKR, formatDateDisplay } from '../utils/formatters';

interface ClientReceiptModalProps {
  sale: ClientSale | null;
  onClose: () => void;
}

export const ClientReceiptModal: React.FC<ClientReceiptModalProps> = ({ sale, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!sale) return null;

  const receiptText = `*⚡ VPN SUBSCRIPTION & BANDWIDTH RECEIPT ⚡*
━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${sale.clientName}
📦 *Data Allocation:* ${sale.dataSoldGb} GB
💰 *Payment Received:* ${formatLKR(sale.paymentReceivedLkr)}
🌐 *Server Node:* ${sale.serverName || 'Leaseweb Singapore'}
🔒 *Protocol:* ${sale.protocol || 'VLESS Reality'}
📅 *Date Activated:* ${formatDateDisplay(sale.dateSold)}
⏳ *Valid Until:* ${formatDateDisplay(sale.expiryDate)}
💳 *Payment Method:* ${sale.paymentMethod || 'Bank Transfer'}
📌 *Status:* ${sale.status === 'paid' ? '✅ FULLY PAID' : '⚠️ PARTIAL / DUE'}
${sale.notes ? `📝 *Notes:* ${sale.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
_Thank you for your business! High speed & low-latency Singapore connection._`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receiptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const openWhatsApp = () => {
    const phone = sale.clientContact?.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(receiptText);
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Client Receipt Slip</h4>
              <p className="text-[11px] text-slate-400">Ready to share via WhatsApp or Telegram</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Receipt Card Preview */}
        <div className="p-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-4.5 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    VPN Access Slip
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {sale.serverName || 'Leaseweb Singapore'}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                sale.status === 'paid'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {sale.status === 'paid' ? 'Active / Paid' : 'Pending Due'}
              </span>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Client Name:</span>
                <span className="font-semibold text-white">{sale.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Data Allocation:</span>
                <span className="font-bold text-cyan-400">{sale.dataSoldGb} GB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-emerald-400 text-sm">{formatLKR(sale.paymentReceivedLkr)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Protocol:</span>
                <span className="text-slate-200">{sale.protocol || 'VLESS Reality'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Validity:</span>
                <span className="text-slate-300">{formatDateDisplay(sale.expiryDate)}</span>
              </div>
              {sale.notes && (
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-slate-400">Notes:</span>
                  <span className="text-slate-400 italic max-w-[200px] text-right truncate">{sale.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  Copy WhatsApp Slip
                </>
              )}
            </button>

            <button
              type="button"
              onClick={openWhatsApp}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              Send to WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
