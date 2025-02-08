"use client";
import { createContext, useState, useContext } from "react";

interface ApplicationStateProps {
  isLocalStorageChanged: boolean;
  setLocalStorageState: (value:boolean) => void;
}

const ApplicationStateContext = createContext<ApplicationStateProps>({
  isLocalStorageChanged: false,
  setLocalStorageState: () => {},
});

export const ApplicationStateProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isLocalStorageChanged, setLocalStorageState] = useState<boolean>(false);

  return (
    <ApplicationStateContext.Provider value={{ isLocalStorageChanged, setLocalStorageState }}>
      {children}
    </ApplicationStateContext.Provider>
  );
};

export const useApplicationState = () => {
  return useContext(ApplicationStateContext);
};
