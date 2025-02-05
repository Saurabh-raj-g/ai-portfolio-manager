'use client';
import { useState} from 'react';
import PortfolioOverview from './components/portfolio-overview';
import AIRecommendations from './components/ai-recommendations';
import TransactionInterface from './components/transaction-interface';
import { useAccount } from 'wagmi';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { Position } from '@/app/types/Index';
import WalletNotConnectedPage from '@/app/components/wallte-not-connected';

export default function Home() {
  const [portfolio, setPortfolio] = useState<Position[]>([]);
  const { address } = useAccount();
 
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {address ? (
          <div className="container mx-auto px-4 py-8">
            <PortfolioOverview portfolio={portfolio} />
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
