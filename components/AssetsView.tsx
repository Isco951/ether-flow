
import React, { useState } from 'react';
import { MOCK_ASSET_DETAILS } from '../services/mockData';
import { AssetInfo, TokenType, Wallet, Transaction } from '../types';
import { AssetDetail } from './AssetDetail';

interface AssetsViewProps {
  wallets: Wallet[];
  transactions: Transaction[];
  onSend: (token?: TokenType) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ wallets, transactions, onSend }) => {
  const [selectedAsset, setSelectedAsset] = useState<AssetInfo | null>(null);

  if (selectedAsset) {
      return (
          <AssetDetail 
            asset={selectedAsset}
            wallets={wallets}
            transactions={transactions}
            onBack={() => setSelectedAsset(null)}
            onSend={() => onSend(selectedAsset.token)}
            onBuy={() => {}}
          />
      );
  }

  const assets = Object.values(MOCK_ASSET_DETAILS);

  return (
    <div className="space-y-6">
       <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Supported Assets</h2>
        <p className="text-slate-400">Manage your portfolio breakdown by currency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map(asset => {
               // Calculate user total for this asset
               const totalBalance = wallets.reduce((acc, w) => {
                   const bal = w.balances.find(b => b.token === asset.token);
                   return acc + (bal ? bal.amount : 0);
               }, 0);
               
               const price = wallets.flatMap(w => w.balances).find(b => b.token === asset.token)?.priceUsd || 0;

               return (
                   <div 
                     key={asset.token}
                     onClick={() => setSelectedAsset(asset)}
                     className="bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group"
                   >
                       <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: asset.color }}>
                               {asset.symbol[0]}
                           </div>
                           <div className="text-right">
                               <div className="text-white font-bold">${price.toLocaleString()}</div>
                               <div className="text-emerald-400 text-xs font-medium">+2.5%</div>
                           </div>
                       </div>
                       
                       <h3 className="text-lg font-bold text-white mb-1">{asset.name}</h3>
                       <div className="flex justify-between items-end">
                           <div className="text-slate-400 text-sm">{asset.symbol}</div>
                           <div className="text-right">
                               <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Your Balance</div>
                               <div className="text-white font-medium">{totalBalance.toLocaleString()}</div>
                           </div>
                       </div>
                   </div>
               );
          })}
      </div>
    </div>
  );
};
