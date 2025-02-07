import { cdpWalletProvider } from "@/app/ai-agent/cdpWalletProvider";
import Chain from "@/app/value-objects/chain";
import { getTokenHoldings } from "@/app/web3/moralis";
import { verifyUser } from "@/app/web3/verify-user";

export async function getTokens(address: string, signature: string, chain: Chain) {
  
  verifyUser({ address, signature, chain });
  
  const wallet = await cdpWalletProvider({ address, signature, chain });
  
  const tokens = await getTokenHoldings(wallet);

  return tokens;
}
