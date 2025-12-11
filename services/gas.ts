import { formatEther, parseEther } from "ethers";
import { getReadOnlyProvider } from "./ethProvider";

export type GasEstimateResult = {
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  totalFeeWei: bigint;
  totalFeeEth: string;
};

export async function estimateNativeTransferGas(params: {
  from: string;
  to: string;
  amountEth: string;
}): Promise<GasEstimateResult> {
  const { from, to, amountEth } = params;

  const provider = getReadOnlyProvider();

  const tx = {
    from,
    to,
    value: parseEther(amountEth)
  };

  // 1. Estimate gas for this tx
  const gasLimit = await provider.estimateGas(tx);

  // 2. Get fee data (EIP-1559 aware)
  const feeData = await provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;
  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? 0n;

  if (!maxFeePerGas) {
    throw new Error("Could not get fee data from provider.");
  }

  const totalFeeWei = gasLimit * maxFeePerGas;
  const totalFeeEth = formatEther(totalFeeWei);

  return {
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    totalFeeWei,
    totalFeeEth
  };
}
