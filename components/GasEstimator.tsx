import React, { useEffect, useState } from "react";
import { estimateNativeTransferGas, GasEstimateResult } from "../services/gas";

type GasEstimatorProps = {
  defaultFrom?: string;
};

export const GasEstimator: React.FC<GasEstimatorProps> = ({ defaultFrom }) => {
  const [from, setFrom] = useState(defaultFrom ?? "");
  const [to, setTo] = useState("");
  const [amountEth, setAmountEth] = useState("");
  const [result, setResult] = useState<GasEstimateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If a connected wallet comes in later, auto-fill the From field once
  useEffect(() => {
    if (defaultFrom && !from) {
      setFrom(defaultFrom);
    }
  }, [defaultFrom, from]);

  const handleEstimate = async () => {
    if (!from || !to || !amountEth) {
      setError("Please fill in from, to, and amount (ETH).");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const res = await estimateNativeTransferGas({ from, to, amountEth });
      setResult(res);
    } catch (e: any) {
      setError(e.message ?? "Failed to estimate gas.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        Gas Fee Estimator (Native Transfer)
      </h3>

      <div className="grid gap-3 mb-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">
            From address
          </label>
          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">
            To address
          </label>
          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Amount (ETH)
          </label>
          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            type="number"
            min="0"
            step="0.0001"
            value={amountEth}
            onChange={e => setAmountEth(e.target.value)}
            placeholder="0.01"
          />
        </div>
      </div>

      <button
        onClick={handleEstimate}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        {loading ? "Estimating..." : "Estimate gas"}
      </button>

      {error && (
        <div className="mt-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="mt-4 text-sm text-slate-200 space-y-1">
          <div>
            Estimated fee:{" "}
            <span className="font-semibold">{result.totalFeeEth}</span> ETH
          </div>
          <div>Gas limit: {result.gasLimit.toString()}</div>
          <div>Max fee per gas: {result.maxFeePerGas.toString()} wei</div>
          <div>
            Priority fee per gas:{" "}
            {result.maxPriorityFeePerGas.toString()} wei
          </div>
        </div>
      )}
    </div>
  );
};
