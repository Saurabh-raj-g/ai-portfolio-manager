import React, { useEffect } from 'react';
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

const Header: React.FC = () => {
  const { address, chainId } = useAccount();
  const { getLocalStorageKey, fetchCdpWalletData, fetchSignature, fetchStoredChainId } = useUserAsset();
  const {setLocalStorageState} = useApplicationState();

  useEffect(() => {
    const createCDPWalletIfRequired = async () => {
      if (!chainId || !address) return;

      const storedChain = fetchStoredChainId(chainId+"", address);
      const cdpWalletData = fetchCdpWalletData(chainId+"", address);
      const signature = fetchSignature(chainId+"", address);

      try {
        if (!cdpWalletData) {
          const chain = Chain.fromUniqueProperty<Chain>("chainId", chainId);
          if (chain.isUnknown()) {
            alert(`Chain not supported! Supported chains: ${Chain.getResourceArray().map((c) => c.name).join(", ")}`);
            return;
          }

          const message = getSignMessage();
          const sign = await signMessage(config, { message });

          const response = await axios.post("/api/create-cdp-wallet-if-required", {
            address,
            signature: sign,
            chain: chainId,
          });

          if (response.status === 200) {
            localStorage.setItem(getLocalStorageKey(chainId+"",address,'chain'), chainId+"");
            localStorage.setItem(getLocalStorageKey(chainId+"",address,'signature'), sign);
            localStorage.setItem(getLocalStorageKey(chainId+"",address,'wallet-cred'), JSON.stringify(response.data.data.cdpCredsentails));
            setLocalStorageState(true);
          }
        } else if (!signature || !storedChain) {
          const message = getSignMessage();
          const sign = await signMessage(config, { message });
          localStorage.setItem(getLocalStorageKey(chainId+"",address,'chain'), chainId+"");
          localStorage.setItem(getLocalStorageKey(chainId+"",address,'signature'), sign);
          setLocalStorageState(true);
        }
      } catch (error) {
        console.error("Error fetching CDP wallet:", axios.isAxiosError(error) ? error.response?.data.message : error);
      }
    };

    createCDPWalletIfRequired();
  }, [address, chainId, fetchCdpWalletData, fetchSignature, fetchStoredChainId, getLocalStorageKey, setLocalStorageState]);

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
