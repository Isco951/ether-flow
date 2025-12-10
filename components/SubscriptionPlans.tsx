
import React from 'react';
import { SubscriptionTier } from '../types';

interface SubscriptionPlansProps {
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
  onClose: () => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ currentTier, onUpgrade, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 p-2 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-12 text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                 <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping opacity-20"></div>
                 <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Memberships Coming Soon</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
                We are finalizing partnerships to offer you gas fee coverage, expert portfolio analysis, and priority support. Stay tuned for the launch of EtherFlow VIP.
            </p>

            <button disabled className="w-full py-3 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed border border-slate-700 hover:bg-slate-800 transition-colors">
                Notify Me When Live
            </button>
        </div>
      </div>
    </div>
  );
};
