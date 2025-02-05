// components/Header.tsx
import React from 'react';
import Link from 'next/link';
import { ConnectWallet } from '@/app/components/buttons/connect-wallet';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={'/'} className="flex items-center">
          <h1 className="text-white text-2xl font-bold ml-4">AI-Driven DeFi Vista</h1>
        </Link>
        <ConnectWallet />
      </div>
    </header>
  );
};

export default Header;
