import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "ai-portfolio-manager",
  projectId: "PROJECT_ID", //needed when using walletConnect button
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});
