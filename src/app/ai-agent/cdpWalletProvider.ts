import { CdpWalletProvider } from "@coinbase/agentkit";
import Chain from "../value-objects/chain";
import { verifyUser } from "../web3/verify-user";
export interface CDPWalletConfig{
  cdpWalletData: {
    walletId: string;
    seed: string;
    networkId: string;
  }
}

export interface WalletProviderProps extends CDPWalletConfig{
  address: string;
  signature: string;
  chain: Chain;
}

export interface VerifyUserProps{
  address: string;
  signature: string;
  chain: Chain;
}
export async function cdpWalletProvider({ address, signature, chain, cdpWalletData }: WalletProviderProps) {
  
  verifyUser({ address, signature, chain });
  
  // Configure a file to persist the agent's CDP MPC Wallet Data
  const chainId = chain.getChainId();

  if (!chainId) {
    throw new Error("Chain ID not found");
  }

  const walletDataStr = JSON.stringify(cdpWalletData);

  const config = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    cdpWalletData: walletDataStr || undefined,
    networkId: chain.getName(),
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);
 
  return walletProvider;
}

export async function createCDPWallet({ address, signature, chain }: VerifyUserProps){
  verifyUser({ address, signature, chain });
  
  // Configure a file to persist the agent's CDP MPC Wallet Data
  const chainId = chain.getChainId();

  if (!chainId) {
    throw new Error("Chain ID not found");
  }

  const config = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    networkId: chain.getName(),
  };

  const walletProvider = await CdpWalletProvider.configureWithWallet(config);
 
  const exportedWallet = await walletProvider.exportWallet();

  const cdpwalletAddress = walletProvider.getAddress().toLowerCase();

  return {cdpwalletAddress, exportedWallet};
}

