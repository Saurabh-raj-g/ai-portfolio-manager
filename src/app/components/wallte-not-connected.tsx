// components/NotConnectedPage.tsx
import React from 'react';
import { motion } from 'framer-motion';

const WalletNotConnectedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4 overflow-hidden">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <motion.path
            d="M60 10 L110 40 L110 80 L60 110 L10 80 L10 40 Z"
            fill="none"
            stroke="white"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.circle
            cx="60"
            cy="60"
            r="30"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          />
        </svg>
      </motion.div>
      
      <motion.h1
        className="text-4xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Welcome to AI-Driven DeFi Vista
      </motion.h1>
      
      <motion.p
        className="text-xl mb-8 text-center max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Unlock the power of AI-driven portfolio management and optimize your DeFi investments across 20+ blockchains.
      </motion.p>
      
      <motion.div
        className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-filter backdrop-blur-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">To get started:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click the <b>{"connect wallet"}</b> button in the top right corner</li>
          <li>Choose your preferred wallet (MetaMask, WalletConnect, etc.)</li>
          <li>Approve the connection request in your wallet</li>
        </ol>
      </motion.div>
      
      <motion.div
        className="mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-t-4 border-blue-200 border-solid rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
};

export default WalletNotConnectedPage;
