
import React from 'react';

export const BuySellWidget = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
             <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse"></div>
             <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Exchange Coming Soon</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
            We are strictly adhering to compliance regulations and integrating with top-tier liquidity providers to ensure safe and low-fee transactions. This feature will be available in the next update.
        </p>
        
        <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex justify-between items-center">
                 <span className="text-sm text-slate-400">Supported Pairs</span>
                 <span className="text-sm font-bold text-white">50+ Cryptocurrencies</span>
            </div>
             <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex justify-between items-center">
                 <span className="text-sm text-slate-400">Fiat On-Ramp</span>
                 <span className="text-sm font-bold text-white">USD, EUR, GBP</span>
            </div>
        </div>

        <button disabled className="mt-8 w-full py-3 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed border border-slate-700 hover:bg-slate-800 transition-colors">
            Notify Me When Live
        </button>
    </div>
  );
};
