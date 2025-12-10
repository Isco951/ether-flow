
import React, { useState } from 'react';
import { Chain, TokenType } from '../types';

interface ChainConfig {
  id: Chain;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const CHAINS: ChainConfig[] = [
  { 
    id: 'Ethereum', 
    name: 'Ethereum', 
    color: 'from-slate-800 to-slate-900',
    description: 'High security, widely used L1.',
    icon: (
        <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
             <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
        </svg>
    )
  },
  { 
    id: 'Solana', 
    name: 'Solana', 
    color: 'from-teal-900/40 to-emerald-900/40',
    description: 'High throughput, low latency.',
    icon: (
        <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.46 7.82h12.56c.96 0 1.74-.78 1.74-1.74 0-.96-.78-1.74-1.74-1.74H3.46c-.96 0-1.74.78-1.74 1.74 0 .96.78 1.74 1.74 1.74zm17.08 4.36H7.98c-.96 0-1.74.78-1.74 1.74s.78 1.74 1.74 1.74h12.56c.96 0 1.74-.78 1.74-1.74 0-.96-.78-1.74-1.74-1.74zm-17.08 6.1h12.56c.96 0 1.74-.78 1.74-1.74 0-.96-.78-1.74-1.74-1.74H3.46c-.96 0-1.74.78-1.74 1.74 0 .96.78 1.74 1.74 1.74z"/>
        </svg>
    ) 
  },
  { 
    id: 'Ronin', 
    name: 'Ronin', 
    color: 'from-blue-900/40 to-indigo-900/40',
    description: 'EVM blockchain built for gaming.',
    icon: (
        <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l9 4v12l-9 4-9-4V6l9-4zm0 2.2L5 7.4v9.2l7 3.2 7-3.2V7.4L12 4.2z" />
            <path d="M12 7l5 3v5l-5 3-5-3v-5l5-3z" opacity="0.5"/>
        </svg>
    ) 
  }
];

const ChainSelector = ({ 
  value, 
  onChange, 
  exclude 
}: { 
  value: Chain; 
  onChange: (c: Chain) => void; 
  exclude?: Chain; 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedChain = CHAINS.find(c => c.id === value) || CHAINS[0];
  const availableChains = CHAINS.filter(c => c.id !== exclude);

  return (
    <div className="relative">
      {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 flex items-center justify-between font-bold text-lg hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-indigo-500 relative z-20 group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-slate-900 shadow-sm transition-colors ring-1 ring-slate-700/50`}>
             {selectedChain.icon}
          </div>
          <span className="tracking-tight">{selectedChain.name}</span>
        </div>
        <svg className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 overflow-hidden ring-1 ring-black/50 animate-fadeIn">
          {availableChains.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onChange(c.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-left transition-colors border-b border-slate-800/50 last:border-0 group relative"
            >
              <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                {c.icon}
              </div>
              <span className="font-medium text-slate-200 group-hover:text-white">{c.name}</span>
              
              {/* Tooltip */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700 shadow-lg pointer-events-none whitespace-nowrap">
                  {c.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const BridgeView = () => {
  const [fromChain, setFromChain] = useState<Chain>('Ethereum');
  const [toChain, setToChain] = useState<Chain>('Ronin');
  const [amount, setAmount] = useState<string>('');
  const [token, setToken] = useState<TokenType>(TokenType.ETH);
  const [isBridging, setIsBridging] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBridge = () => {
    if (!amount) return;
    setIsBridging(true);
    setTimeout(() => {
      setIsBridging(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setAmount('');
    }, 2500);
  };

  const getChainConfig = (c: Chain) => CHAINS.find(chain => chain.id === c) || CHAINS[0];

  const swapChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Bridge Assets</h2>
        <p className="text-slate-400">Move your gaming assets seamlessly across chains.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-start">
        {/* Source Chain */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-visible group">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getChainConfig(fromChain).color} rounded-t-2xl`}></div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">From Network</label>
          
          <ChainSelector 
            value={fromChain} 
            onChange={setFromChain} 
            exclude={toChain} 
          />
          
          <div className="mt-6">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Amount to Bridge</label>
             <div className="relative">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-2xl text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <div className="absolute right-2 top-2 bottom-2">
                    <select 
                      value={token}
                      onChange={(e) => setToken(e.target.value as TokenType)}
                      className="h-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 text-sm font-bold focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {Object.values(TokenType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                </div>
             </div>
             <div className="mt-2 text-right text-xs text-slate-500">
                Balance: 4.50 ETH
             </div>
          </div>
        </div>

        {/* Swap Action */}
        <div className="lg:col-span-1 flex justify-center pt-8 lg:pt-24">
            <button 
                onClick={swapChains}
                className="bg-slate-800 hover:bg-slate-700 p-3 rounded-full border border-slate-700 text-slate-300 hover:text-white transition-all hover:rotate-180 shadow-xl"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </button>
        </div>

        {/* Destination Chain */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-visible">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getChainConfig(toChain).color} rounded-t-2xl`}></div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">To Network</label>
          
          <ChainSelector 
            value={toChain} 
            onChange={setToChain} 
            exclude={fromChain} 
          />

          <div className="mt-6 bg-slate-800/30 rounded-xl p-4 border border-slate-800">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-slate-400">You Receive</span>
                 <span className="text-sm font-bold text-white">
                    {amount ? amount : '0.00'} {token}
                 </span>
             </div>
             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-slate-400">Bridge Fee</span>
                 <span className="text-sm text-emerald-400">$0.00 <span className="text-[10px] bg-emerald-500/10 px-1 rounded ml-1">PROMO</span></span>
             </div>
             <div className="flex justify-between items-center">
                 <span className="text-sm text-slate-400">Est. Time</span>
                 <span className="text-sm text-white">~2 mins</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
          <button 
             onClick={handleBridge}
             disabled={!amount || isBridging}
             className={`
                w-full max-w-md py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3
                ${isBridging 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
                }
             `}
          >
             {isBridging ? (
                 <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Bridging Assets...
                 </>
             ) : (
                 <>
                    Bridge Assets Now
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </>
             )}
          </button>
      </div>

      {success && (
         <div className="fixed bottom-10 right-10 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             <div>
                 <div className="font-bold">Bridge Successful!</div>
                 <div className="text-xs text-emerald-100">Assets are arriving on {toChain}</div>
             </div>
         </div>
      )}

      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/50">
          {[
              { label: 'Total Volume', val: '$42.5M' },
              { label: 'Supported Chains', val: '3' },
              { label: 'Avg Time', val: '120s' }
          ].map((stat, i) => (
              <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-slate-200">{stat.val}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
          ))}
      </div>
    </div>
  );
};
