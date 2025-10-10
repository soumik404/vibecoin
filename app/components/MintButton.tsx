// "use client";
// import { useState } from "react";
// import { useOnchainKit } from "@coinbase/onchainkit";
// import { ethers } from "ethers";
// import NFT_ABI from "../abi/NFT.json"; // your NFT contract ABI

// const NFT_CONTRACT_ADDRESS = "0xYourNFTContractAddress";

// export default function MintButton() {
//   const { connect, signer, isConnected, account } = useOnchainKit();
//   const [minting, setMinting] = useState(false);

//   const handleMint = async () => {
//     try {
//       if (!isConnected) {
//         // Ask user to connect wallet
//         await connect();
//       }

//       if (!signer) return;

//       setMinting(true);

//       const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

//       // If your contract has a mint() function
//       const tx = await nftContract.mint(); // or mint(account.address)
//       console.log("Transaction sent:", tx.hash);

//       await tx.wait(); // wait for confirmation
//       alert("NFT minted successfully! 🎉");

//     } catch (err: any) {
//       console.error(err);
//       alert("Minting failed: " + (err?.message || err));
//     } finally {
//       setMinting(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleMint}
//       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
//       disabled={minting}
//     >
//       {minting ? "Minting..." : "Mint NFT"}
//     </button>
//   );
// }
