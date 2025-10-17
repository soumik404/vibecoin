// 🚨 FIX: Simplified the ABI string to the minimal necessary signature (name + input types).
// This prevents the Wagmi/Viem parser from failing on keywords like 'memory' or 'public'.

export const VibeCoinNFTAddress: `0x${string}` = "0xB3445174Bddec66E264403c1318675ad9D8C9C03"; 

export const VibeCoinNFTABI = [
  "function safeMint(string uri)", // Minimal signature is sufficient and more robust for Human-Readable ABI
  "event NFTMinted(uint256 tokenId, address owner, string uri)"
] as const; 

// Type definition for the metadata structure
export interface NftMetadata {
  name: string;
  description: string;
  image: string; // URL or data URI
}