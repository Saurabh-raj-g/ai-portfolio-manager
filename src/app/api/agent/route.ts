import { NextRequest, NextResponse } from "next/server";
// import { initializeAgent, runChatMode } from "@/app/ai-agent/agentkit";

export async function POST(req: NextRequest) {
  try {
    const { userInput } = (await req.json()) as {
      userInput: string;
    };
    if(!userInput) {
      throw new Error("Invalid input");
    }
    // const {agent, config} = await initializeAgent();
    // await runChatMode(agent, config, userInput);
    
    return NextResponse.json({ data: "todo"}, { status: 200 });
    //return NextResponse.json({ message: "let's check what happend 😂" }, { status: 200 });
  } catch (error: unknown) {

    return NextResponse.json(
      { message: (error as {message:string})?.message ?? error },
      { status: (error as {status:number})?.status ?? 500 },
    );
  }
}

