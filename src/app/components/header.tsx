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
import { useUserAsset } from '../hooks/user-asset';

const Header: React.FC = () => {
  const { address, isConnected, chainId } = useAccount();
  const {cdpWalletData, signature,storedChain} = useUserAsset();

  useMemo(async() => {
    try{
      if (isConnected && chainId && address) {
        if(!cdpWalletData){
          const chain = Chain.fromUniqueProperty<Chain>("chainId", chainId);
          if(chain.isUnknown()){
            alert(`chain is not supported! supported chains are ${Chain.getResourceArray().map((chain) => chain.name).join(", ")}`);
            return;
          }

          // signature message
          const messgae = getSignMessage();
          const sign = await signMessage(config, {
            message: messgae,
          });
  
          const response = await axios.
          post<
            {
              data: 
              {
                cdpwalletAddress: string;
                cdpCredsentails: {
                  walletId: string;
                  seed: string;
                  networkId: string;
                }
              }
            }
          >("/api/create-cdp-wallet-if-required", {
            address,
            signature: sign,
            chain: chainId,
          });
  
          if(response.status === 200){
            localStorage.setItem(`smartfolio-${chainId}-${address}`, chainId+'');
            localStorage.setItem(`smartfolio-message-signature-${chainId}-${address}`, sign);
            localStorage.setItem(`cdp-wallet-creds-${chainId}-${address}`, JSON.stringify(response.data.data.cdpCredsentails));
          }

      }else if(!signature || !storedChain){
          // signature message
          const messgae = getSignMessage();
          const sign = await signMessage(config, {
            message: messgae,
          });

          localStorage.setItem(`smartfolio-${chainId}-${address}`, chainId+'');
          localStorage.setItem(`smartfolio-message-signature-${chainId}-${address}`, sign);
        
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
    
  }, [isConnected, address, chainId, cdpWalletData, signature, storedChain]);

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
