
import React, { useState, useEffect } from 'react';
import { Wallet, Project, TokenType, GasOption, TransferIntent, SubscriptionTier, Chain } from '../types';
import { WalletCard } from './WalletCard';
import { GasSelector } from './GasSelector';
import { calculateTotalFee } from '../services/chainUtils';

interface TransferFlowProps {
  wallets: Wallet[];
  projects: Project[];
  initialIntent: TransferIntent | null;
  onClose: () => void;
  onComplete: () => void;
  userTier?: SubscriptionTier;
}

export const TransferFlow: React.FC<TransferFlowProps> = ({ 
  wallets, 
  projects, 
  initialIntent, 
  onClose,
  onComplete,
  userTier = 'Basic'
}) => {
  const [step, setStep] = useState(1);
  const [sourceId, setSourceId] = useState<string>('');
  const [destId, setDestId] = useState<string>('');
  
  // External Destination State
  const [externalAddress, setExternalAddress] = useState<string>('');
  const [externalChain, setExternalChain] = useState<Chain>('Ethereum');

  const [amount, setAmount] = useState<string>('');
  const [token, setToken] = useState<TokenType | null>(null);
  
  // New State: We need to know which CHAIN the specific token is on (since USDC can be on multiple)
  const [selectedTokenChain, setSelectedTokenChain] = useState<Chain | null>(null);

  const [gasOption, setGasOption] = useState<GasOption | null>(null);
  
  // 2FA State
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  // Fee State
  const [feeDetails, setFeeDetails] = useState({ gasFee: 0, bridgeFee: 0, totalFee: 0, requiresBridge: false });

  // Effects
  useEffect(() => {
    if (initialIntent) {
      if (initialIntent.fromWalletId) setSourceId(initialIntent.fromWalletId);
      if (initialIntent.toWalletId) setDestId(initialIntent.toWalletId);
      if (initialIntent.amount) setAmount(initialIntent.amount.toString());
      if (initialIntent.token) setToken(initialIntent.token as TokenType);
      
      if (initialIntent.fromWalletId && initialIntent.toWalletId && initialIntent.amount) {
          setStep(3); 
      } else if (initialIntent.fromWalletId) {
          setStep(2);
      }
    }
  }, [initialIntent]);

  const getSourceWallet = () => wallets.find(w => w.id === sourceId);

  // When source changes, default to first available token/chain
  useEffect(() => {
    const w = getSourceWallet();
    if (w) {
        // If current selection isn't valid for new wallet, reset
        if (!token || !w.balances.some(b => b.token === token)) {
            const firstBalance = w.balances[0];
            if (firstBalance) {
                setToken(firstBalance.token);
                setSelectedTokenChain(firstBalance.chain);
            } else {
                setToken(null);
                setSelectedTokenChain(null);
            }
        } else {
            // Token exists, but ensure chain is correct (find the chain for this token in this wallet)
            const balanceEntry = w.balances.find(b => b.token === token);
            if (balanceEntry) setSelectedTokenChain(balanceEntry.chain);
        }
    }
  }, [sourceId]);

  // Determine Destination Chain
  const getDestChain = (): Chain => {
      if (externalAddress) return externalChain;
      const w = wallets.find(w => w.id === destId);
      // If destination wallet is multi-chain, we need logic.
      // For now, if bridging, we assume the destination wallet receives on the SAME chain if it supports it,
      // OR we assume it defaults to its first chain.
      // Better logic: Does the dest wallet support the Source Chain?
      if (w) {
          if (selectedTokenChain && w.chains.includes(selectedTokenChain)) {
              return selectedTokenChain; // No bridge needed ideally
          }
          return w.chains[0]; // Default to first supported chain
      }
      
      const p = projects.find(p => p.id === destId);
      if (p) return p.chain;
      return 'Ethereum'; // Default fallback
  };

  // Recalculate fees whenever dependencies change
  useEffect(() => {
      const sourceChain = selectedTokenChain; 
      const destChain = getDestChain();
      
      if (sourceChain && destChain && gasOption) {
          const fees = calculateTotalFee(sourceChain, destChain, gasOption.speed);
          setFeeDetails(fees);
      }
  }, [sourceId, destId, externalAddress, externalChain, gasOption, selectedTokenChain]);

  const handle2FAChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next
    if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
    }
  };

  const handleVerifyAndSend = async () => {
      if (verificationCode.join('').length !== 6) {
          setVerificationError('Please enter a valid 6-digit code');
          return;
      }
      setIsProcessing(true);
      // Simulate verification & blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsProcessing(false);
      onComplete();
  };

  const getDestinationName = () => {
    if (externalAddress) return `${externalAddress.slice(0, 6)}...${externalAddress.slice(-4)}`;
    const w = wallets.find(w => w.id === destId);
    if (w) return w.name;
    const p = projects.find(p => p.id === destId);
    if (p) return p.name;
    return 'Unknown Recipient';
  };

  const getDestinationDetail = () => {
      if (externalAddress) return `${externalChain} (External)`;
      const w = wallets.find(w => w.id === destId);
      if (w) {
         // Show chains nicely
         if (w.chains.length === 1) return w.chains[0] + ' Network';
         return `Multi-Chain (${w.chains.join(', ')})`;
      }
      const p = projects.find(p => p.id === destId);
      if (p) {
          if (p.externalWalletAddress) return `External Project: ${p.chain}`;
          return `Project (${p.chain})`;
      }
      return '';
  }

  const handleDestSelection = (id: string) => {
      setDestId(id);
      setExternalAddress('');
  };

  const handleExternalAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setExternalAddress(e.target.value);
      setDestId('');
  };

  const handleTokenSelect = (t: TokenType, chain: Chain) => {
      setToken(t);
      setSelectedTokenChain(chain);
  };

  const sourceWallet = getSourceWallet();
  const availableTokens = sourceWallet?.balances || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white">
            {step === 1 && "Select Source Wallet"}
            {step === 2 && "Select Recipient"}
            {step === 3 && "Review & Confirm"}
            {step === 4 && "2-Step Verification"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Step 1: Source */}
          {step === 1 && (
            <div className="space-y-4">
               <p className="text-sm text-slate-400">Choose which wallet you want to send funds from.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wallets.map(w => (
                    <WalletCard 
                    key={w.id} 
                    wallet={w} 
                    selected={sourceId === w.id} 
                    onClick={() => setSourceId(w.id)}
                    />
                ))}
               </div>
            </div>
          )}

          {/* Step 2: Destination */}
          {step === 2 && (
            <div className="space-y-8">
              {/* External Address Section */}
              <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                      <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                      </div>
                      <label className="text-base font-medium text-white">Send to External Address</label>
                  </div>
                  
                  <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="Enter 0x address, ENS, or BTC address..."
                        value={externalAddress}
                        onChange={handleExternalAddressChange}
                        className={`w-full bg-slate-950 border ${externalAddress ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-600'} rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm`}
                    />
                    
                    {/* Chain Selector for External Address */}
                    {externalAddress && (
                         <div className="flex items-center gap-4 animate-fadeIn">
                            <label className="text-sm text-slate-400">Destination Network:</label>
                            <select 
                                value={externalChain}
                                onChange={(e) => setExternalChain(e.target.value as Chain)}
                                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Ethereum">Ethereum</option>
                                <option value="Bitcoin">Bitcoin</option>
                                <option value="Polygon">Polygon</option>
                                <option value="Solana">Solana</option>
                                <option value="Ronin">Ronin</option>
                            </select>
                         </div>
                    )}
                  </div>

                  {externalAddress && (
                      <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Valid address format detected
                      </div>
                  )}
              </div>

              <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                      <span className="px-2 bg-slate-900 text-sm text-slate-500">or choose internal account</span>
                  </div>
              </div>

              {/* Internal Wallets */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    My Wallets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wallets.filter(w => w.id !== sourceId).map(w => (
                    <WalletCard 
                      key={w.id} 
                      wallet={w} 
                      selected={destId === w.id} 
                      onClick={() => handleDestSelection(w.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => handleDestSelection(p.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${destId === p.id ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'}`}
                    >
                      <div className="flex justify-between items-start">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">{p.chain}</div>
                      </div>
                      <div className="text-sm text-slate-400 truncate mt-1">{p.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details & Gas */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                 {/* Connector Line */}
                <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-12 md:h-[2px] md:w-24 bg-gradient-to-b md:bg-gradient-to-r ${feeDetails.requiresBridge ? 'from-indigo-500 via-pink-500 to-emerald-500 animate-pulse' : 'from-slate-700 via-indigo-500 to-slate-700'} opacity-50`}></div>
                
                <div className="flex flex-col items-center md:items-start z-10 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 mb-1">From</span>
                    <span className="font-bold text-white text-lg">{getSourceWallet()?.name}</span>
                    <span className="text-xs text-slate-500">{selectedTokenChain}</span>
                </div>
                
                <div className="z-10 bg-slate-800 p-2 rounded-full border border-slate-700 text-slate-400 relative">
                    {feeDetails.requiresBridge && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-pink-500/10 text-pink-500 text-[10px] font-bold px-2 py-0.5 rounded border border-pink-500/20">
                            BRIDGE ACTIVE
                        </div>
                    )}
                    <svg className="w-5 h-5 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>

                <div className="flex flex-col items-center md:items-end z-10 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400 mb-1">To</span>
                    <span className="font-bold text-white text-lg text-right break-all">{getDestinationName()}</span>
                    <span className="text-xs text-slate-500">{getDestinationDetail()}</span>
                </div>
              </div>

              {/* Amount Input & Currency Selection */}
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Currency Selector */}
                      <div className="md:col-span-1">
                          <label className="text-sm font-medium text-slate-300 block mb-2">Currency</label>
                          <div className="space-y-2">
                             {availableTokens.map((bal, idx) => (
                                 <div 
                                    key={`${bal.token}-${idx}`}
                                    onClick={() => handleTokenSelect(bal.token, bal.chain)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${token === bal.token && selectedTokenChain === bal.chain ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
                                 >
                                     <div>
                                         <div className="font-bold text-white">{bal.token}</div>
                                         <div className="text-[10px] text-slate-400 uppercase">{bal.chain}</div>
                                     </div>
                                     <div className="text-right">
                                         <div className="text-sm text-white font-mono">{bal.amount}</div>
                                         <div className="text-[10px] text-slate-500">Balance</div>
                                     </div>
                                 </div>
                             ))}
                          </div>
                      </div>

                      {/* Amount Input */}
                      <div className="md:col-span-2">
                           <label className="text-sm font-medium text-slate-300 block mb-2">Amount to Send</label>
                           <div className="relative group h-full">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 text-3xl font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700 h-[104px]"
                                    placeholder="0.00"
                                />
                                <div className="absolute bottom-3 right-4 text-sm text-slate-400">
                                    {token && (
                                        <span>
                                            ≈ ${(parseFloat(amount || '0') * (availableTokens.find(b => b.token === token && b.chain === selectedTokenChain)?.priceUsd || 0)).toFixed(2)} USD
                                        </span>
                                    )}
                                </div>
                           </div>
                      </div>
                  </div>
              </div>

              {/* Gas Selection */}
              <div className="pt-4 border-t border-slate-800">
                 <GasSelector 
                    selectedSpeed={gasOption?.speed || ''} 
                    onSelect={setGasOption} 
                    userTier={userTier}
                 />
                 
                 {/* Total Breakdown for Bridging */}
                 {gasOption && (
                     <div className="mt-4 bg-slate-950 rounded-lg p-3 border border-slate-800 text-sm">
                         <div className="flex justify-between text-slate-400 mb-1">
                             <span>Network Gas:</span>
                             <span>${feeDetails.gasFee.toFixed(2)}</span>
                         </div>
                         {feeDetails.requiresBridge && (
                             <div className="flex justify-between text-pink-400 mb-1">
                                 <span>Bridge Fee:</span>
                                 <span>+${feeDetails.bridgeFee.toFixed(2)}</span>
                             </div>
                         )}
                         <div className="border-t border-slate-800 mt-2 pt-2 flex justify-between font-bold text-white">
                             <span>Total Estimated Fee:</span>
                             <span>${feeDetails.totalFee.toFixed(2)}</span>
                         </div>
                     </div>
                 )}
              </div>
            </div>
          )}

          {/* Step 4: 2FA Verification */}
          {step === 4 && (
              <div className="flex flex-col items-center justify-center py-6 space-y-6">
                  <div className="bg-indigo-500/20 p-4 rounded-full">
                      <svg className="w-12 h-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                  </div>
                  
                  <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Security Verification</h3>
                      <p className="text-slate-400 max-w-xs mx-auto">
                          Enter the 6-digit code sent to your authenticated device (Google Auth or SMS).
                      </p>
                  </div>

                  <div className="flex gap-2">
                      {verificationCode.map((digit, idx) => (
                          <input 
                            key={idx}
                            id={`code-${idx}`}
                            type="text" 
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handle2FAChange(idx, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !digit && idx > 0) {
                                    document.getElementById(`code-${idx - 1}`)?.focus();
                                }
                            }}
                            className="w-12 h-14 bg-slate-800 border border-slate-700 rounded-lg text-center text-2xl font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          />
                      ))}
                  </div>
                  
                  {verificationError && (
                      <div className="text-pink-500 text-sm font-medium animate-pulse">
                          {verificationError}
                      </div>
                  )}

                  <div className="text-xs text-slate-500">
                      Resend code in 0:30
                  </div>
              </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex justify-between shrink-0 z-20">
           {step > 1 && step < 4 ? (
             <button 
               onClick={() => setStep(step - 1)}
               className="px-6 py-2 text-slate-400 hover:text-white transition-colors font-medium"
             >
               Back
             </button>
           ) : (
             <div></div>
           )}

           {step < 3 && (
             <button 
               disabled={step === 1 ? !sourceId : (!destId && !externalAddress)}
               onClick={() => setStep(step + 1)}
               className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
             >
               Next Step
             </button>
           )}

           {step === 3 && (
             <button 
               onClick={() => setStep(4)}
               disabled={!amount || parseFloat(amount) <= 0 || !token}
               className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
             >
               Proceed to Verify
             </button>
           )}
           
           {step === 4 && (
             <button 
                onClick={handleVerifyAndSend}
                disabled={isProcessing}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 w-full justify-center md:w-auto"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing Transfer...
                  </>
                ) : (
                  <>
                     {feeDetails.requiresBridge ? 'Bridge & Send' : 'Confirm & Send'}
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </>
                )}
              </button>
           )}
        </div>
      </div>
    </div>
  );
};
