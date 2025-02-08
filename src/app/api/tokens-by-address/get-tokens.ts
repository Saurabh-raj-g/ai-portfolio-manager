import { CDPWalletConfig, cdpWalletProvider } from "@/app/ai-agent/cdpWalletProvider";
import Chain from "@/app/value-objects/chain";
import { getTokenHoldings } from "@/app/web3/moralis";
import { verifyUser } from "@/app/web3/verify-user";

export async function getTokens(address: string, signature: string, chain: Chain, cdpWalletData: CDPWalletConfig) {
  
  verifyUser({ address, signature, chain });
  
  const wallet = await cdpWalletProvider({ address, signature, chain, cdpWalletData: cdpWalletData.cdpWalletData });
  
  const tokens = await getTokenHoldings(wallet);

  const cdpwalletAddress = wallet.getAddress().toLowerCase();

  return {tokens, cdpwalletAddress};
}
