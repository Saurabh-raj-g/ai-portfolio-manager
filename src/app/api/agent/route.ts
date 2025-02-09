import { NextRequest, NextResponse } from "next/server";
import { initializeAgent, runChatMode } from "@/app/ai-agent/agentkit";
import Chain from "@/app/value-objects/chain";

export async function POST(req: NextRequest) {
  try {
    const { 
      userInput,  
      address, 
      signature, 
      chain, 
      cdpWalletId, 
      cdpSeed, 
      cdpNetworkId
    } = (await req.json()) as {
      userInput: string;
      address: string;
      signature: string;
      chain: string;
      cdpWalletId: string;
      cdpSeed: string;
      cdpNetworkId: string;
    };
    const chainObj = Chain.fromUniqueProperty<Chain>("chainId", chain);

    if(chainObj.isUnknown()) {
      throw new Error("Invalid chain");
    }
    if(!userInput || !address || !signature|| !cdpWalletId || !cdpSeed || !cdpNetworkId) {
      throw new Error("Invalid input");
    }

    const cdpWalletData = {
      walletId: cdpWalletId,
      seed: cdpSeed,
      networkId: cdpNetworkId,
    }

    const {agent, config} = await initializeAgent({address, signature, chain: chainObj, cdpWalletData});
    
    const data = await runChatMode(agent, config, userInput);
    
    return NextResponse.json({ data}, { status: 200 });
    
  } catch (error: unknown) {

    return NextResponse.json(
      { message: (error as {message:string})?.message ?? error },
      { status: (error as {status:number})?.status ?? 500 },
    );
  }
}

