import Chain from "@/app/value-objects/chain";
import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "./get-tokens";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address") as string;
    const signature = req.nextUrl.searchParams.get("signature") as string;
    const chain = req.nextUrl.searchParams.get("chain") as string;

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

    if(!chainObject.isUnknown()) {
      throw new Error("chain is not supported");
    };

    const tokens = await getTokens(address, signature, chainObject);
    
    return NextResponse.json({ data: tokens}, { status: 200 });

  } catch (error: unknown) {
    return NextResponse.json(
      { message: (error as {message:string})?.message ?? error },
      { status: (error as {status:number})?.status ?? 500 },
    );
  }
}

