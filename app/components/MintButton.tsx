// lib/mintNFT.ts 
"use client";
import { writeContract } from "wagmi/actions";
// 🚨 NOTE: Assuming 'config' is correctly defined and imported from './config'
import { config } from "./config"; 

// --- EMBEDDED ABI FIX: Using JSON structure for reliability ---
// This prevents the recurring "Cannot use 'in' operator" parsing error with string ABIs.
const VibeCoinNFTABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "name": "safeMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable", // Ensure this matches your contract (no payment required)
    "type": "function"
  }
] as const;

const VibeCoinNFTAddress: `0x${string}` = "0xB3445174Bddec66E264403c1318675ad9D8C9C03"; 

export async function mintNFT({
  nftMetadata,
}: {
  userAddress: string;
  chainId: number; 
  nftMetadata: {
    name: string;
    description: string;
    image: string;
  };
}) {
  try {
    // 1. Convert metadata to base64 JSON
    const tokenURI =
      "data:application/json;base64," + btoa(JSON.stringify(nftMetadata));

    console.log(`Preparing transaction for URI: ${tokenURI.slice(0, 50)}...`);

    // 2. Call the contract action
    // This now uses the reliable JSON ABI structure.
    const txHash = await writeContract(config, {
      address: VibeCoinNFTAddress as `0x${string}`, 
      abi: VibeCoinNFTABI,
      functionName: "safeMint",
      args: [tokenURI], // Only one argument (the URI)
    });

    console.log("Minted NFT Tx Hash:", txHash);
    return txHash;
  } catch (err) {
    console.error("Mint failed:", err);
    throw err; 
  }
}
