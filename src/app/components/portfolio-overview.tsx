'use client';
import { motion } from 'framer-motion';
import {TokenHolding } from "@/app/types/Index";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useUserAsset } from '@/app/hooks/user-asset';
import { tokenHoldings } from '../page';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PortfolioOverview() {
  const {isConnected, address} =  useAccount();
  const [assets, setAssets] = useState<TokenHolding[]>(tokenHoldings);
  const { getPortofiloAssets } = useUserAsset();

  const totalPortfolioValue = useMemo(() => {
    return assets.reduce((total, asset) => {
      return total + parseFloat(asset.usdPrice + "") ;
    }, 0);
  },[assets]);

  // Memoize the function to prevent infinite loops
  const fetchAssets = useCallback(async () => {
    try {
      const data = await getPortofiloAssets();
      if (data.length > 0) {
        setAssets((prevAssets) => {
          // Prevent unnecessary re-renders if the data is the same
          if (JSON.stringify(prevAssets) !== JSON.stringify(data)) {
            return data;
          }
          return prevAssets;
        });
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  }, [getPortofiloAssets]);

  // Fetch portfolio assets when the user connects
  useEffect(() => {
    if (isConnected && address) {
      fetchAssets();
    }
  }, [isConnected, address, fetchAssets]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-8 rounded-xl shadow-2xl mb-4"
    >
      <h2 className="text-3xl font-bold mb-6">Portfolio Overview</h2>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 p-6 rounded-lg mb-6"
      >
        <p className="text-xl">Total Portfolio Value</p>
        <p className="text-4xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{asset.name}</h3>
              <span className="text-sm bg-indigo-600 px-2 py-1 rounded">
                {asset.symbol}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {asset.balance} {asset.symbol}
            </p>
            <p className="text-green-400">${asset.usdPrice?.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
