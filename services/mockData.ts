
import { Wallet, Project, TokenType, Transaction, MarketCoin, AssetInfo } from '../types';

export const MOCK_WALLETS: Wallet[] = [
  {
    id: 'w1',
    name: 'Main Vault',
    address: '0x71C...9A21',
    chains: ['Ethereum', 'Polygon'],
    type: 'personal',
    color: 'bg-blue-600',
    priorityOrder: 1,
    balances: [
      { token: TokenType.ETH, amount: 4.5, priceUsd: 2650.00, change24h: 2.5, chain: 'Ethereum' },
      { token: TokenType.USDC, amount: 15000, priceUsd: 1.00, change24h: 0.01, chain: 'Ethereum' },
      { token: TokenType.MATIC, amount: 2500, priceUsd: 0.85, change24h: -1.2, chain: 'Polygon' }
    ]
  },
  {
    id: 'w6',
    name: 'OpEx Fund',
    address: '0x33A...22b1',
    chains: ['Ethereum'],
    type: 'project',
    color: 'bg-indigo-800',
    priorityOrder: 6,
    balances: [
      { token: TokenType.ETH, amount: 12.0, priceUsd: 2650.00, change24h: 0.5, chain: 'Ethereum' },
      { token: TokenType.USDC, amount: 50000, priceUsd: 1.00, change24h: 0.00, chain: 'Ethereum' },
    ]
  },
  {
    id: 'w2',
    name: 'Cold Storage',
    address: 'bc1q...39ka',
    chains: ['Bitcoin'],
    type: 'savings',
    color: 'bg-orange-600',
    priorityOrder: 3,
    balances: [
      { token: TokenType.BTC, amount: 0.45, priceUsd: 42000.00, change24h: 1.2, chain: 'Bitcoin' },
    ]
  },
  {
    id: 'w3',
    name: 'DeFi Aggregator',
    address: '0xB2a...11fF',
    chains: ['Polygon', 'Ronin'],
    type: 'personal',
    color: 'bg-purple-600',
    priorityOrder: 2,
    balances: [
      { token: TokenType.MATIC, amount: 5000, priceUsd: 0.85, change24h: -1.2, chain: 'Polygon' },
      { token: TokenType.USDT, amount: 2000, priceUsd: 1.00, change24h: 0.01, chain: 'Polygon' },
      { token: TokenType.RON, amount: 1200, priceUsd: 2.80, change24h: 8.5, chain: 'Ronin' }
    ]
  },
  {
    id: 'w4',
    name: 'Phantom Wallet',
    address: 'H7f...9kkL',
    chains: ['Solana'],
    type: 'personal',
    color: 'bg-teal-600',
    priorityOrder: 4,
    balances: [
      { token: TokenType.SOL, amount: 150, priceUsd: 110.00, change24h: 5.4, chain: 'Solana' },
      { token: TokenType.USDC, amount: 500, priceUsd: 1.00, change24h: 0.01, chain: 'Solana' }
    ]
  },
  {
    id: 'w5',
    name: 'GameFi Wallet',
    address: 'ronin:...a4f2',
    chains: ['Ronin'],
    type: 'personal',
    color: 'bg-blue-500',
    priorityOrder: 5,
    balances: [
      { token: TokenType.RON, amount: 4500, priceUsd: 2.80, change24h: 8.5, chain: 'Ronin' },
      { token: TokenType.ETH, amount: 0.5, priceUsd: 2650.00, change24h: 2.5, chain: 'Ronin' },
    ]
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p_legal',
    name: 'EtherFlow Compliance Fund',
    description: 'Help us build the legal framework for fiat off-ramping. Donations go to a secure external wallet for legal & licensing fees.',
    targetAmount: 250000,
    raisedAmount: 15000,
    deadline: '2025-06-30',
    category: 'Infrastructure',
    chain: 'Ethereum',
    externalWalletAddress: '0xLegalFundWalletAddress'
  },
  {
    id: 'p1',
    name: 'Nebula Protocol',
    description: 'Decentralized identity verification layer for Web3 social apps.',
    targetAmount: 50000,
    raisedAmount: 32500,
    deadline: '2024-12-31',
    category: 'Infrastructure',
    chain: 'Polygon'
  },
  {
    id: 'p2',
    name: 'GreenChain DAO',
    description: 'Carbon credit tokenization marketplace.',
    targetAmount: 100000,
    raisedAmount: 12000,
    deadline: '2024-11-15',
    category: 'Impact',
    chain: 'Solana'
  },
  {
    id: 'p3',
    name: 'PixelArt NFT Gen',
    description: 'AI-driven pixel art generator for gaming assets.',
    targetAmount: 5000,
    raisedAmount: 4800,
    deadline: '2024-10-20',
    category: 'Gaming',
    chain: 'Ronin'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    date: '2024-05-10 14:30',
    type: 'Purchase',
    amount: 45.00,
    token: TokenType.USDC,
    from: 'Main ETH Vault',
    to: 'Starbucks (via Flexa)',
    gasFeeUsd: 1.20,
    status: 'Completed'
  },
  {
    id: 'tx2',
    date: '2024-05-09 09:15',
    type: 'Transfer',
    amount: 0.1,
    token: TokenType.ETH,
    from: 'Main ETH Vault',
    to: 'DeFi Degen',
    gasFeeUsd: 3.50,
    status: 'Completed'
  },
  {
    id: 'tx3',
    date: '2024-05-08 18:45',
    type: 'Funding',
    amount: 1000,
    token: TokenType.USDT,
    from: 'Polygon Degen',
    to: 'Nebula Protocol',
    gasFeeUsd: 0.05,
    status: 'Completed'
  },
  {
    id: 'tx4',
    date: '2024-05-08 11:20',
    type: 'Swap',
    amount: 2500,
    token: TokenType.MATIC,
    from: 'Polygon Degen',
    to: 'Polygon Degen',
    gasFeeUsd: 0.10,
    status: 'Completed'
  },
  {
    id: 'tx5',
    date: '2024-05-07 20:10',
    type: 'Purchase',
    amount: 120.50,
    token: TokenType.SOL,
    from: 'Solana Pay',
    to: 'Shopify Store',
    gasFeeUsd: 0.0005,
    status: 'Completed'
  }
];

