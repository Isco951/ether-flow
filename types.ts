
export enum TokenType {
  ETH = 'ETH',
  BTC = 'BTC',
  USDC = 'USDC',
  MATIC = 'MATIC',
  SOL = 'SOL',
  USDT = 'USDT',
  RON = 'RON'
}

export type Chain = 'Ethereum' | 'Bitcoin' | 'Polygon' | 'Solana' | 'Ronin';

export type SubscriptionTier = 'Basic' | 'Pro' | 'Whale';

export interface TokenBalance {
  token: TokenType;
  amount: number;
  priceUsd: number;
  change24h: number; // Percentage
  chain: Chain; // The specific network this asset resides on
}

export interface Wallet {
  id: string;
  name: string;
  address: string;
  chains: Chain[]; // Supports multiple networks
  type: 'personal' | 'project' | 'savings';
  balances: TokenBalance[];
  color: string;
  priorityOrder?: number; // For payment preferences
}

export interface Project {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  deadline: string;
  category: string;
  chain: Chain; // Added to support bridging logic
  externalWalletAddress?: string; // Optional external address for donations
}

export interface GasOption {
  speed: 'Standard' | 'Fast' | 'Instant';
  estTime: string;
  feeUsd: number;
  gwei?: number; // Optional for non-EVM
  satsPerByte?: number; // Optional for BTC
}

export interface TransferIntent {
  fromWalletId?: string;
  toWalletId?: string;
  amount?: number;
  token?: TokenType;
  note?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Transfer' | 'Purchase' | 'Swap' | 'Funding';
  amount: number;
  token: TokenType;
  from: string;
  to: string;
  gasFeeUsd: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface MarketCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h?: string;
  volumeSurge?: number; // Percentage increase in volume
}

export interface AssetInfo {
  token: TokenType;
  name: string;
  symbol: string;
  color: string;
  description: string;
  marketCap: string;
  volume24h: string;
  circulatingSupply: string;
  allTimeHigh: number;
  priceHistory: { time: string; value: number }[]; // Mock chart data
}
