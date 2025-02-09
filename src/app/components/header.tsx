import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConnectWallet } from '@/app/components/buttons/connect-wallet';
import { useAccount } from 'wagmi';
import { getSignMessage } from '../web3/sign-message-generator';
import { signMessage } from "@wagmi/core";
import { config } from '../configs/wagmi';
import axios from 'axios';
import Chain from '../value-objects/chain';
import { useUserAsset } from '../hooks/user-asset';
import { useApplicationState } from '../providers/application-state-provider';
import { CDPWalletData } from '../types/Index';
import { ButtonOutline } from './buttons/button-outline';

const Header: React.FC = () => {
  const { address, chainId } = useAccount();
  const {getPortfolioAssets, sendCommandToAiAgent ,getLocalStorageKey, fetchCdpWalletData, fetchSignature, fetchStoredChainId, getLatestAiRecommendationsLocal} = useUserAsset();
  const {setCdpWalletAddress,setTokenHoldings,  tokenHoldings} = useApplicationState();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  
  useEffect(() => {
    const createCDPWalletIfRequired = async () => {
      if (!chainId || !address) return;
      console.log("chainId: hh", chainId);
      const chain = Chain.fromUniqueProperty<Chain>("chainId", chainId+"");
      const storedChain = fetchStoredChainId(chain.getChainId()+"", address);
      const cdpWalletData = fetchCdpWalletData(chain.getChainId()+"", address);
      const signature = fetchSignature(chain.getChainId()+"", address);

      try {
        if (!cdpWalletData) {
          const chain = Chain.fromUniqueProperty<Chain>("chainId", chainId);
          if(!chain.isBase()){
            alert("only base chain is supported");
            return;
          }
          if (chain.isUnknown()) {
            alert(`Chain not supported! Supported chains: ${Chain.getResourceArray().map((c) => c.name).join(", ")}`);
            return;
          }
          const message = getSignMessage();
          const sign = await signMessage(config, { message });

          const response = await axios.post("/api/create-cdp-wallet-if-required", {
            address,
            signature: sign,
            chain: chain.getChainId(),
          });

          if (response.status === 200) {
            localStorage.setItem(getLocalStorageKey(chain.getChainId()+"",address,'chain'), chain.getChainId()+"");
            localStorage.setItem(getLocalStorageKey(chain.getChainId()+"",address,'signature'), sign);
            localStorage.setItem(getLocalStorageKey(chain.getChainId()+"",address,'wallet-cred'), JSON.stringify(response.data.data.cdpCredsentails));
            const data = await getPortfolioAssets(address, sign, chain, response.data.data.cdpCredsentails);
            const filteredTokens = data.tokens.filter((token) => parseFloat(token.balance) > 0);

            setTokenHoldings(filteredTokens);
            setCdpWalletAddress(data.cdpwalletAddress);
          }
        } else if (!signature || !storedChain) {
          if(!chain.isBase()){
            alert("only base chain is supported");
            return;
          }
          if (chain.isUnknown()) {
            alert(`Chain not supported! Supported chains: ${Chain.getResourceArray().map((c) => c.name).join(", ")}`);
            return;
          }
          const message = getSignMessage();
          const sign = await signMessage(config, { message });
          const data = await getPortfolioAssets(address, sign, chain, cdpWalletData);
          const filteredTokens = data.tokens.filter((token) => parseFloat(token.balance) > 0);

          setTokenHoldings(filteredTokens);
          setCdpWalletAddress(data.cdpwalletAddress);
          localStorage.setItem(getLocalStorageKey(chain.getChainId()+"",address,'chain'), chain.getChainId()+"");
          localStorage.setItem(getLocalStorageKey(chain.getChainId()+"",address,'signature'), sign);
          
        }
      } catch (error) {
        console.error("Error fetching CDP wallet:", axios.isAxiosError(error) ? error.response?.data.message : error);
      }
    };

    createCDPWalletIfRequired();
  }, [address, chainId, fetchCdpWalletData, fetchSignature, fetchStoredChainId, getLocalStorageKey, getPortfolioAssets, setCdpWalletAddress, setTokenHoldings]);


  const fetchAssets = async () => {
    const chain = Chain.fromUniqueProperty<Chain>("chainId", chainId+"");
    const cdpWalletData = fetchCdpWalletData(chain.getChainId()+"", address as string);
    const signature = fetchSignature(chain.getChainId()+"", address as string);

    const data = await getPortfolioAssets(address as string, signature as string, chain, cdpWalletData!);
    const filteredTokens = data.tokens.filter((token) => parseFloat(token.balance) > 0);

    setTokenHoldings(filteredTokens);
    setCdpWalletAddress(data.cdpwalletAddress);
  };
  const handleChatIconClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
    // Handle the submit logic here
    e.preventDefault();
    if(inputText) {
      const {latestLocalData} = getLatestAiRecommendationsLocal(chainId+"", address as string);
      const storedChain = fetchStoredChainId(chainId+"", address as string);
      const cdpWalletData = fetchCdpWalletData(chainId+"", address as string);
      const signature = fetchSignature(chainId+"", address as string);
      
      if(!storedChain?.isBase()){
        alert("only base chain is supported");
        return;
      }
      if(!latestLocalData){
        alert("unable to process, please refresh");
        return;
      }
      
      const userInput ={
        message: inputText,
        takeAction: 'check my wallet data and below is the required recommendation. and then take an action provided above.',
        requiredInfo: latestLocalData
      }
      try{
        console.log("userInput", userInput);
        const data = await sendCommandToAiAgent(JSON.stringify(userInput), address as string, signature as string, storedChain, cdpWalletData as CDPWalletData);
        const portfolioData = await getPortfolioAssets(address as string, signature as string, storedChain, cdpWalletData as CDPWalletData);
        const filteredTokens = portfolioData.tokens.filter((token) => parseFloat(token.balance) > 0);

        setTokenHoldings(filteredTokens);
        setCdpWalletAddress(portfolioData.cdpwalletAddress);
        console.log(data);
        setInputText('');
        setIsModalOpen(false);
      }catch(error){
        console.error("Error in execution :", axios.isAxiosError(error) ? error.response?.data.message : error);
      }
    }
   
  };


  return (
    <> 
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={'/'} className="flex items-center">
          <h1 className="text-white text-2xl font-bold ml-4">SmartFolio</h1>
        </Link>
        {
          fetchCdpWalletData(chainId+"", address as string) && tokenHoldings.length ===0 && 
          <ButtonOutline
           onClick={fetchAssets}
          >
            fetch Assets
          </ButtonOutline>
        }
       
        <button
          onClick={handleChatIconClick}
          className={`text-white mr-4 hover:text-gray-200 transition-colors ${tokenHoldings.length >0 ? '' : 'hidden'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
       
        
        <ConnectWallet />
      </div>
    </header>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-gray-600 p-6 rounded-lg w-1/3 shadow-xl">
          <h2 className="text-xl font-bold mb-4">Chat</h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded mb-4 text-black"
            placeholder="give action to your agent..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2"
            >
              Submit
            </button>
            <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
