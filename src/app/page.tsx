'use client';

import { useEffect, useState } from 'react';
import PortfolioOverview from './components/portfolio-overview';
import AIRecommendations from './components/ai-recommendations';
import TransactionInterface from './components/transaction-interface';
import { useAccount } from 'wagmi';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { BalanceData, Position } from '@/app/types';
import WalletNotConnectedPage from '@/app/components/wallte-not-connected';
import getBalanceData from './utils/token_balance';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [portfolio, setPortfolio] = useState<Position[]>([]);
  const [balanceData, setBalanceData] = useState<BalanceData>({ ethBalance: '0', tokens: [] });
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      getBalanceData(address).then((data) => {
        setBalanceData(data);
      });
    }
  }, [address]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow text-blue-600">
        {address ? (
          <div className="container mx-auto px-4 py-8">
            <PortfolioOverview portfolio={portfolio} balance={balanceData} />
            <AIRecommendations portfolio={portfolio} />
            {/* <TransactionInterface account={address} /> */}
          </div>
        ) : (
          <WalletNotConnectedPage />
        )}
      </main>
      <Footer />
    </div>
  );
}