export const MOCK_TRENDS = {
  topVolume: [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 42150.20, change24h: 1.2, volume24h: '32.5B' },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 2650.10, change24h: 2.5, volume24h: '18.2B' },
    { id: '3', name: 'Solana', symbol: 'SOL', price: 110.45, change24h: 5.4, volume24h: '4.1B' },
    { id: '4', name: 'USDC', symbol: 'USDC', price: 1.00, change24h: 0.01, volume24h: '3.8B' },
  ] as MarketCoin[],
  volumeSurge: [
    { id: '5', name: 'Ronin', symbol: 'RON', price: 2.80, change24h: 8.5, volume24h: '120M', volumeSurge: 450 },
    { id: '6', name: 'Pepe', symbol: 'PEPE', price: 0.0000012, change24h: 15.2, volume24h: '850M', volumeSurge: 310 },
    { id: '7', name: 'Render', symbol: 'RNDR', price: 4.50, change24h: 12.1, volume24h: '250M', volumeSurge: 180 },
  ] as MarketCoin[],
  topGainers: [
    { id: '6', name: 'Pepe', symbol: 'PEPE', price: 0.0000012, change24h: 15.2 },
    { id: '7', name: 'Render', symbol: 'RNDR', price: 4.50, change24h: 12.1 },
    { id: '8', name: 'Injective', symbol: 'INJ', price: 35.20, change24h: 9.8 },
    { id: '5', name: 'Ronin', symbol: 'RON', price: 2.80, change24h: 8.5 },
  ] as MarketCoin[],
  topLosers: [
    { id: '9', name: 'Terra Classic', symbol: 'LUNC', price: 0.0001, change24h: -12.5 },
    { id: '10', name: 'XRP', symbol: 'XRP', price: 0.52, change24h: -5.4 },
    { id: '11', name: 'Cardano', symbol: 'ADA', price: 0.48, change24h: -4.2 },
    { id: '12', name: 'Polygon', symbol: 'MATIC', price: 0.85, change24h: -1.2 },
  ] as MarketCoin[]
};

