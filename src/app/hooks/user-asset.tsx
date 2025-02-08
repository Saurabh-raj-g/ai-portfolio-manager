import axios from "axios";
import Chain from "../value-objects/chain";
import { CDPWalletData, PortfolioResponse, TokenHolding } from "../types/Index";

export const useUserAsset = () => {

  const getLocalStorageKey = (chainId: string, address:string, type: 'chain'|'signature'|'wallet-cred') => {
    if(type === 'chain') return `smartfolio-${chainId}-${address}`;
    if(type === 'signature') return `smartfolio-message-signature-${chainId}-${address}`;
    if(type === 'wallet-cred') return `cdp-wallet-creds-${chainId}-${address}`;
   
    return "";
  }
  /** Fetch `cdpWalletData` from localStorage */
  const fetchCdpWalletData = (chainId:string,address:string) => {
    const data = localStorage.getItem(getLocalStorageKey(chainId,address,'wallet-cred'));

    return data ? 
      JSON.parse(data)as CDPWalletData
    : null;
  };

  /** Fetch `storedChainId` from localStorage */
  const fetchStoredChainId = (chainId:string,address:string) => {
    const data = localStorage.getItem(getLocalStorageKey(chainId,address,'chain'));
    const chain = data ?Chain.fromUniqueProperty<Chain>("chainId", data) : null;
    return chain;
  }; 

  /** Fetch `signature` from localStorage */
  const fetchSignature = (chainId:string,address:string) => {
    const data = localStorage.getItem(getLocalStorageKey(chainId,address,'signature'));

    return data ? data : null;
  };

  /** Fetch Portfolio Assets */
  const getPortfolioAssets = async (address:string, signature:string, chain:Chain, cdpWalletData:CDPWalletData) => {
    if (chain.isUnknown()) {
      return { tokens: [] as TokenHolding[], cdpwalletAddress: null };
    }

    try {
      const response = await axios.post<PortfolioResponse>(`/api/tokens-by-address`, {
        address,
        signature,
        chain: chain.getChainId(),
        cdpWalletId: cdpWalletData.walletId,
        cdpSeed: cdpWalletData.seed,
        cdpNetworkId: cdpWalletData.networkId
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching portfolio assets:", axios.isAxiosError(error) ? error.response?.data.message : error);
      return { tokens: [] as TokenHolding[], cdpwalletAddress: null };
    }
  };

  return { getPortfolioAssets, getLocalStorageKey,fetchCdpWalletData,fetchSignature, fetchStoredChainId };
};
