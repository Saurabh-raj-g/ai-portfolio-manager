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
      messageModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
        faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
        funds from the user. Before executing your first action, get the wallet details to see what network 
        you're on. only work on network ID 'base-sepolia'.  If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, say i can't do. If you have confusion or got ambiguous input from user then always clearify and then execute. Be concise and helpful with your responses. Refrain from 
        restating your tools' descriptions unless it is explicitly requested.
        `,
    });

    // Save wallet data
    const walletAddress =  walletProvider.getAddress();
    console.log("Wallet Address:", walletAddress);
    const balance = await walletProvider.getBalance();
    console.log("Wallet Balance:", balance);
    
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

 
  try {
    const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        console.log("agent: ", chunk.agent.messages[0].content);
      } else if ("tools" in chunk) {
        console.log("tools: ", chunk.tools.messages[0].content);
      }
      console.log("-------------------");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      throw error.message;
    }
    throw error;
  } 
}
