import Chain from "@/app/value-objects/chain";
import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "./get-tokens";

export async function POST(req: NextRequest) {
  try {
    const { address, signature, chain, cdpWalletId, cdpSeed, cdpNetworkId } = (await req.json()) as {
      address: string;
      signature: string;
      chain: string;
      cdpWalletId: string;
      cdpSeed: string;
      cdpNetworkId: string;
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
    if(!cdpWalletId) {
      throw new Error("cdpWalletId is required");
    }
    if(!cdpSeed) {
      throw new Error("cdpSeed is required");
    }
    if(!cdpNetworkId) {
      throw new Error("cdpNetworkId is required");
    }
    
    const chainObject = Chain.fromUniqueProperty<Chain>("chainId", chain);

    if(chainObject.isUnknown()) {
      throw new Error("chain is not supported");
    };
    
    const cdpWalletData = {
      cdpWalletData: {
        walletId: cdpWalletId,
        seed: cdpSeed,
        networkId: cdpNetworkId
      }
    };
    const {tokens,cdpwalletAddress} = await getTokens(address, signature, chainObject, cdpWalletData);
    
    return NextResponse.json({data:{tokens,cdpwalletAddress}}, { status: 200 });

  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: (error as {message:string})?.message ?? error },
      { status: (error as {status:number})?.status ?? 500 },
    );
  }
}

