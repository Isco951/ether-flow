import React, { useState } from "react";
import { getBrowserProvider } from "../services/ethProvider";
import { formatEther } from "ethers";

export const ConnectWallet: React.FC<{ onConnected: (address: string) => void }> = ({ onConnected }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setError(null);

      const provider = await getBrowserProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      const addr = accounts[0];

      setAddress(addr);
      onConnected(addr);

      const bal = await provider.getBalance(addr);
      setBalance(formatEther(bal));
    } catch (e: any) {
      setError(e.message ?? "Failed to connect.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-6">
      <h3 className="text-lg font-bold text-white mb-2">Wallet Connection</h3>

      {!address ? (
        <button
          onClick={connect}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="text-slate-300 text-sm">
          <div className="mb-1">
            Connected: <span className="text-white font-semibold">{address}</span>
          </div>
          {balance && <div>Balance: {balance} ETH</div>}
        </div>
      )}

      {error && <div className="text-rose-400 text-sm mt-2">{error}</div>}
    </div>
  );
};
