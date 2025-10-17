"use client";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// ✅ Create wagmi config
export const config = createConfig({
  chains: [base], // You can add more if you want (ex: mainnet, optimism, etc.)
  connectors: [injected()],
  transports: {
    [base.id]: http(), // RPC auto from wagmi
  },
});
