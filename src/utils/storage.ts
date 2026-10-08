import { VpnExpense, ClientSale } from '../types';
import { getCurrentMonthStr } from './formatters';

const EXPENSES_KEY = 'vpn_tracker_expenses_v1';
const SALES_KEY = 'vpn_tracker_sales_v1';

export const INITIAL_EXPENSES: VpnExpense[] = [
  {
    id: 'exp-1',
    name: 'Leaseweb Singapore Server',
    category: 'server',
    costLkr: 2150,
    location: 'Singapore (SG)',
    dcLocation: 'Singapore',
    ipOrHost: 'sg-node01.leaseweb.net',
    billingCycle: 'monthly',
    renewalDayOfMonth: 15,
    month: getCurrentMonthStr(),
    bandwidthLimitTb: 30, // 30 TB monthly bandwidth
    cpuCores: 4, // 4 vCPU
    ramGb: 6, // 6 GB RAM
    diskNvmeGb: 100, // 100 GB NVMe
    notes: '4 vCPU • 6G RAM • 100G NVMe • 30TB Bandwidth • Singapore DC',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    name: 'Domain & Cloudflare Tunnel DNS',
    category: 'domain',
    costLkr: 450,
    location: 'Cloudflare',
    billingCycle: 'monthly',
    renewalDayOfMonth: 1,
    month: getCurrentMonthStr(),
    notes: 'CDN SNI masking and TLS certificate renewal.',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SALES: ClientSale[] = [
  {
    id: 'sale-1',
    clientName: 'Kasun Bandara',
    clientContact: '+94 77 123 4567 (WhatsApp)',
    dataSoldGb: 100,
    paymentReceivedLkr: 1200,
    agreedPriceLkr: 1200,
    status: 'paid',
    paymentMethod: 'Commercial Bank',
    serverName: 'Leaseweb Singapore',
    protocol: 'VLESS Reality (XTLS)',
    dateSold: new Date().toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    month: getCurrentMonthStr(),
    notes: 'Full month package, gaming & YouTube',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sale-2',
    clientName: 'Nuwan Pradeep',
    clientContact: '+94 71 987 6543 (Telegram)',
    dataSoldGb: 50,
    paymentReceivedLkr: 650,
    agreedPriceLkr: 650,
    status: 'paid',
    paymentMethod: 'eZ Cash',
    serverName: 'Leaseweb Singapore',
    protocol: 'VMess + WebSocket',
    dateSold: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 27 * 86400000).toISOString().slice(0, 10),
    month: getCurrentMonthStr(),
    notes: 'Work from home Zoom package',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sale-3',
    clientName: 'Dilshan Silva',
    clientContact: '+94 76 555 4321',
    dataSoldGb: 80,
    paymentReceivedLkr: 1000,
    agreedPriceLkr: 1000,
    status: 'paid',
    paymentMethod: 'Sampath Bank',
    serverName: 'Leaseweb Singapore',
    protocol: 'Shadowsocks',
    dateSold: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 25 * 86400000).toISOString().slice(0, 10),
    month: getCurrentMonthStr(),
    notes: 'Mobile config via Clash / Sing-box',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sale-4',
    clientName: 'Chaminda Rathnayake',
    clientContact: '+94 75 444 3210',
    dataSoldGb: 60,
    paymentReceivedLkr: 500,
    agreedPriceLkr: 750,
    status: 'partial',
    paymentMethod: 'BOC',
    serverName: 'Leaseweb Singapore',
    protocol: 'VLESS Reality (XTLS)',
    dateSold: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 23 * 86400000).toISOString().slice(0, 10),
    month: getCurrentMonthStr(),
    notes: 'Paid LKR 500 advance, remaining LKR 250 due next week',
    createdAt: new Date().toISOString(),
  },
];

export function loadExpenses(): VpnExpense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      saveExpenses(INITIAL_EXPENSES);
      return INITIAL_EXPENSES;
    }
    const parsed: VpnExpense[] = JSON.parse(raw);
    // Backfill any missing specs on Leaseweb server
    const upgraded = parsed.map((item) => {
      if (item.name.toLowerCase().includes('leaseweb') && !item.bandwidthLimitTb) {
        return {
          ...item,
          bandwidthLimitTb: 30,
          cpuCores: 4,
          ramGb: 6,
          diskNvmeGb: 100,
          dcLocation: 'Singapore',
          location: item.location || 'Singapore (SG)',
          notes: item.notes || '4 vCPU • 6G RAM • 100G NVMe • 30TB Bandwidth • Singapore DC',
        };
      }
      return item;
    });
    return upgraded;
  } catch (err) {
    console.error('Error loading expenses', err);
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: VpnExpense[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Error saving expenses', err);
  }
}

export function loadSales(): ClientSale[] {
  try {
    const raw = localStorage.getItem(SALES_KEY);
    if (!raw) {
      saveSales(INITIAL_SALES);
      return INITIAL_SALES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading sales', err);
    return INITIAL_SALES;
  }
}

export function saveSales(sales: ClientSale[]): void {
  try {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  } catch (err) {
    console.error('Error saving sales', err);
  }
}

export function resetToSampleData(): { expenses: VpnExpense[]; sales: ClientSale[] } {
  saveExpenses(INITIAL_EXPENSES);
  saveSales(INITIAL_SALES);
  return { expenses: INITIAL_EXPENSES, sales: INITIAL_SALES };
}
