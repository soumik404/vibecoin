// lib/mintNFT.ts
"use client";
import { writeContract, getWalletClient } from "wagmi/actions";
import { config } from "./config"; // your wagmi config file
import { VibeCoinNFTAddress, VibeCoinNFTABI } from "../nft/contracts/VibeCoinNFT";
// import { OnchainKitProvider } from "@coinbase/onchainkit";
export async function mintNFT({
  userAddress,
  // chainId,
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
    const walletClient = await getWalletClient(config);
    if (!walletClient) throw new Error("Wallet not connected");

    // Convert metadata to base64 JSON
    const tokenURI =
      "data:application/json;base64," + btoa(JSON.stringify(nftMetadata));

    // Call contract
    const txHash = await writeContract(config, {
     address: VibeCoinNFTAddress as `0x${string}`, // cast to satisfy TS
      abi: VibeCoinNFTABI,
      functionName: "safeMint",
      args: [userAddress, tokenURI],
    });

    console.log("Minted NFT Tx:", txHash);
    return txHash;
  } catch (err) {
    console.error("Mint failed:", err);
    throw err;
  }
}
