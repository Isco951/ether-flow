import React from 'react';
import { Transaction } from '../types';

interface ActivityLogProps {
  transactions: Transaction[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ transactions }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Purchase':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'Funding':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Swap':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default: // Transfer
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
        case 'Purchase': return 'bg-pink-500/10 text-pink-500 ring-1 ring-pink-500/20';
        case 'Funding': return 'bg-indigo-500/10 text-indigo-500 ring-1 ring-indigo-500/20';
        case 'Swap': return 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20';
        default: return 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
        <button className="text-xs font-medium text-slate-500 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600">
            Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4 pl-8 w-[50%]">Transaction</th>
              <th className="px-6 py-4 text-right w-[30%]">Amount</th>
              <th className="px-6 py-4 text-right pr-8 w-[20%]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm">
            {transactions.map(tx => (
              <tr key={tx.id} className="group hover:bg-slate-800/30 transition-colors">
                
                {/* Transaction Info (Type Icon + Description) */}
                <td className="px-6 py-5 pl-8">
                   <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getTypeStyles(tx.type)}`}>
                            {getTypeIcon(tx.type)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-200 text-base">{tx.to}</span>
                            <span className="text-xs text-slate-500 font-medium mt-0.5">
                                {tx.type} • From {tx.from}
                            </span>
                        </div>
                   </div>
                </td>

                {/* Amount & Gas Fee */}
                <td className="px-6 py-5 text-right">
                  <div className="flex flex-col items-end justify-center h-full">
                    <span className="font-bold text-white text-base tracking-tight">
                        {tx.amount.toLocaleString()} {tx.token}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 font-medium bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50">
                        Gas: <span className="text-slate-400">${tx.gasFeeUsd.toFixed(2)}</span>
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-5 pr-8 text-right">
                   <div className="inline-flex items-center justify-end gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                        <span className="text-emerald-400 text-xs font-medium tracking-wide">Success</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {transactions.length === 0 && (
          <div className="p-12 text-center text-slate-500">
              No recent transactions found.
          </div>
      )}
    </div>
  );
};