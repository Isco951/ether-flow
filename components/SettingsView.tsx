
import React, { useState } from 'react';
import { Wallet } from '../types';

interface SettingsViewProps {
  wallets: Wallet[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({ wallets }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'payments' | 'tax' | 'withdraw'>('profile');
  const [localWallets, setLocalWallets] = useState(wallets);

  const moveWallet = (index: number, direction: 'up' | 'down') => {
    const newWallets = [...localWallets];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex >= 0 && swapIndex < newWallets.length) {
      [newWallets[index], newWallets[swapIndex]] = [newWallets[swapIndex], newWallets[index]];
      setLocalWallets(newWallets);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4">
        <h2 className="text-lg font-bold text-white mb-6 px-2">Settings</h2>
        <div className="space-y-1">
            {[
                {id: 'profile', label: 'Identity & Profile'},
                {id: 'security', label: 'Privacy & Security'},
                {id: 'payments', label: 'Payment Methods'},
                {id: 'withdraw', label: 'Withdraw Funds'},
                {id: 'tax', label: 'Tax Documents'}
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-8">
        {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Identity Verification</h3>
                    <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl p-4 flex items-start gap-4">
                        <div className="bg-emerald-600 rounded-full p-1 mt-1">
                             <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-emerald-400">Identity Verified (Level 2)</h4>
                            <p className="text-sm text-slate-400 mt-1">You can withdraw up to $100,000 daily. Your KYC documents are encrypted and stored securely.</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                        <input type="text" value="John Doe" readOnly className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                        <input type="email" value="john@example.com" readOnly className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300" />
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl">
                <h3 className="text-xl font-bold text-white mb-4">Privacy & Security</h3>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                    <div>
                        <div className="font-medium text-white">Two-Factor Authentication</div>
                        <div className="text-sm text-slate-400">Secure your account with 2FA</div>
                    </div>
                    <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                    <div>
                        <div className="font-medium text-white">App Lock</div>
                        <div className="text-sm text-slate-400">Require FaceID/PIN to open app</div>
                    </div>
                    <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'payments' && (
            <div className="space-y-6 max-w-xl">
                <h3 className="text-xl font-bold text-white mb-2">Preferred Payment Sources</h3>
                <p className="text-sm text-slate-400 mb-4">
                    When you make a purchase, we will use funds from these accounts in this order. 
                    Drag or use arrows to reorder.
                </p>
                
                <div className="space-y-2">
                    {localWallets.map((wallet, index) => (
                        <div key={wallet.id} className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-xl">
                            <span className="text-slate-500 font-mono w-4">{index + 1}</span>
                            <div className="flex-1">
                                <div className="font-medium text-white">{wallet.name}</div>
                                <div className="text-xs text-slate-400">{wallet.chain} • {wallet.balances[0].amount} {wallet.balances[0].token}</div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => moveWallet(index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-white disabled:opacity-30">▲</button>
                                <button onClick={() => moveWallet(index, 'down')} disabled={index === localWallets.length - 1} className="text-slate-400 hover:text-white disabled:opacity-30">▼</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'withdraw' && (
             <div className="space-y-6 max-w-2xl">
                 <h3 className="text-xl font-bold text-white mb-2">Withdraw Funds</h3>
                 <p className="text-sm text-slate-400 mb-6">
                     Transfer crypto converted to fiat directly to your linked bank account.
                 </p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Standard Withdrawal */}
                     <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden flex flex-col">
                         <div className="absolute top-3 right-3">
                              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         </div>
                         <h4 className="font-bold text-white mb-1">Standard</h4>
                         <div className="text-2xl font-bold text-slate-200 mb-4">Free</div>
                         <ul className="space-y-3 mb-6 flex-1">
                             <li className="text-sm text-slate-400 flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> 1-3 Business Days
                             </li>
                             <li className="text-sm text-slate-400 flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> No Fees
                             </li>
                              <li className="text-sm text-slate-400 flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> ACH Transfer
                             </li>
                         </ul>
                         <button disabled className="w-full py-2 bg-slate-700 text-slate-400 rounded-lg text-sm font-bold cursor-not-allowed border border-slate-600">
                             Coming Soon
                         </button>
                     </div>

                     {/* Instant Withdrawal */}
                     <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative overflow-hidden flex flex-col">
                         <div className="absolute top-3 right-3">
                              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         </div>
                         <h4 className="font-bold text-white mb-1">Immediate</h4>
                         <div className="text-2xl font-bold text-slate-200 mb-4">1.5% <span className="text-sm font-normal text-slate-500">fee</span></div>
                         <ul className="space-y-3 mb-6 flex-1">
                              <li className="text-sm text-slate-400 flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Instant (RTP)
                             </li>
                             <li className="text-sm text-slate-400 flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Available 24/7
                             </li>
                             <li className="text-sm text-slate-400 flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Direct Deposit
                             </li>
                         </ul>
                         <button disabled className="w-full py-2 bg-slate-700 text-slate-400 rounded-lg text-sm font-bold cursor-not-allowed border border-slate-600">
                             Coming Soon
                         </button>
                     </div>
                 </div>
                 
                 <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 items-start mt-4">
                      <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div className="text-sm text-indigo-300 leading-relaxed">
                          We are currently upgrading our banking integrations to support Real-Time Payments (RTP) for instant withdrawals. This feature will be enabled in the next release.
                      </div>
                 </div>
             </div>
        )}

        {activeTab === 'tax' && (
             <div className="space-y-6 max-w-xl">
                 <h3 className="text-xl font-bold text-white mb-4">Tax Documents</h3>
                 <div className="p-4 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl text-center">
                     <p className="text-slate-400 mb-2">Generate your 2023 Tax Report</p>
                     <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500">
                         Download Form 8949 (PDF)
                     </button>
                 </div>
                 <p className="text-xs text-slate-500">
                     * EtherFlow automatically calculates capital gains/losses based on FIFO method. Consult a tax professional for official filing.
                 </p>
             </div>
        )}
      </div>
    </div>
  );
};
