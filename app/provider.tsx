"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { connectWallet } from "../lib/wallet";

interface WalletContextType {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  connecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const hasConnected = useRef(false);

  useEffect(() => {
    if (!hasConnected.current) {
      setConnecting(true);
      const timeoutId = setTimeout(() => {
        connectWallet().then((acc) => {
          setAccount(acc ?? null);
          setConnecting(false);
          hasConnected.current = true;
        });
      }, 4000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, setAccount, connecting }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

const WalletConnection: React.FC = () => {
  const { account, connecting } = useWallet();
  return (
    <div className="w-full flex flex-col items-center mb-4">
      <div className="flex flex-row gap-4 items-center justify-center mt-4">
        {connecting ? (
          <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs">
            Connecting to StarKey wallet...
          </span>
        ) : account ? (
          <span className="px-3 py-1 bg-green-700 text-gray-200 rounded text-xs">
            Connected: {account}
          </span>
        ) : (
          <span className="px-3 py-1 bg-red-700 text-gray-200 rounded text-xs">
            Not connected
          </span>
        )}
      </div>
    </div>
  );
};

export default WalletConnection;
