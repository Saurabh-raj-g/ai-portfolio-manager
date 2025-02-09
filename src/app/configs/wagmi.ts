// import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { base, baseSepolia} from "wagmi/chains";

// export const config = getDefaultConfig({
//   appName: "ai-portfolio-manager",
//   projectId: "_", //needed when using walletConnect button
//   chains: [
//     base,
//     baseSepolia,
//   ],
//   ssr: true,
// });


// 'use client';

// import { http, createStorage, cookieStorage } from 'wagmi'
// import { base } from 'wagmi/chains'
// import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit'

// const projectId = '-';

// const supportedChains: Chain[] = [base];

// export const config = getDefaultConfig({
//    appName: 'WalletConnection',
//    projectId,
//    // eslint-disable-next-line @typescript-eslint/no-explicit-any
//    chains: supportedChains as any,
//    ssr: false,
//    storage: createStorage({
//     storage: cookieStorage,
//    }),
//   transports: supportedChains.reduce((obj, chain) => ({ ...obj, [chain.id]: http() }), {})
//  });


import { http, createConfig, cookieStorage,
   createStorage } from 'wagmi'
import { base } from 'wagmi/chains'

export function getConfig() { 
   return createConfig({
      chains: [base],
      ssr: true,
      storage: createStorage({
            storage: cookieStorage,
         }),
      transports: {
         [base.id]: http(),
         //  [baseSepolia.id]: http(),
      },
   });
}
