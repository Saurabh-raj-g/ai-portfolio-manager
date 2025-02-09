'use strict';
import axios from "axios";
import Chain from "../value-objects/chain";
import { CDPWalletData, PortfolioResponse, TokenHolding } from "../types/Index";

export const useUserAsset = () => {

  const getLocalStorageKey = (chainId: string, address:string, type: 'chain'|'signature'|'wallet-cred' |'ai-recommend') => {
    if(type === 'chain') return `smartfolio-${chainId}-${address}`;
    if(type === 'signature') return `smartfolio-message-signature-${chainId}-${address}`;
    if(type === 'wallet-cred') return `cdp-wallet-creds-${chainId}-${address}`;
    if(type === 'ai-recommend') return `ai-recommend-${chainId}-${address}`;
   
    return "";
  }
  /** Fetch `cdpWalletData` from localStorage */
  const fetchCdpWalletData = (chainId:string,address:string) => {
    const data = typeof window !== 'undefined' ? window.localStorage.getItem(getLocalStorageKey(chainId,address,'wallet-cred')) : null;

    return data ? 
      JSON.parse(data)as CDPWalletData
    : null;
  };

  /** Fetch `storedChainId` from localStorage */
  const fetchStoredChainId = (chainId:string,address:string) => {
    const data = typeof window !== 'undefined' ? window.localStorage.getItem(getLocalStorageKey(chainId,address,'chain')) : null;
    const chain = data ?Chain.fromUniqueProperty<Chain>("chainId", data) : null;
    return chain;
  }; 

  /** Fetch `signature` from localStorage */
  const fetchSignature = (chainId:string,address:string) => {
    const data = typeof window !== 'undefined' ?  window.localStorage.getItem(getLocalStorageKey(chainId,address,'signature')) : null;

    return data ? data : null;
  };

  const fetchAiRecommendationsLocal = (chainId:string,address:string) => {

    const data =  typeof window !== 'undefined' ? window.localStorage.getItem(getLocalStorageKey(chainId,address,'ai-recommend')) : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data ? JSON.parse(data) as {[key:number]:any} : null;
  }

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

  /** Get AI Risk and Rescommedations of user Assets */
  const getAiRiskRecommendations = async (address:string, signature:string, chain:Chain, cdpWalletData:CDPWalletData) => {
    if (chain.isUnknown() || !chain.isBase()) {
      return {};
    }
    
    try {
      const {latestLocalData, lastTimeStamp} = getLatestAiRecommendationsLocal(chain.getChainId()+"",address);
      const currentTimeStamp = Date.now();

      if(latestLocalData && lastTimeStamp && (currentTimeStamp - lastTimeStamp) < 1800000) {
        return fetchAiRecommendationsLocal(chain.getChainId()+"",address);
      }
     
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axios.post<{data:{data:any}}>(`/api/risk-recommendation`, {
        address,
        signature,
        chain: chain.getChainId(),
        cdpWalletId: cdpWalletData.walletId,
        cdpSeed: cdpWalletData.seed,
        cdpNetworkId: cdpWalletData.networkId
      });

      if(response.data.data) {
        const localAiRecommendations = fetchAiRecommendationsLocal(chain.getChainId()+"",address);
        if(localAiRecommendations) {
          const newLocalData = {...localAiRecommendations, [currentTimeStamp]: response.data.data};
          if(typeof window !== 'undefined') window.localStorage.setItem(getLocalStorageKey(chain.getChainId()+"",address,'ai-recommend'), JSON.stringify(newLocalData));
          return newLocalData;
        }else{
          const newLocalData = {[currentTimeStamp]: response.data.data};
          if(typeof window !== 'undefined') window.localStorage.setItem(getLocalStorageKey(chain.getChainId()+"",address,'ai-recommend'), JSON.stringify(newLocalData));
          return newLocalData;
        }
      }
      return {};
    } catch (error) {
      console.error("Error fetching portfolio assets:", axios.isAxiosError(error) ? error.response?.data.message : error);
      return {};
    }
  };

  const getLatestAiRecommendationsLocal = (chainId:string,address:string) => {
    const localAiRecommendations = fetchAiRecommendationsLocal(chainId,address);
    
    if(!localAiRecommendations) {
      return {lastTimeStamp: null, latestLocalData: null};
    }
    // descending order[0]
    const lastTimeStamp:number = (localAiRecommendations ? Object.keys(localAiRecommendations)[Object.keys(localAiRecommendations).length-1]: null ) as unknown as  number;
     
    const latestLocalData = lastTimeStamp ? localAiRecommendations[lastTimeStamp] : null;
    
    return {lastTimeStamp, latestLocalData};
  }

  const sendCommandToAiAgent = async (userMessage:string ,address:string, signature:string, chain:Chain, cdpWalletData:CDPWalletData) => {
    if (chain.isUnknown() || !userMessage ||!chain.isBase()) {
      throw new Error("only base chain is supported");
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axios.post<{data:{data:any}}>(`/api/agent`, {
        address,
        signature,
        chain: chain.getChainId(),
        cdpWalletId: cdpWalletData.walletId,
        cdpSeed: cdpWalletData.seed,
        cdpNetworkId: cdpWalletData.networkId,
        userInput: userMessage
      });
      
      return response.data.data;
    } catch (error) {
      console.error("Error fetching portfolio assets:", axios.isAxiosError(error) ? error.response?.data.message : error);
      return {};
    }
  };
  return { 
    getPortfolioAssets, 
    getLocalStorageKey,
    fetchCdpWalletData,
    fetchSignature, 
    fetchStoredChainId, 
    getAiRiskRecommendations, 
    sendCommandToAiAgent,
    fetchAiRecommendationsLocal,
    getLatestAiRecommendationsLocal,
  };
};
