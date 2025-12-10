import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Wallet, Project, TransferIntent } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const transferSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fromWalletId: { type: Type.STRING, description: "The ID of the source wallet based on the name provided." },
    toWalletId: { type: Type.STRING, description: "The ID of the destination wallet or project based on the name provided." },
    amount: { type: Type.NUMBER, description: "The numeric amount to transfer." },
    token: { type: Type.STRING, description: "The token symbol (e.g., ETH, USDC, MATIC)." },
    note: { type: Type.STRING, description: "A brief note about the transaction purpose." }
  }
};

export const parseTransferCommand = async (
  command: string,
  wallets: Wallet[],
  projects: Project[]
): Promise<TransferIntent | null> => {
  try {
    const walletContext = wallets.map(w => `${w.name} (ID: ${w.id}, Balance: ${w.balances.map(b => `${b.amount} ${b.token}`).join(', ')})`).join('\n');
    const projectContext = projects.map(p => `${p.name} (ID: ${p.id})`).join('\n');

    const prompt = `
      Extract transaction details from the user's natural language command.
      
      User Command: "${command}"
      
      Available Wallets:
      ${walletContext}
      
      Available Projects/Destinations:
      ${projectContext}
      
      Rules:
      1. Map wallet names loosely (e.g., "main" -> "Main Vault").
      2. If a destination is a project, use the project ID.
      3. Infer the token if obvious (e.g., "$" usually implies USDC).
      4. Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: transferSchema,
        temperature: 0.1, // Low temperature for deterministic extraction
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as TransferIntent;
    }
    return null;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};

export const getGasAnalysis = async (network: string): Promise<string> => {
  // Simulate a live check or explanation
  try {
    const prompt = `Give a 1-sentence witty or informative reason why gas fees on ${network} might be high or low right now. Be creative but realistic based on typical crypto trends.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            maxOutputTokens: 50,
            temperature: 0.7
        }
    });
    return response.text || "Gas is stable.";
  } catch (e) {
    return "Network traffic is moderate.";
  }
}
