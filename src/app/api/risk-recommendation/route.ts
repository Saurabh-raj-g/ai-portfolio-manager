import { NextRequest, NextResponse } from "next/server";
import Chain from "@/app/value-objects/chain";
import { getRiskAndRecommendation } from "./get-risk-recommendation";

export async function POST(req: NextRequest) {
  try {
    const { 
      address, 
      signature, 
      chain, 
      cdpWalletId, 
      cdpSeed, 
      cdpNetworkId
    } = (await req.json()) as {
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
    if(!address || !signature || !cdpWalletId || !cdpSeed || !cdpNetworkId) {
      throw new Error("Invalid input");
    }

    const cdpWalletData = {
      walletId: cdpWalletId,
      seed: cdpSeed,
      networkId: cdpNetworkId,
    }
    
    const data = await getRiskAndRecommendation(address, signature, chainObj, {cdpWalletData});
    return NextResponse.json({ data}, { status: 200 });
  } catch (error: unknown) {

    return NextResponse.json(
      { message: (error as {message:string})?.message ?? error },
      { status: (error as {status:number})?.status ?? 500 },
    );
  }
}

