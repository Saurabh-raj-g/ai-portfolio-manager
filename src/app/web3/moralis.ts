import { CdpWalletProvider } from '@coinbase/agentkit';
import Moralis from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { TokenHolding } from '@/app/types/Index';


  
export async function getTokenHoldings(walletProvider: CdpWalletProvider): Promise<TokenHolding[]> {
  try {
    if(!process.env.MORALIS_API_KEY) {
      throw new Error("Moralis API key not set");
    }
    
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });

    const address = walletProvider.getAddress();

    //const networkId = walletProvider.getNetwork().networkId as string;
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      "chain": EvmChain.BASE_SEPOLIA.apiHex,
      "address": address
    });
    
    const tokens:TokenHolding[] = response.result.map((token) => {
      return {
        tokenAddress: token.tokenAddress?.lowercase as string,
        balance: token.balanceFormatted,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
        usdPrice: parseInt(token.usdPrice)
      }
    });
    return tokens;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      throw error.message;
    }
    throw error;
  }
}
  
