// components/Header.tsx
import React, { useMemo } from 'react';
import Link from 'next/link';
import { ConnectWallet } from '@/app/components/buttons/connect-wallet';
import { useAccount } from 'wagmi';
import { getSignMessage } from '../web3/sign-message-generator';
import { signMessage } from "@wagmi/core";
import { config } from '../configs/wagmi';
import axios from 'axios';
import Chain from '../value-objects/chain';

const Header: React.FC = () => {
  const { address, isConnected, chainId } = useAccount();

  useMemo(async() => {
    try{
      if (isConnected && chainId && address) {
        const storedChainId = localStorage.getItem(`smartfolio-${chainId}-${address}`) as string;
        const storedSignature = localStorage.getItem(`smartfolio-message-signature-${chainId}-${address}`) as string;
        console.log("chainId head", chainId);  
        if(!storedChainId || !storedSignature){
          // clear the local storage first
          localStorage.removeItem(`smartfolio-${chainId}-${address}`);
          localStorage.removeItem(`smartfolio-message-signature-${chainId}-${address}`);
  
          const chainObj = Chain.fromUniqueProperty<Chain>("chainId", chainId);
  
          if(chainObj.isUnknown()){
            alert(`chain is not supported! supported chains are ${Chain.getResourceArray().map((chain) => chain.name).join(", ")}`);
            return;
          }
          // signature message
          const messgae = getSignMessage();
          const signature = await signMessage(config, {
            message: messgae,
          });
  
          const response = await axios.post<{message:string}>("/api/create-cdp-wallet-if-required", {
            address,
            signature,
            chain: chainId,
          });
  
          if(response.status === 200){
            localStorage.setItem(`smartfolio-${chainId}-${address}`, chainId+'');
            localStorage.setItem(`smartfolio-message-signature-${chainId}-${address}`, signature);
          }
          
        }
      }
    }catch(error){
      let message = ''
      if (axios.isAxiosError(error)) {
        message = error.response?.data.message || 'something went wrong'
      } else {
        message = (error as {message:string})?.message || 'something went wrong'
      }
      console.error(message);
    }
    
  }, [isConnected, address, chainId]);

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
