import { creatCDPWallet } from "@/app/ai-agent/cdpWalletProvider";
import Chain from "@/app/value-objects/chain";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { address, signature, chain } = (await req.json()) as {
      address: string;
      signature: string;
      chain: string;
    };

    if(!address) {
      throw new Error("address is required");
    }
    if(!signature) {
      throw new Error("signature is required");
    }

    if(!chain) {
      throw new Error("chain is required");
    }
    const chainObject = Chain.fromUniqueProperty<Chain>("chainId", chain);

    if(chainObject.isUnknown()) {
      throw new Error("chain is not supported");
    };

    await creatCDPWallet({ address, signature, chain:chainObject });
    
    return NextResponse.json({ message: "cdp wallet created"}, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as {message:string})?.message ?? error },
      { status: (error as {status:number})?.status ?? 500 },
    );
  }
}

