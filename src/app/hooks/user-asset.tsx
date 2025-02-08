import axios from "axios";
import { useCallback, useMemo} from "react";
import { useAccount } from "wagmi";
import Chain from "../value-objects/chain";
import { PortfolioResponse, TokenHolding } from "../types/Index";

export const useUserAsset = () => {
  const {isConnected, address, chainId} =  useAccount();
 
  // Memoize values to avoid unnecessary re-renders
  const signature = useMemo(
    () => localStorage.getItem(`smartfolio-message-signature-${chainId}-${address}`) as string,
    [chainId, address]
  );

  const storedChainId = useMemo(
    () => localStorage.getItem(`smartfolio-${chainId}-${address}`) as string,
    [chainId, address]
  );

  const chain = useMemo(() => Chain.fromUniqueProperty<Chain>("chainId", storedChainId), [storedChainId]);

  const getPortofiloAssets = useCallback(async() => {

    if(!isConnected || !address || !signature || chain.isUnknown()){
      return {
        tokens: [] as TokenHolding[],
        cdpwalletAddress: null,
      };
    }
    
    try{

      const response = await axios.get<PortfolioResponse>(`/api/tokens-by-address`, {
        params: {
          address,
          signature,
          chain: chain.getChainId(),
        },
      })
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
    

  }, [isConnected, address, signature, chain]);

  return { getPortofiloAssets, signature, chainId };
};
