import { CdpWalletProvider } from "@coinbase/agentkit";
import Chain from "../value-objects/chain";
import { verifyUser } from "../web3/verify-user";
import * as fs from "fs";

export interface WalletProviderProps {
  address: string;
  signature: string;
  chain: Chain;
}
export async function cdpWalletProvider({ address, signature, chain }: WalletProviderProps) {
  
  verifyUser({ address, signature, chain });
  
  let walletDataStr: string | null = null;

  // Configure a file to persist the agent's CDP MPC Wallet Data
  const chainId = chain.getChainId();

  if (!chainId) {
    throw new Error("Chain ID not found");
  }

  const WALLET_DATA_FILE = `cdp-wallet-${chainId}-${address}-.txt`;

  // Read existing wallet data if available
  const FILE_EXISTS = fs.existsSync(WALLET_DATA_FILE);

  if (FILE_EXISTS) {
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
      // Continue without wallet data
    }
  }

  const config = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    cdpWalletData: walletDataStr || undefined,
    networkId: chain.getName(),
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);
 
  if(!FILE_EXISTS){
    const exportedWallet = await walletProvider.exportWallet();
    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
  }
  return walletProvider;
}

export async function createCDPWallet({ address, signature, chain }: WalletProviderProps){
  verifyUser({ address, signature, chain });
  
  // Configure a file to persist the agent's CDP MPC Wallet Data
  const chainId = chain.getChainId();

  if (!chainId) {
    throw new Error("Chain ID not found");
  }

  const WALLET_DATA_FILE = `cdp-wallet-${chainId}-${address}-.txt`;

  // Read existing wallet data if available
  const FILE_EXISTS = fs.existsSync(WALLET_DATA_FILE);

  if (FILE_EXISTS) {
    return;
  }

  const config = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    networkId: chain.getName(),
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);
 
  const exportedWallet = await walletProvider.exportWallet();

  fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));
}

