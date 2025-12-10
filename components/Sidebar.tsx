
import React from 'react';
import { SubscriptionTier } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggle: () => void;
  userTier?: SubscriptionTier;
  onOpenSubscription?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    activeTab, 
    setActiveTab, 
    isOpen, 
    toggle, 
    userTier = 'Basic',
    onOpenSubscription,
    onLogout
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'assets', label: 'Assets', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'trends', label: 'Market Trends', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'projects', label: 'Fund Projects', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'bridge', label: 'Bridge Assets', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { id: 'buysell', label: 'Exchange', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'activity', label: 'Activity', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const getTierColor = () => {
      switch(userTier) {
          case 'Whale': return 'from-indigo-400 to-purple-500';
          case 'Pro': return 'from-emerald-400 to-teal-500';
          default: return 'from-slate-400 to-slate-500';
      }
  };

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    // Auto-close on mobile (lg breakpoint is 1024px)
    if (window.innerWidth < 1024) {
      toggle();
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Visible when closed) */}
      <button 
        onClick={toggle}
        className={`fixed top-6 left-6 z-50 p-2.5 bg-slate-800 text-white rounded-lg shadow-xl shadow-black/20 hover:bg-slate-700 transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'}`}
        aria-label="Open Menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800 
        flex flex-col h-screen transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
           <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EtherFlow</span>
           </div>
           
           <button onClick={toggle} className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-colors lg:hidden">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>
  
        {/* Nav */}
        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                  w-full flex items-center p-3 rounded-lg transition-all duration-200 group
                  ${activeTab === item.id 
                      ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}
              `}
            >
              <svg className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
  
        {/* Footer / Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between gap-2">
          <div 
            onClick={onOpenSubscription}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors group relative flex-1 min-w-0"
          >
            <div className={`w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr ${getTierColor()} border-2 border-slate-800 flex items-center justify-center text-slate-900 text-xs font-bold shadow-md group-hover:border-slate-600 transition-colors`}>
              JD
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${userTier === 'Basic' ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'}`}></span>
                    <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-bold">
                        {userTier} Member
                    </p>
                </div>
            </div>
            
            {/* Upgrade Hint */}
            {userTier === 'Basic' && (
                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-bounce">
                    UPGRADE
                </div>
            )}
          </div>

          <button 
             onClick={onLogout}
             className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
             title="Sign Out"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
