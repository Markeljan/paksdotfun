// src/wallet.ts
interface StarkeyProvider {
  connect: () => Promise<string[]>;
  account: () => Promise<string[]>;
  sendTransaction: (transaction: object) => Promise<string>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (accounts: string[]) => void) => void;
}

interface StarkeyWindow extends Window {
  starkey?: {
    supra: StarkeyProvider;
  };
}

/**
 * Returns the Starkey provider if available, otherwise opens the Starkey app page.
 * Returns undefined if not running on the client.
 */
export const getProvider = () => {
  if (typeof window === "undefined") return undefined;
  if ("starkey" in window) {
    const win = window as StarkeyWindow;
    const provider = win.starkey?.supra;
    if (provider) {
      return provider;
    }
  }
  window.open("https://starkey.app/", "_blank");
  return undefined;
};

/**
 * Connects to the Starkey wallet and returns the first account, or null if not available or rejected.
 */
export const connectWallet = async (): Promise<string | null> => {
  const provider = getProvider();
  if (provider) {
    try {
      const accounts = await provider.connect();
      console.log(`Connected account: ${accounts[0]}`);
      return accounts[0];
    } catch (err) {
      console.error("User rejected the request:", err);
      return null;
    }
  }
  return null;
};
