import React, { useEffect, useState } from 'react';
import { GasOption, SubscriptionTier } from '../types';
import { getGasAnalysis } from '../services/geminiService';

interface GasSelectorProps {
  selectedSpeed: string;
  onSelect: (option: GasOption) => void;
  userTier?: SubscriptionTier;
}

const GAS_OPTIONS: GasOption[] = [
  { speed: 'Standard', estTime: '~3 mins', feeUsd: 1.25, gwei: 15 },
  { speed: 'Fast', estTime: '~45 secs', feeUsd: 2.80, gwei: 25 },
  { speed: 'Instant', estTime: '< 15 secs', feeUsd: 5.50, gwei: 45 },
];

export const GasSelector: React.FC<GasSelectorProps> = ({ selectedSpeed, onSelect, userTier = 'Basic' }) => {
  const [aiTip, setAiTip] = useState<string>("");
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    // Determine the option to pass back initially if none selected
    if (!selectedSpeed) onSelect(GAS_OPTIONS[0]);
    
    // Fetch AI Tip
    const fetchTip = async () => {
        setLoadingTip(true);
        const tip = await getGasAnalysis("Ethereum Mainnet");
        setAiTip(tip);
        setLoadingTip(false);
    };
    fetchTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDiscountedFee = (originalFee: number) => {
      // Both Pro and Whale now have gas allowances, so we show $0
      if (userTier === 'Whale' || userTier === 'Pro') return 0;
      return originalFee;
  };

  const getTierLabel = () => {
      if (userTier === 'Whale') return 'Covered (Up to $200)';
      if (userTier === 'Pro') return 'Covered (Up to $100)';
      return '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            Network Fee (Gas)
            {userTier !== 'Basic' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${userTier === 'Whale' ? 'bg-purple-500 text-white' : 'bg-indigo-500 text-white'}`}>
                    {getTierLabel()}
                </span>
            )}
        </label>
        {loadingTip ? (
             <span className="text-xs text-slate-500 animate-pulse">AI Analyzing Network...</span>
        ) : (
            <span className="text-xs text-purple-400 italic">{aiTip}</span>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {GAS_OPTIONS.map((opt) => {
            const finalFee = getDiscountedFee(opt.feeUsd);
            const isFree = finalFee === 0;

            return (
              <button
                key={opt.speed}
                onClick={() => onSelect(opt)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border transition-all relative overflow-hidden
                  ${selectedSpeed === opt.speed 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'}
                `}
              >
                <span className="text-sm font-semibold">{opt.speed}</span>
                <span className="text-xs opacity-70 mb-1">{opt.estTime}</span>
                
                <div className="flex flex-col items-center">
                    {userTier !== 'Basic' && (
                        <span className="text-xs line-through text-slate-600">${opt.feeUsd.toFixed(2)}</span>
                    )}
                    <span className={`text-lg font-bold ${isFree ? 'text-indigo-400' : 'text-emerald-400'}`}>
                        {isFree ? 'FREE' : `$${finalFee.toFixed(2)}`}
                    </span>
                </div>
              </button>
            );
        })}
      </div>
      <p className="text-xs text-center text-slate-500 mt-2">
        Prices are live estimates. "Instant" guarantees next-block inclusion.
      </p>
    </div>
  );
};