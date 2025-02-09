import {
  AgentKit,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";

import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { CDPWalletConfig, cdpWalletProvider } from "./cdpWalletProvider";
import Chain from "../value-objects/chain";
import { agentBaseInstruction } from "./agent-base-instructions";
import { dataFormatInstructions } from "./user-instructions";

/**
 * Validates that required environment variables are set
 *
 * @throws {Error} - If required environment variables are missing
 * @returns {void}
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];

  // Check required variables
  const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  // Exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach(varName => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
  }

  // Warn about optional NETWORK_ID
  if (!process.env.NEXT_PUBLIC_NETWORK_ID) {
    console.warn("Warning: NETWORK_ID not set, defaulting to base-sepolia testnet");
  }
}

// Add this right after imports and before any other code
validateEnvironment();

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
export interface InitializeAgentConfig extends CDPWalletConfig {
  address: string;
  signature: string;
  chain: Chain;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function initializeAgent({address, signature, chain, cdpWalletData}:InitializeAgentConfig): Promise<{ agent: any; config: any }> {
  try {
    // Initialize LLM
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      apiKey: process.env.OPENAI_API_KEY,
    });
   
    const walletProvider = await cdpWalletProvider({address, signature, chain, cdpWalletData})

    // Initialize AgentKit
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        pythActionProvider(),
        walletActionProvider(),
        erc20ActionProvider(),
        cdpApiActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      ],
    });
    const tools = await getLangChainTools(agentkit);

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    // Create React Agent using the LLM and CDP AgentKit tools
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `${agentBaseInstruction.agentInstructions}\n${agentBaseInstruction.tradingAgentInstructions}\n${agentBaseInstruction.riskRecommendationInstructions}`,
    });
    const pp = await walletProvider.exportWallet()
    console.log("walletProvider: ", pp)
    const wallet = walletProvider.getNetwork().networkId;
    console.log("wallet: ", wallet)
  return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

/**
 * Run the agent interactively based on user input
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runChatMode(agent: any, config: any, userInput:string) {
  console.log("Starting chat mode... Type 'exit' to end.");
  const agentReplies = [];
  try {
    const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);

    for await (const chunk of stream) {
      // if ("agent" in chunk) {
      //   console.log("agent: ", chunk.agent.messages[0].content);
      // } else if ("tools" in chunk) {
      //   console.log("tools: ", chunk.tools.messages[0].content);
      // }
      // console.log("-------------------");
      // get agent replies
      if ("tools" in chunk) {
        console.log("tools: ", chunk.tools.messages[0].content);
      }
      if ("agent" in chunk) {
        agentReplies.push(chunk.agent.messages[0].content);
      }
    }
    console.log("Chat mode ended.");
    const filteredReplies = agentReplies.filter((reply) => reply !== "" || reply !== null || reply !== undefined);
    
    const query = {
      dataFormatInstructions,
      data: filteredReplies
    };

    const stream1 = await agent.stream({ messages: [new HumanMessage(JSON.stringify(query))] }, config);

    let finalReplies = [];
    for await (const chunk of stream1) {
    
      if ("agent" in chunk) {
        finalReplies.push(chunk.agent.messages[0].content);
      }
    }
    console.log("filter ");
    finalReplies = finalReplies.filter((reply) => reply !== "" || reply !== null || reply !== undefined);

    return finalReplies;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      throw error.message;
    }
    throw error;
  } 
}