export const MOCK_ASSET_DETAILS: Record<TokenType, AssetInfo> = {
    [TokenType.BTC]: {
        token: TokenType.BTC,
        name: 'Bitcoin',
        symbol: 'BTC',
        color: '#F7931A',
        description: 'Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency.',
        marketCap: '$820.5B',
        volume24h: '$32.5B',
        circulatingSupply: '19.6M BTC',
        allTimeHigh: 69000,
        priceHistory: Array.from({length: 10}, (_, i) => ({ time: `Day ${i}`, value: 40000 + Math.random() * 5000 }))
    },
    [TokenType.ETH]: {
        token: TokenType.ETH,
        name: 'Ethereum',
        symbol: 'ETH',
        color: '#627EEA',
        description: 'Ethereum is a decentralized computing platform that executes smart contracts. It powers decentralized applications (dApps) and the DeFi ecosystem.',
        marketCap: '$315.2B',
        volume24h: '$18.2B',
        circulatingSupply: '120.2M ETH',
        allTimeHigh: 4891,
        priceHistory: Array.from({length: 10}, (_, i) => ({ time: `Day ${i}`, value: 2200 + Math.random() * 500 }))
    },
    [TokenType.SOL]: {
        token: TokenType.SOL,
        name: 'Solana',
        symbol: 'SOL',
        color: '#14F195',
        description: 'Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.',
        marketCap: '$48.1B',
        volume24h: '$4.1B',
        circulatingSupply: '443.2M SOL',
        allTimeHigh: 260,
        priceHistory: Array.from({length: 10}, (_, i) => ({ time: `Day ${i}`, value: 90 + Math.random() * 30 }))
    },
    [TokenType.MATIC]: {
        token: TokenType.MATIC,
        name: 'Polygon',
        symbol: 'MATIC',
        color: '#8247E5',
        description: 'Polygon is a protocol and a framework for building and connecting Ethereum-compatible blockchain networks.',
        marketCap: '$8.5B',
        volume24h: '$500M',
        circulatingSupply: '9.3B MATIC',
        allTimeHigh: 2.92,
        priceHistory: Array.from({length: 10}, (_, i) => ({ time: `Day ${i}`, value: 0.7 + Math.random() * 0.3 }))
    },
    [TokenType.RON]: {
        token: TokenType.RON,
        name: 'Ronin',
        symbol: 'RON',
        color: '#1273EA',
        description: 'Ronin is an EVM blockchain specifically crafted for gaming. Launched by Sky Mavis, the creator of Axie Infinity.',
        marketCap: '$900M',
        volume24h: '$120M',
        circulatingSupply: '300M RON',
        allTimeHigh: 4.5,
        priceHistory: Array.from({length: 10}, (_, i) => ({ time: `Day ${i}`, value: 2.5 + Math.random() * 1 }))
    },
    [TokenType.USDC]: {
        token: TokenType.USDC,
        name: 'USD Coin',
        symbol: 'USDC',
        color: '#2775CA',
        description: 'USDC is a digital dollar, stablecoin, that is pegged 1:1 to the US dollar. Fully backed by reserve assets.',
        marketCap: '$25.0B',
        volume24h: '$3.8B',
        circulatingSupply: '25.0B USDC',
        allTimeHigh: 1.00,
        priceHistory: Array.from({length: 10}, (_, i) => ({ time: `Day ${i}`, value: 1.0 }))
    },
    [TokenType.USDT]: {
        token: TokenType.USDT,
        name: 'Tether',
        symbol: 'USDT',
        color: '#26A17B',
        description: 'Tether is a stablecoin pegged to the US Dollar. It is the largest stablecoin by market capitalization.',
        marketCap: '$96.0B',
        volume24h: '$45.0B',
        circulatingSupply: '96.0B USDT',
        allTimeHigh: 1.00,
        priceHistory: Array.from({length: 10}, (_, i) => ({ time: `Day ${i}`, value: 1.0 }))
    }
};
