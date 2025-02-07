import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "ai-portfolio-manager",
  projectId: "PROJECT_ID", //needed when using walletConnect button
  chains: [
    baseSepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [baseSepolia] : []),
  ],
  ssr: true,
});
