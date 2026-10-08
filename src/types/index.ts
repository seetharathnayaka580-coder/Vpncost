export type PaymentStatus = 'paid' | 'partial' | 'pending';

export type PaymentMethod = 'Bank Transfer' | 'Commercial Bank' | 'BOC' | 'Sampath Bank' | 'HNB' | 'eZ Cash' | 'mCash' | 'Crypto (USDT)' | 'Cash' | 'Other';

export interface VpnExpense {
  id: string;
  name: string; // e.g. "Leaseweb Singapore VPS"
  category: 'server' | 'bandwidth' | 'license' | 'domain' | 'other';
  costLkr: number;
  location?: string; // e.g. "Singapore"
  dcLocation?: string; // e.g. "Singapore"
  ipOrHost?: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  renewalDayOfMonth: number;
  month: string; // Format: "YYYY-MM"
  bandwidthLimitTb?: number; // e.g. 30 TB
  cpuCores?: number; // e.g. 4 vCPU
  ramGb?: number; // e.g. 6 GB RAM
  diskNvmeGb?: number; // e.g. 100 GB NVMe
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ClientSale {
  id: string;
  clientName: string;
  clientContact?: string; // WhatsApp/Phone/Telegram username
  dataSoldGb: number;
  paymentReceivedLkr: number;
  agreedPriceLkr: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  serverAssignedId?: string; // links to VpnExpense id or name
  serverName?: string; // e.g. "Leaseweb Singapore"
  protocol?: string; // e.g. "VLESS Reality", "VMess", "Shadowsocks", "WireGuard", "Trojan", "SSH/SSL"
  dateSold: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
  month: string; // Format: "YYYY-MM"
  notes?: string;
  createdAt: string;
}

export interface MonthSummary {
  month: string; // "YYYY-MM"
  totalExpenseLkr: number;
  totalRevenueLkr: number;
  totalAgreedLkr: number;
  totalPendingLkr: number;
  totalDataSoldGb: number;
  netProfitLkr: number;
  profitMarginPercent: number;
  avgPricePerGb: number;
  costPerGb: number;
  clientCount: number;
  totalBandwidthCapacityGb: number; // e.g. 30,000 GB (30 TB)
  remainingBandwidthGb: number;
  bandwidthUsagePercent: number;
}
