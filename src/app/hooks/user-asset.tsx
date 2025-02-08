import axios from "axios";
import { useCallback, useEffect, useState} from "react";
import { useAccount } from "wagmi";
import Chain from "../value-objects/chain";
import { PortfolioResponse, TokenHolding } from "../types/Index";

export const useUserAsset = () => {
  const {isConnected, address, chainId} =  useAccount();
  const [cdpWalletData, setCdpWalletData] = useState<{ walletId: string; seed: string; networkId: string } | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [storedChain, setStoredChain] = useState<Chain | null>(null);

  // Function to fetch `cdpWalletData` from localStorage
  const fetchCdpWalletData = useCallback(() => {
    const data = localStorage.getItem(`cdp-wallet-creds-${chainId}-${address}`);
    if (!data) {
      setCdpWalletData(null);
    } else {
      setCdpWalletData(JSON.parse(data));
    }
  }, [chainId, address]);

  // Function to fetch `storedChainId` from localStorage
  const fetchStoredChainId = useCallback(() => {
    const storedChainId = localStorage.getItem(`smartfolio-${chainId}-${address}`);
    if (!storedChainId) {
      setStoredChain(null);
    } else {
      const chain = Chain.fromUniqueProperty<Chain>("chainId", storedChainId);
      setStoredChain(chain);
    }
  }, [chainId, address]);

  // Function to fetch `storedChainId` from localStorage
  const fetchSignature = useCallback(() => {
    const signature = localStorage.getItem(`smartfolio-message-signature-${chainId}-${address}`);
    if (!signature) {
      setSignature(null);
    } else {
      setSignature(signature);
    }
  }, [chainId, address]);

  // Listen for changes in localStorage
  useEffect(() => {
    fetchCdpWalletData(); // Initial fetch

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `cdp-wallet-creds-${chainId}-${address}`) {
        fetchCdpWalletData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchCdpWalletData, chainId, address]);

  // Listen for changes in localStorage
  useEffect(() => {
    fetchStoredChainId(); // Initial fetch

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `smartfolio-${chainId}-${address}`) {
        fetchStoredChainId();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchStoredChainId, chainId, address]);

  // Listen for changes in localStorage
  useEffect(() => {
    fetchSignature(); // Initial fetch

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `smartfolio-message-signature-${chainId}-${address}`) {
        fetchSignature();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchSignature, chainId, address]);


  const getPortofiloAssets = useCallback(async() => {

    if(!isConnected || !address || !signature || storedChain?.isUnknown() || !cdpWalletData){
      return {
        tokens: [] as TokenHolding[],
        cdpwalletAddress: null,
      };
    }
    
    try{
      const response = await axios.post<PortfolioResponse>(`/api/tokens-by-address`, {
          address,
          signature,
          chain: storedChain?.getChainId(),
          cdpWalletId: cdpWalletData.walletId,
          cdpSeed: cdpWalletData.seed,
          cdpNetworkId: cdpWalletData.networkId
        }
      )
      return response.data.data;
      
    }catch(error){
      let message = ''
      if (axios.isAxiosError(error)) {
        message = error.response?.data.message || 'something went wrong'
      } else {
        message = (error as {message:string})?.message || 'something went wrong'
      }
      console.error(message);
      return {
        tokens: [] as TokenHolding[],
        cdpwalletAddress: null,
      };
    }
    

  }, [isConnected, address, signature, storedChain, cdpWalletData]);

  return { getPortofiloAssets, signature, storedChain, cdpWalletData };
};
