"use client";

import "@rainbow-me/rainbowkit/styles.css";

// import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
// import { WagmiProvider } from "wagmi";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// import { config } from "@/app/configs/wagmi";

// const queryClient = new QueryClient();

// export function WalletProvider({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider
//           modalSize="compact"
//           theme={lightTheme({
//             accentColor: "#30C3B2",
//             borderRadius: "medium",
//             overlayBlur: "small",
//           })}
//         >
//           {children}
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }


// import { cookieToInitialState, WagmiProvider } from "wagmi";
// import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { config } from "@/app/configs/wagmi";

// const queryClient = new QueryClient();

// type Props = {
//   children: React.ReactNode;
//   cookie?: string | null;
// };

// export function WalletProvider({ children, cookie }: Props) {
//   const initialState = cookieToInitialState(config, cookie);
//   return (
//     <WagmiProvider config={config} initialState={initialState}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider
//           theme={darkTheme({
//             accentColor: "#0E76FD",
//             accentColorForeground: "white",
//             borderRadius: "large",
//             fontStack: "system",
//             overlayBlur: "small",
//           })}
//         >
//           {children}
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type State, WagmiProvider } from 'wagmi'
import {  getConfig } from "@/app/configs/wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  initialState: State | undefined,
};

export function WalletProvider({children, initialState}:Props) {
  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#0E76FD",
              accentColorForeground: "white",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
        { children}
        </RainbowKitProvider>
      </QueryClientProvider>
    
    </WagmiProvider>
  )
}
