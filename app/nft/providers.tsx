"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";


import "@coinbase/onchainkit/styles.css";

export function Providers({ children }: { children: ReactNode }) {
  return (
<OnchainKitProvider
  apiKey={process.env.ONCHAINKIT_API_KEY}
  chain={base}
  config={{
    appearance: {
      name: 'Your App Name',        // Displayed in modal header
      logo: 'https://your-logo.com',// Displayed in modal header
      mode: 'dark',                 // 'light' | 'dark' | '400'
      theme: 'default',             // 'default' or custom theme
    },
    wallet: { 
      display: 'modal', 
      termsUrl: 'https://...', 
      privacyUrl: 'https://...', 
      },
  }}
>
  {children}
</OnchainKitProvider>
    );
}