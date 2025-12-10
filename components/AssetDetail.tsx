
import React from 'react';
import { AssetInfo, Wallet, Transaction } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AssetDetailProps {
  asset: AssetInfo;
  wallets: Wallet[];
  transactions: Transaction[];
  onBack: () => void;
  onSend: () => void;
  onBuy: () => void;
}

export const AssetDetail: React.FC<AssetDetailProps> = ({ 
    asset, 
    wallets, 
    transactions,
    onBack,
    onSend,
    onBuy 
}) => {
  // Aggregate user holdings
  const userHoldings = wallets.reduce((acc, w) => {
      const balance = w.balances.find(b => b.token === asset.token);
      return balance ? acc + balance.amount : acc;
  }, 0);

  // Get current price from first wallet balance or default
  const currentPrice = wallets
    .flatMap(w => w.balances)
    .find(b => b.token === asset.token)?.priceUsd || 0;

  const totalValue = userHoldings * currentPrice;

  // Filter asset transactions
  const assetTxs = transactions.filter(tx => tx.token === asset.token).slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Assets
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg" style={{ backgroundColor: asset.color }}>
                    {asset.symbol[0]}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">{asset.name}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-xl text-slate-300 font-mono">${currentPrice.toLocaleString()}</span>
                        <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-2 py-0.5 rounded">+2.4%</span>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-3">
                <button onClick={onSend} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    Send
                </button>
                <button onClick={onBuy} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Buy
                </button>
            </div>
        </div>

        {/* Chart & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Price Performance</h3>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={asset.priceHistory}>
                            <defs>
                                <linearGradient id="colorAsset" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={asset.color} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={asset.color} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="value" stroke={asset.color} fillOpacity={1} fill="url(#colorAsset)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Your Position</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="text-slate-500 text-sm">Total Balance</div>
                            <div className="text-2xl font-bold text-white">{userHoldings.toLocaleString()} {asset.symbol}</div>
                            <div className="text-slate-400 text-sm">≈ ${totalValue.toLocaleString()}</div>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                             <div className="text-slate-500 text-sm mb-2">Held In</div>
                             <div className="space-y-2">
                                 {wallets.filter(w => w.balances.some(b => b.token === asset.token)).map(w => (
                                     <div key={w.id} className="flex justify-between items-center text-sm">
                                         <span className="text-white">{w.name}</span>
                                         <span className="text-slate-400 font-mono">
                                             {w.balances.find(b => b.token === asset.token)?.amount}
                                         </span>
                                     </div>
                                 ))}
                                 {wallets.filter(w => w.balances.some(b => b.token === asset.token)).length === 0 && (
                                     <div className="text-slate-500 text-sm italic">No holdings</div>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Market Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Market Cap</span>
                            <span className="text-white font-mono">{asset.marketCap}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Volume (24h)</span>
                            <span className="text-white font-mono">{asset.volume24h}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Supply</span>
                            <span className="text-white font-mono">{asset.circulatingSupply}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">All Time High</span>
                            <span className="text-white font-mono">${asset.allTimeHigh.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* About Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">About {asset.name}</h3>
            <p className="text-slate-400 leading-relaxed">{asset.description}</p>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent {asset.symbol} Activity</h3>
            {assetTxs.length > 0 ? (
                <div className="space-y-4">
                    {assetTxs.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${tx.type === 'Purchase' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                                    {tx.type === 'Purchase' ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-white">{tx.type}</div>
                                    <div className="text-xs text-slate-500">{tx.date}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-white">{tx.amount} {tx.token}</div>
                                <div className="text-xs text-slate-500">{tx.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-slate-500 italic">No recent transactions found for {asset.name}.</div>
            )}
        </div>
    </div>
  );
};
