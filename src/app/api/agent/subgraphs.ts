import { CdpWalletProvider } from "@coinbase/agentkit";
import fetch from 'node-fetch';
 // write code for getting all the token holdings by the walletAddress
 export async function getTokenHoldings(walletProvider: CdpWalletProvider): Promise<TokenHolding[]> {
    const address = walletProvider.getAddress();
    console.log("Wallet Address:", address);
    const networkId = walletProvider.getNetwork().networkId as string;
    const tokenHoldings = await getHoldingTokens(address, networkId);
    return tokenHoldings;
  }


// Define the type for a token holding
export type TokenHolding ={
  tokenAddress: string;
  balance: string;
  decimals: number;
  symbol: string;
  name: string;
}

// Define subgraph endpoints for different chains
const SUBGRAPH_URLS: Record<string, string> = {
  "base-sepolia": `https://gateway.thegraph.com/api/${process.env.SUBGRAPH_API_KEY as string}/subgraphs/id/2oKCq3rDwdYPSao4UbDZKSNbawEdhBVf3BxmqJzFe1uj`
};

/**
 * Fetches all ERC-20 tokens held by a wallet using The Graph subgraph.
 * @param walletAddress The EVM wallet address to fetch holdings for.
 * @param chain The blockchain network default is base-sepolia (e.g., 'ethereum', 'polygon', 'bsc').
 * @returns List of token holdings.
 */
async function getHoldingTokens(walletAddress: string, chain: string = 'base-sepolia'): Promise<TokenHolding[]> {
  if (!SUBGRAPH_URLS[chain]) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const query = `
    {
      account(id: "${walletAddress.toLowerCase()}") {
        id
        balances {
          token {
            id
            symbol
            name
            decimals
          }
          balance
        }
      }
    }
  `;

  const response = await fetch(SUBGRAPH_URLS[chain], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const json = await response.json();
  console.log(json);
  if (!json.data || !json.data.tokenBalances) {
    throw new Error("Failed to fetch token balances");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return json.data.tokenBalances.map((token: any) => ({
    tokenAddress: token.token.id,
    balance: token.balance,
    decimals: token.token.decimals,
    symbol: token.token.symbol,
    name: token.token.name,
  }));
}

