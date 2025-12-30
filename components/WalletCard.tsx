import React from "react";

type Balance = {
  token: string;     // "BTC", "ETH", etc.
  amount: number;
  priceUsd: number;  // live-injected by App.tsx
};

type Wallet = {
  id: string;
  name: string;
  balances: Balance[];
};

type Props = {
  wallet: Wallet;
  onClick?: () => void;
};

export const WalletCard: React.FC<Props> = ({ wallet, onClick }) => {
  const totalUsd = wallet.balances.reduce((sum, b) => sum + b.amount * b.priceUsd, 0);

  return (
    <button
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left hover:border-slate-700 hover:bg-slate-900/60 transition-all min-h-[200px] flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-white font-bold text-lg">{wallet.name}</h4>
          <div className="text-slate-400 text-xs mt-1">Wallet ID: {wallet.id}</div>
        </div>

        <div className="text-right">
          <div className="text-slate-400 text-xs">Wallet Value</div>
          <div className="text-white font-bold text-xl">
            ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2 flex-1">
        {wallet.balances.map((b) => {
          const valueUsd = b.amount * b.priceUsd;
          return (
            <div
              key={`${wallet.id}-${b.token}`}
              className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10">
                  <div className="text-white font-semibold">{b.token}</div>
                  <div className="text-slate-500 text-xs">
                    ${b.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-slate-200 font-semibold">
                  {b.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                </div>
                <div className="text-slate-400 text-xs">
                  ${valueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-indigo-400 text-sm font-medium">
        Click to transfer →
      </div>
    </button>
  );
};
