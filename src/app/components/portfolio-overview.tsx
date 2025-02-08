'use client';
import { motion } from 'framer-motion';
import {TokenHolding } from "@/app/types/Index";
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useUserAsset } from '@/app/hooks/user-asset';
import { formatAddress } from '../utils/helper';


export default function PortfolioOverview() {
  const {isConnected, address} =  useAccount();
  const [assetData, setAssetData] = useState<{tokens:TokenHolding[]; cdpwalletAddress:string|null}>({tokens:[], cdpwalletAddress:null});
  const [copied, setCopied] = useState(false);
  const { getPortofiloAssets, cdpWalletData } = useUserAsset();

  const totalPortfolioValue = useMemo(() => {
    return assetData.tokens?.reduce((total, asset) => {
      return total + (asset.usdPrice === null || asset.usdPrice === undefined ? 0: parseFloat(asset.usdPrice + ""));
    }, 0);
  },[assetData]);

  // Copy total value to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(assetData.cdpwalletAddress || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset after 1.5 seconds
  };

  // Fetch portfolio assets when cdpWalletData is updated
  useEffect(() => {
    const fetchAssets = async () => {
      if (isConnected && address && cdpWalletData) {
        try {
          const data = await getPortofiloAssets();
          if (data.tokens.length > 0) {
            setAssetData(prevAssetData => {
              // Prevent unnecessary updates
              if (JSON.stringify(prevAssetData) !== JSON.stringify(data)) {
                return data;
              }
              return prevAssetData;
            });
          }
        } catch (error) {
          console.error("Error fetching portfolio:", error);
        }
      }
    };

    fetchAssets();
  }, [isConnected, address, cdpWalletData, getPortofiloAssets]); // Ensure re-fetching when dependencies change



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-8 rounded-xl shadow-2xl mb-4"
    >
      <div className="flex justify-between items-center self-stretch mb-6">
        <h2 className="text-3xl font-bold">Portfolio Overview</h2>
        <div className='flex'>
          <div className='text-gray-500'>Smart Address:</div>
          <div className={`hover:cursor-pointer hover:text-white transition-colors duration-200 ${copied ? 'text-green-500' : 'text-gray-500'}`} 
           onClick={copyToClipboard}>
            {formatAddress(assetData.cdpwalletAddress)}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/10 p-6 rounded-lg mb-6"
      >
        <p className="text-xl">Total Portfolio Value</p>
        <p className="text-4xl font-bold">${totalPortfolioValue?.toLocaleString()?? 0}</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assetData.tokens.map((asset, index) => (
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
      {
        assetData.tokens.length === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-300 p-4 rounded-lg container mx-auto flex justify-center items-center w-1/2"
          >
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold text-gray-800">No assets deposited yet?</h3>
              <h4 className='text-sm font-semibold text-gray-500'>copy your smart address and deposite your fund from your wallet based on your risk.</h4>
              <h4 className='text-sm font-semibold text-gray-500'>rest will do your SmartFolio{"(your ai-agent)"}</h4>
            </div>
          </motion.div>
        )
      }
    </motion.div>
  );
}
