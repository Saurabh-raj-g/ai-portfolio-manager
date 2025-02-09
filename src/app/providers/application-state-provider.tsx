"use client";
import { createContext, useState, useContext } from "react";
import { TokenHolding } from "../types/Index";

interface ApplicationStateProps {
  isLocalStorageChanged: boolean;
  tokenHoldings: TokenHolding[];
  setLocalStorageState: (value:boolean) => void;
  setTokenHoldings: (value:TokenHolding[]) => void;
}

const ApplicationStateContext = createContext<ApplicationStateProps>({
  isLocalStorageChanged: false,
  tokenHoldings:[],
  setLocalStorageState: () => {},
  setTokenHoldings: () => {}
});

export const ApplicationStateProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLocalStorageChanged, setLocalStorageState] = useState<boolean>(false);
  const [tokenHoldings, setTokenHoldings] = useState<TokenHolding[]>([]);

  return (
    <ApplicationStateContext.Provider value={{ isLocalStorageChanged, setLocalStorageState, tokenHoldings, setTokenHoldings }}>
      {children}
    </ApplicationStateContext.Provider>
  );
};

export const useApplicationState = () => {
  return useContext(ApplicationStateContext);
};
