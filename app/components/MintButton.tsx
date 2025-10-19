// lib/mintNFT.ts 
"use client";

import { ethers } from "ethers";

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

// const VibeCoinNFTAddress: `0x${string}` = "0xB3445174Bddec66E264403c1318675ad9D8C9C03"; 
type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes?: { trait_type: string; value: string | number }[];
};
export async function mintNFT({ nftMetadata }: { nftMetadata: NFTMetadata }) {
  const tokenURI = "data:application/json;base64," + btoa(JSON.stringify(nftMetadata));

  if (!window.ethereum) throw new Error("No wallet detected");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    "0xB3445174Bddec66E264403c1318675ad9D8C9C03",
    VibeCoinNFTABI,
    signer
  );

  const tx = await contract.safeMint(tokenURI);
  await tx.wait();
  return tx.hash;
}