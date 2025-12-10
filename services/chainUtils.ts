
import { Chain, GasOption } from "../types";

// Base gas estimates in USD
const BASE_GAS: Record<Chain, number> = {
    'Ethereum': 4.50,
    'Bitcoin': 3.20,
    'Polygon': 0.02,
    'Solana': 0.0005,
    'Ronin': 0.01
};

// Bridge fees (base cost to enter/exit chain)
const BRIDGE_FEES: Record<Chain, number> = {
    'Ethereum': 8.00,
    'Bitcoin': 12.00,
    'Polygon': 2.50,
    'Solana': 1.50,
    'Ronin': 1.00
};

export const getEstimate = (chain: Chain, type: 'gas' | 'bridge'): number => {
    // Add some random fluctuation to simulate real-time network conditions
    const fluctuation = 0.9 + (Math.random() * 0.2); // +/- 10%
    const base = type === 'gas' ? BASE_GAS[chain] : BRIDGE_FEES[chain];
    return Number((base * fluctuation).toFixed(4));
};

export const calculateTotalFee = (
    sourceChain: Chain, 
    destChain: Chain, 
    speed: GasOption['speed']
): { gasFee: number; bridgeFee: number; totalFee: number; requiresBridge: boolean } => {
    
    const requiresBridge = sourceChain !== destChain;
    
    // Gas Multiplier based on speed
    let speedMultiplier = 1;
    if (speed === 'Fast') speedMultiplier = 1.5;
    if (speed === 'Instant') speedMultiplier = 3.0;

    const gasFee = getEstimate(sourceChain, 'gas') * speedMultiplier;
    
    // Bridge fee is applied if chains differ. We usually pay the bridge fee of the DESTINATION chain logic (simplified)
    // or an average. Let's assume the cost is exiting source + entering dest.
    // For simplicity, we'll take the max of the two bridge fees.
    const bridgeFee = requiresBridge ? Math.max(getEstimate(sourceChain, 'bridge'), getEstimate(destChain, 'bridge')) : 0;

    return {
        gasFee,
        bridgeFee,
        totalFee: gasFee + bridgeFee,
        requiresBridge
    };
};
