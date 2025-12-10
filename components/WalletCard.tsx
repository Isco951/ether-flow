
import React from 'react';
import { Wallet, TokenType } from '../types';

interface WalletCardProps {
  wallet: Wallet;
  selected?: boolean;
  onClick?: () => void;
}

const CHAIN_STYLES: Record<string, string> = {
    'Ethereum': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    'Bitcoin': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Polygon': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Solana': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Ronin': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, selected, onClick }) => {
  const totalUsd = wallet.balances.reduce((acc, b) => acc + (b.amount * b.priceUsd), 0);

  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300
        ${selected ? 'ring-2 ring-white scale-[1.02]' : 'hover:bg-slate-800/50'}
        ${wallet.color} bg-opacity-10 backdrop-blur-md border border-slate-700/50
      `}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10`}>
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white tracking-wide">{wallet.name}</h3>
                <div className="flex gap-1">
                    {wallet.chains.map(chain => (
                        <span key={chain} className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${CHAIN_STYLES[chain] || 'bg-slate-700 text-slate-300'}`}>
                            {chain}
                        </span>
                    ))}
                </div>
            </div>
            <p className="text-slate-400 text-xs font-mono truncate">{wallet.address}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-400">Total Value</p>
          <p className="text-2xl font-bold text-white">
            ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {wallet.balances.slice(0, 4).map((b, idx) => (
            <div key={`${b.token}-${idx}`} className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded text-sm border border-white/5">
              <span className={`w-2 h-2 rounded-full ${b.token === TokenType.USDC ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
              <span className="font-medium text-slate-200">{b.amount} {b.token}</span>
            </div>
          ))}
          {wallet.balances.length > 4 && (
              <span className="text-xs text-slate-400 flex items-center">+{wallet.balances.length - 4} more</span>
          )}
        </div>
      </div>
    </div>
  );
};
