import { RISK_RECOMMENDATION_COMMAND } from "@/app/ai-agent/action-commands";
import { initializeAgent, runChatMode } from "@/app/ai-agent/agentkit";
import { CDPWalletConfig, cdpWalletProvider } from "@/app/ai-agent/cdpWalletProvider";
import { instructionToAgentByUser } from "@/app/ai-agent/user-instructions";
import Chain from "@/app/value-objects/chain";
import { getTokenHoldings } from "@/app/web3/moralis";
import { verifyUser } from "@/app/web3/verify-user";

export async function getRiskAndRecommendation(address: string, signature: string, chain: Chain, cdpWalletData: CDPWalletConfig) {
  
  verifyUser({ address, signature, chain });
  
  const wallet = await cdpWalletProvider({ address, signature, chain, cdpWalletData: cdpWalletData.cdpWalletData });
  
  const {agent, config} = await initializeAgent({address, signature, chain, cdpWalletData: cdpWalletData.cdpWalletData});
  
  const tokens = await getTokenHoldings(wallet);

  const assets = tokens.map(token => {
    return {
      "symbol": token.symbol,
      "balance": token.balance
    }
  })
  assets.every(asset => {
    console.log(asset);
  });
  
  const userQuery = {
    ...instructionToAgentByUser, // Include user-specific instructions
    wallet_assets: assets,
    action: RISK_RECOMMENDATION_COMMAND, // Command to trigger risk analysis
    "strictly-output-format": "output should be only in json format"
  };
  const data = await runChatMode(agent, config,JSON.stringify(userQuery));

  return data;
}
