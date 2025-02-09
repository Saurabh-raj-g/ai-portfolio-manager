import { CdpWalletProvider } from '@coinbase/agentkit';
import Moralis from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { TokenHolding } from '@/app/types/Index';
import Chain from '../value-objects/chain';

declare global {
  // eslint-disable-next-line no-var
  var moralisInitialized: boolean; // Define global variable
}

// Ensure Moralis is started only once
async function initMoralis() {
  if (!global.moralisInitialized) {
    if (!process.env.MORALIS_API_KEY) {
      throw new Error("Moralis API key not set");
    }
    
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
    
    global.moralisInitialized = true;
    
  }
}

  
export async function getTokenHoldings(walletProvider: CdpWalletProvider): Promise<TokenHolding[]> {
  try {
    
    await initMoralis(); // Ensure Moralis is initialized

    const address = walletProvider.getAddress();

    //const networkId = walletProvider.getNetwork().networkId as string;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any = {};
    try{
      const chain = getHexChainId(walletProvider.getNetwork().networkId as string);
      response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
        "chain": chain,
        "address": address
      });
    }catch(error){
      const err:string = (error as {message:string})?.message || error as string;
      if(err.includes("[A0003]")){
        await Moralis.start({
          apiKey: process.env.MORALIS_API_KEY,
        });
        
        global.moralisInitialized = true;

        response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          "chain": EvmChain.BASE_SEPOLIA.apiHex,
          "address": address
        });
      }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tokens:TokenHolding[] = response.result.map((token:any) => {
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

export function getHexChainId(networkId: string): string {
  const chain = Chain.fromName<Chain>(networkId);

  if(chain.isBase()) return EvmChain.BASE.apiHex;
  if(chain.isBaseSepolia()) return EvmChain.BASE_SEPOLIA.apiHex;

  throw new Error("Unknown chain");
}
