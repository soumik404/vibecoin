"use client";
import { useEffect } from "react";
// import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";

import { Connected } from '@coinbase/onchainkit';
import "./globals.css";
import styles from "./page.module.css";

// import "@coinbase/onchainkit/styles.css";

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const router = useRouter();

  // Initialize the mini app when loaded
  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return (
    <OnchainKitProvider  apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: "auto",
            },
            wallet: {
              display: "modal",
              preference: "all",
            },
          }}
          miniKit={{
            enabled: true,
            autoConnect: true,
            notificationProxyUrl: undefined,
            
          }}
        >    <div className={styles.container}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to VibeCoin Quiz 🎯</h1>

        <p className="text-lg mb-8 text-gray-200">
          Hey {context?.user?.displayName || "there"} 👋<br />
          Test your knowledge and mint your unique NFT reward!
        </p>

        <button
          onClick={() => router.push("/quiz")}
          className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-xl shadow-md hover:scale-105 transition-all"
        >
          Start Quiz
        </button>

        <p className="text-sm text-gray-300 mt-8">
          Powered by Base 
        </p>
        <Connected>
      <div>Welcome! Your wallet is connected.</div>
    </Connected>
        {/* connect wallet */}
        
       
              <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
            </div>
        
        
                  {/* end */}
      </div>
    
</OnchainKitProvider>
);
}
