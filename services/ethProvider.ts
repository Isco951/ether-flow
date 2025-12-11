import { BrowserProvider, JsonRpcProvider } from "ethers";

export function getReadOnlyProvider() {
  const rpcUrl = import.meta.env.VITE_RPC_URL as string | undefined;
  if (!rpcUrl) {
    throw new Error("VITE_RPC_URL is not set in .env.local");
  }
  return new JsonRpcProvider(rpcUrl);
}

export async function getBrowserProvider() {
  if (!window.ethereum) {
    throw new Error("No injected Ethereum provider found (e.g. MetaMask).");
  }
  return new BrowserProvider(window.ethereum);
}
