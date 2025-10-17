export const VibeCoinNFTAddress: `0x${string}`  = "0x38E4b4378E447665816689cE326BdC2727DA344A"; // your deployed contract

export const VibeCoinNFTABI = [
  "function safeMint(string memory uri) public payable returns (uint256)",
  "event NFTMinted(uint256 tokenId, address owner, string uri)"
];
