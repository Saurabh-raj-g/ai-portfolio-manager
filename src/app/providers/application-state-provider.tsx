"use client";
import { createContext, useState, useContext } from "react";
import { TokenHolding } from "../types/Index";

interface ApplicationStateProps {
  cdpWalletAddress: string | null;
  tokenHoldings: TokenHolding[];
  setCdpWalletAddress: (value:string|null) => void;
  setTokenHoldings: (value:TokenHolding[]) => void;
}

const ApplicationStateContext = createContext<ApplicationStateProps>({
  cdpWalletAddress: null,
  tokenHoldings:[],
  setCdpWalletAddress: () => {},
  setTokenHoldings: () => {}
});

export const ApplicationStateProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [cdpWalletAddress, setCdpWalletAddress] = useState<string | null>(null);
  const [tokenHoldings, setTokenHoldings] = useState<TokenHolding[]>([]);

  return (
    <ApplicationStateContext.Provider value={{ cdpWalletAddress, setCdpWalletAddress, tokenHoldings, setTokenHoldings }}>
      {children}
    </ApplicationStateContext.Provider>
  );
};

export const useApplicationState = () => {
  return useContext(ApplicationStateContext);
};
