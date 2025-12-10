import React from 'react';
import { MOCK_TRENDS } from '../services/mockData';
import { MarketCoin } from '../types';

interface TrendCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const TrendCard: React.FC<TrendCardProps> = ({ title, icon, children }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
    </div>
    <div className="flex-1 space-y-4">
      {children}
    </div>
  </div>
);

interface CoinRowProps {
  coin: MarketCoin;
  type: 'volume' | 'surge' | 'gainer' | 'loser';
}

const CoinRow: React.FC<CoinRowProps> = ({ coin, type }) => {
  const isPositive = coin.change24h >= 0;
  
  return (
    <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-3">
        {/* Avatar / Icon Placeholder */}
        <div className={`
           w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold
           ${type === 'surge' ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-400'}
        `}>
           {coin.symbol[0]}
        </div>
        <div>
           <div className="font-bold text-slate-200 text-sm">{coin.name}</div>
           <div className="text-xs text-slate-500 font-mono">{coin.symbol}</div>
        </div>
      </div>

      <div className="text-right">
         <div className="font-medium text-slate-200 text-sm">
           ${coin.price < 0.01 ? coin.price.toFixed(6) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
         </div>
         
         {type === 'volume' && coin.volume24h && (
           <div className="text-xs text-slate-500">{coin.volume24h} Vol</div>
         )}

         {type === 'surge' && coin.volumeSurge && (
           <div className="text-xs text-orange-400 font-bold">+{coin.volumeSurge}% Vol</div>
         )}

         {(type === 'gainer' || type === 'loser') && (
           <div className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-pink-500'}`}>
              {isPositive ? '+' : ''}{coin.change24h}%
           </div>
         )}
      </div>
    </div>
  );
};

export const CryptoTrends = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Market Trends</h2>
        <p className="text-slate-400">Live insights into what's moving in the crypto world.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Most Volume */}
        <TrendCard 
            title="Most Volume" 
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        >
            {MOCK_TRENDS.topVolume.map(c => <CoinRow key={c.id} coin={c} type="volume" />)}
        </TrendCard>

        {/* Volume Surge */}
        <TrendCard 
            title="Volume Surge" 
            icon={<svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        >
            {MOCK_TRENDS.volumeSurge.map(c => <CoinRow key={c.id} coin={c} type="surge" />)}
        </TrendCard>

        {/* Top Gainers */}
        <TrendCard 
            title="Top Growers" 
            icon={<svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        >
            {MOCK_TRENDS.topGainers.map(c => <CoinRow key={c.id} coin={c} type="gainer" />)}
        </TrendCard>

        {/* Top Losers */}
        <TrendCard 
            title="Biggest Losses" 
            icon={<svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
        >
            {MOCK_TRENDS.topLosers.map(c => <CoinRow key={c.id} coin={c} type="loser" />)}
        </TrendCard>

      </div>
    </div>
  );
};