'use client';
import { motion } from 'framer-motion';
import { TokenHolding } from "@/app/types/Index";
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useUserAsset } from '@/app/hooks/user-asset';
import { formatAddress } from '../utils/helper';
import { useApplicationState } from '../providers/application-state-provider';

export default function PortfolioOverview() {
  const { address, chainId } = useAccount();
  const [assetData, setAssetData] = useState<{ tokens: TokenHolding[]; cdpwalletAddress: string | null }>({
    tokens: [],
    cdpwalletAddress: null
  });
  const [copied, setCopied] = useState(false);
  const { getPortfolioAssets, fetchCdpWalletData, fetchSignature, fetchStoredChainId } = useUserAsset();
  const {isLocalStorageChanged, setTokenHoldings} = useApplicationState();

  const totalPortfolioValue = useMemo(() => {
    return assetData.tokens.reduce((total, asset) => {
      const price = asset.usdPrice !== null && asset.usdPrice !== undefined ? parseFloat(asset.usdPrice + "") : 0;
      return total + (price*parseFloat(asset.balance));
    }, 0);
  }, [assetData]);

  const copyToClipboard = () => {
    const textToCopy = assetData.cdpwalletAddress || "";
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      if (address) {
        const cdpWalletData = fetchCdpWalletData(chainId+"",address);
        const signature = fetchSignature(chainId+"",address);
        const storedChain = fetchStoredChainId(chainId+"",address);
        if(!cdpWalletData || !signature || !storedChain) {
          setAssetData({ tokens: [], cdpwalletAddress: null });
          setTokenHoldings([]);
          return;
        }
        try {
          const data = await getPortfolioAssets(address, signature, storedChain, cdpWalletData);
          const filteredData = data.tokens.filter((token) => parseFloat(token.balance) > 0);
          data.tokens = filteredData;
          if (JSON.stringify(assetData) !== JSON.stringify(data)) {
            setAssetData(data);
            setTokenHoldings(data.tokens);
          }
        } catch (error) {
          console.error("Error fetching portfolio:", error);
        }
      }
    };

    fetchAssets();
  }, [fetchSignature, address, fetchCdpWalletData, chainId, getPortfolioAssets, fetchStoredChainId, assetData, isLocalStorageChanged, setTokenHoldings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-8 rounded-xl shadow-2xl mb-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Portfolio Overview</h2>
        <div className="flex items-center space-x-2">
          <div className="text-gray-500">Smart Address:</div>
          <div
            className={`cursor-pointer ${copied ? 'text-green-500' : 'text-gray-500'} hover:text-white transition`}
            onClick={copyToClipboard}
          >
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
        <p className="text-4xl font-bold">${totalPortfolioValue?.toLocaleString() ?? 0}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assetData.tokens.length > 0 ? (
          assetData.tokens.map((asset, index) => (
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
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-300 p-4 rounded-lg container mx-auto flex justify-center items-center w-1/2"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800">No assets deposited yet?</h3>
              <p className="text-sm font-semibold text-gray-500">
                Copy your smart address and deposit your funds. SmartFolio will manage the rest.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
