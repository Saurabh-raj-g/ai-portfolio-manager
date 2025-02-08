'use client';
import { useState} from 'react';
import PortfolioOverview from './components/portfolio-overview';
import AIRecommendations from './components/ai-recommendations';
import TransactionInterface from './components/transaction-interface';
import { useAccount } from 'wagmi';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import {TokenHolding } from '@/app/types/Index';
import WalletNotConnectedPage from '@/app/components/wallte-not-connected';

export const tokenHoldings: TokenHolding[] = [
  {
    tokenAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    balance: "10",
    decimals: 18,
    symbol: "DAI",
    name: "Dai Stablecoin",
    usdPrice: 1.00
  },
  {
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    balance: "500",
    decimals: 6,
    symbol: "USDC",
    name: "USD Coin",
    usdPrice: 48.00
  },
  {
    tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    balance: "25000",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
    usdPrice: 2250.75
  }
];

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [portfolio, setPortfolio] = useState<TokenHolding[]>([]);
  const { address } = useAccount();
 
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {address ? (
          <div className="container mx-auto px-4 py-8">
            <PortfolioOverview />
            <AIRecommendations portfolio={portfolio} />
            <TransactionInterface account={address} />
          </div>
        ) : (
          <WalletNotConnectedPage />
        )}
      </main>
      <Footer />
    </div>
  );
}
