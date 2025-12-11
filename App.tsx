import React, { useState } from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

import { MOCK_WALLETS, MOCK_PROJECTS, MOCK_TRANSACTIONS } from "./services/mockData";
import { parseTransferCommand } from "./services/geminiService";

import { TransferFlow } from "./components/TransferFlow";
import { WalletCard } from "./components/WalletCard";
import { ProjectCard } from "./components/ProjectCard";
import { Sidebar } from "./components/Sidebar";
import { ActivityLog } from "./components/ActivityLog";
import { SettingsView } from "./components/SettingsView";
import { BuySellWidget } from "./components/BuySellWidget";
import { BridgeView } from "./components/BridgeView";
import { CryptoTrends } from "./components/CryptoTrends";
import { SubscriptionPlans } from "./components/SubscriptionPlans";
import { AssetsView } from "./components/AssetsView";
import { CreateAccount } from "./components/CreateAccount";
import { GasEstimator } from "./components/GasEstimator";
import { ConnectWallet } from "./components/ConnectWallet";

import type { TransferIntent, SubscriptionTier, TokenType } from "./types";

const chartData = [
  { name: "Mon", value: 40000 },
  { name: "Tue", value: 42000 },
  { name: "Wed", value: 41000 },
  { name: "Thu", value: 45000 },
  { name: "Fri", value: 47000 },
  { name: "Sat", value: 46500 },
  { name: "Sun", value: 48500 }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] =
    useState<"dashboard" | "trends" | "assets" | "projects" | "activity" | "settings" | "buysell" | "bridge">("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [showTransfer, setShowTransfer] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [userTier, setUserTier] = useState<SubscriptionTier>("Basic");

  const [transferIntent, setTransferIntent] = useState<TransferIntent | null>(null);
  const [aiCommand, setAiCommand] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <CreateAccount onComplete={() => setIsAuthenticated(true)} />;
  }

  const totalPortfolioValue = MOCK_WALLETS.reduce((acc, wallet) => {
    const walletValue = wallet.balances.reduce(
      (sum, b) => sum + b.amount * b.priceUsd,
      0
    );
    return acc + walletValue;
  }, 0);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;

    try {
      setIsAiThinking(true);
      const intent = await parseTransferCommand(aiCommand, MOCK_WALLETS, MOCK_PROJECTS);
      setIsAiThinking(false);

      if (intent) {
        setTransferIntent(intent);
        setShowTransfer(true);
        setAiCommand("");
      } else {
        setNotification(
          "Couldn't understand that command. Try 'Send 50 USDC from Main to Project A'"
        );
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setIsAiThinking(false);
      setNotification("There was an error interpreting your command.");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleTransferComplete = () => {
    setShowTransfer(false);
    setTransferIntent(null);
    setNotification("Transaction Successful! Funds are on the move.");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
    setUserTier(tier);
    setShowSubscription(false);
    setNotification(`Welcome to ${tier}! Plan benefits active immediately.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAssetSend = (token?: TokenType) => {
    setTransferIntent({ token });
    setShowTransfer(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "trends":
        return <CryptoTrends />;

      case "assets":
        return (
          <AssetsView
            wallets={MOCK_WALLETS}
            transactions={MOCK_TRANSACTIONS}
            onSend={handleAssetSend}
          />
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Fund Innovation
              </h2>
              <p className="text-slate-400">
                Directly transfer capital to vetted projects with transparent gas fees.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_PROJECTS.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onFund={p => {
                    setTransferIntent({ toWalletId: p.id });
                    setShowTransfer(true);
                  }}
                />
              ))}
            </div>
          </div>
        );

      case "activity":
        return <ActivityLog transactions={MOCK_TRANSACTIONS} />;

      case "settings":
        return <SettingsView wallets={MOCK_WALLETS} />;

      case "buysell":
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <h2 className="text-2xl font-bold text-white mb-8">Exchange</h2>
            <BuySellWidget />
          </div>
        );

      case "bridge":
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <BridgeView />
          </div>
        );

      case "dashboard":
      default:
        return (
          <div className="space-y-8">
            {/* Portfolio header / chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-slate-400 text-sm font-medium mb-1">
                      Total Portfolio Value
                    </h2>
                    <div className="text-4xl font-bold text-white tracking-tight">
                      ${totalPortfolioValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-emerald-400 text-sm font-medium flex items-center">
                    +4.25%
                    <span className="text-slate-500 ml-1">past 24h</span>
                  </div>
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          borderColor: "#334155"
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick actions card */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-900/20 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowTransfer(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-colors text-left px-4 flex justify-between items-center group shadow-lg shadow-indigo-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1 bg-white/10 rounded">💸</span>
                      <span>Transfer / Pay</span>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("buysell")}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl font-medium transition-colors text-left px-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1 bg-white/10 rounded">🏦</span>
                      <span>Buy Crypto (Soon)</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("bridge")}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl font-medium transition-colors text-left px-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="p-1 bg-white/10 rounded">🌉</span>
                      <span>Bridge Assets</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet grid */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Your Wallets</h3>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="text-sm text-indigo-400 hover:text-white"
                >
                  Manage Preferences
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_WALLETS.map(wallet => (
                  <WalletCard
                    key={wallet.id}
                    wallet={wallet}
                    onClick={() => {
                      setTransferIntent({ fromWalletId: wallet.id });
                      setShowTransfer(true);
                    }}
                  />
                ))}
                <button className="border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-slate-600 hover:text-slate-400 transition-all min-h-[200px]">
                  <span className="text-2xl mb-2">+</span>
                  <span>Link New Wallet</span>
                </button>
              </div>
            </div>

            {/* Wallet connect + gas estimator */}
            <ConnectWallet onConnected={setConnectedAddress} />
            <GasEstimator defaultFrom={connectedAddress ?? ""} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        toggle={() => setSidebarOpen(!isSidebarOpen)}
        userTier={userTier}
        onOpenSubscription={() => setShowSubscription(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        } relative`}
      >
        <main
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
            !isSidebarOpen ? "pt-20 lg:pt-8" : ""
          }`}
        >
          {/* Header / AI command bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div
              className={`flex items-center gap-4 transition-all ${
                !isSidebarOpen ? "pl-12 lg:pl-0" : ""
              }`}
            >
              <h1 className="text-2xl font-bold text-white capitalize hidden md:block">
                {activeTab === "buysell" ? "Buy & Sell" : activeTab}
              </h1>
            </div>

            <div className="w-full md:w-auto md:min-w-[400px] relative z-30">
              <form onSubmit={handleAiSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-slate-900 border border-slate-700 rounded-xl flex items-center p-2 focus-within:border-indigo-500 transition-colors">
                  <div className="pl-3 pr-2 text-indigo-400">
                    {isAiThinking ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type="text"
                    value={aiCommand}
                    onChange={e => setAiCommand(e.target.value)}
                    placeholder="Ask AI: 'Transfer .05 BTC from Savings to John'"
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 h-10"
                  />
                </div>
              </form>
            </div>
          </div>

          {notification && (
            <div className="fixed top-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {notification}
            </div>
          )}

          {renderContent()}
        </main>
      </div>

      {showTransfer && (
        <TransferFlow
          wallets={MOCK_WALLETS}
          projects={MOCK_PROJECTS}
          initialIntent={transferIntent}
          onClose={() => setShowTransfer(false)}
          onComplete={handleTransferComplete}
          userTier={userTier}
        />
      )}

      {showSubscription && (
        <SubscriptionPlans
          currentTier={userTier}
          onUpgrade={handleUpgrade}
          onClose={() => setShowSubscription(false)}
        />
      )}
    </div>
  );
};

export default App;
