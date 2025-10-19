"use client";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Signature } from '@coinbase/onchainkit/signature';
import { Connected } from '@coinbase/onchainkit';
import '../../app/globals.css';
import { useAccount } from "wagmi";
import { uploadToPinata } from "../components/uploadToPinata";
import { showToast } from "../components/toastManager";
import '@rainbow-me/rainbowkit/styles.css';
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
import { mintNFT} from "../components/MintButton"; // adjust path
type NFTPageSearchParams = {
  score?: string;
};

type NFTClientProps = {
  searchParams: NFTPageSearchParams;
};
export default function NFTClient({ searchParams }: NFTClientProps) {

  const [user, setUser] = useState<{
    discord: string;
    twitter: string;
    pfp: string;
    baseTime: { value: number; unit: "days" | "months" | "years" };
  } | null>(null);

  const [roles, setRoles] = useState<string[]>([]);
  const [pfpLoaded, setPfpLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
   const { address , isConnected } = useAccount();
    const score = searchParams.score || "0";
const [minting] = useState(false); // loading state
const [chainId, setChainId] = useState<number | null>(null);
const handleSignatureSuccess = async (signature: string) => {
  console.log("✅ Signature:", signature);

  if (window.ethereum) {
    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16);
    console.log("🧩 Current Chain ID:", chainId);

    if (chainId !== 8453) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], // 8453 in hex
        });
        showToast("Switched to Base Mainnet ✅", "success");
      } catch (err: unknown) {
        if (err instanceof Error) {
          // Add Base network if missing
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x2105",
                chainName: "Base Mainnet",
                nativeCurrency: { name: "Base", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          });
          showToast("Base Mainnet added and switched ✅", "success");
        } else {
          showToast("Please switch to Base network manually.", "error");
        }
      }
    } else {
      showToast("You are already on Base Mainnet ✅", "success");
      console.log(`chain id is ${chainId}`);
    }

    // store chainId in state for mint use
    setChainId(chainId);
  }
};


 const handleMint = async () => {
  if (!chainId || chainId !== 8453) {
  showToast("Please connect to Base Mainnet before minting.", "error");

  return;
}
  if (!address) {
showToast("Wallet not connected!", "error");
console.log("Wallet not connected!");
    return;
  }

  if (!cardRef.current) {
    showToast("NFT card not ready.", "error");
    return;
  }

  try {
    // 🧷 1. Capture the NFT card as an image
    const canvas = await html2canvas(cardRef.current, { useCORS: true });
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
    const file = new File([blob], "vibe-nft.png", { type: "image/png" });

    // 🪶 2. Upload image to Pinata
    const imageUrl = await uploadToPinata(file);
    console.log("Uploaded image to IPFS:", imageUrl);

    // 🧾 3. Create metadata object
    const metadata = {
      name: "VibeCoin NFT",
      description: `Exclusive collectible for ${user?.discord}`,
      image: imageUrl,
      attributes: [
        { trait_type: "Score", value: score },
        { trait_type: "Roles", value: roles.join(", ") },
      ],
    };

    // 4️⃣ Mint NFT using your existing mintNFT function
    const txHash = await mintNFT({ nftMetadata: metadata });
    showToast(`NFT minted successfully! 🎉 Tx Hash: ${txHash}`, "success");
  } catch (err) {
    console.error("Mint error:", err);
    showToast( `Minting failed. Please try again.`, "error");
  }
};




const mainRoles = [
  "Connected",
  "Based and Onchain",
  "Based",
  "Onchain",
  "Based Influencer",
  "Coinbase Onchain Verified",
  "USDC Saver",
  "cbBTC Maxi",
  "Based Initiate",
  "Based Builder",
  "Base Learn Newcomer",
  "Base Learn Acolyte",
  "Base Learn Consul",
  "Base Learn Prefect",
  "Base Learn Supreme",
];
useEffect(() => {
  if (isConnected) {
    console.log("Wallet connected:", address);
    showToast("Wallet connected successfully!", "success");
    // setShowSignature(true);
  }
}, [isConnected]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vibecoin_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Error reading localStorage", err);
    }
  }, []);

  useEffect(() => {
    if (user?.pfp) {
      const img = new Image();
      img.src = user.pfp;
      img.onload = () => setPfpLoaded(true);
    }
  }, [user]);
  

  const handleDownload = async () => {
    if (!cardRef.current || !pfpLoaded) {
      showToast("Please wait for the profile picture to load successfully.", "error");
      return;
    }


    const discordText = document.getElementById("discord-h2");
    discordText?.classList.add("capture-text");

    const canvas = await html2canvas(cardRef.current, { useCORS: true, allowTaint: true });

    discordText?.classList.remove("capture-text");

    const link = document.createElement("a");
    link.download = `${user?.discord || "vibecoin-nft"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-blue-800 font-semibold">
        Loading your NFT details...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 py-12">
     
      <h1 className="text-4xl font-bold text-blue-900 mb-10 text-center">Your Base NFT 🎁</h1>

      {/* NFT CARD */}
      <div
  ref={cardRef}
  className="relative w-[380px] rounded-3xl p-6 overflow-hidden shadow-[0_0_50px_rgba(0,123,255,0.8)] border-2 border-blue-500"
  style={{ minHeight: "600px" }}
>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 animate-wave"></div>
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute bg-white rounded-full opacity-50 animate-bounce"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-300 rounded-t-3xl flex items-center justify-center text-white font-bold text-lg">
            VIBECOIN NFT
          </div>

         {user?.pfp && (
  <img
    src={user.pfp}
    alt="Profile Picture"
    onLoad={() => setPfpLoaded(true)}
    className="w-36 h-36 rounded-full border-4 border-white mt-6 object-cover"
  />
)}

          <h2
            id="discord-h2"
            className="text-3xl font-extrabold text-white mt-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white animate-shine"
          >
            {user.discord}
          </h2>

          <p className="text-white/80">@{user.twitter}</p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {roles.map((r) => (
              <span
                key={r}
                className="px-3 py-1 bg-white/30 text-white rounded-full font-semibold backdrop-blur-sm animate-pulse"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-6 px-4 py-2 text-white font-bold text-lg text-center rounded-full bg-gradient-to-r from-white/20 to-white/10 shadow-lg border border-white/30 animate-pulse">
            Score: {score}
          </div>

          <p className="mt-4 text-white/70 italic font-medium">
            Member of Base for {user.baseTime.value} {user.baseTime.unit}
          </p>
          <p className="text-white/50 text-sm mt-1">Exclusive VIBECOIN Collectible NFT</p>
        </div>
      </div>





      {/* Role Selection + Actions */}
      <div className="mt-8 w-[380px] flex flex-col gap-4 justify-center">
        <label className="text-blue-800 font-semibold mb-2 w-full text-center">
    Choose your Base roles
  </label>
        <div className="flex flex-wrap gap-2 justify-center">
               <div className="mt-3 w-[380px] flex flex-wrap gap-2 justify-center">
  {mainRoles.map((role) => (
    <label
      key={role}
      className={`cursor-pointer px-3 py-1 rounded-full border border-blue-200 ${
        roles.includes(role)
          ? "bg-blue-600 text-white animate-pulse"
          : "text-blue-800 hover:bg-blue-100"
      }`}
    >
      <input
        type="checkbox"
        className="hidden"
        value={role}
        checked={roles.includes(role)}
        onChange={(e) => {
          if (e.target.checked) setRoles([...roles, role]);
          else setRoles(roles.filter((r) => r !== role));
        }}
      />
      {role}
    </label>
  ))}
</div>
        </div>
       
  {/* connect wallet */}

<div className="flex justify-end">
  <Connected
      fallback={
        <div className="text-center p-4">
           <Wallet>
  <ConnectWallet>
    <Avatar className="h-6 w-6" />
    <Name />
  </ConnectWallet>
  <WalletDropdown>
    <Identity className="px-4 pt-3 pb-2">
      <Avatar />
      <Name />
      <Address />
    </Identity>
    <WalletDropdownDisconnect />
  </WalletDropdown>
</Wallet>
        </div>
      }
    >
      <div> <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 text-sm font-semibold shadow-md hover:shadow-blue-500/30 transition-all duration-200">
  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
  Wallet Connected ✅
  
  <Identity className="">
        
            
          
      <Address /> <br />
      </Identity>
</div>

    
     <Signature
    message="Sign to confirm your minting on Base 🪩"
   label={
    <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center gap-2">
      Connect to Base Mainnet
    </span>
  }
    onSuccess={handleSignatureSuccess}
      />
    
    </div>
    </Connected>
  
     
    </div>





          {/* end */}
        <div className="flex gap-4 mt-4">

          
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
          >
            Download
          </button>
         


<button
  onClick={handleMint}
  disabled={minting}
  className={`flex-1 ${minting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white py-3 rounded-xl font-bold transition`}
>
  {minting ? "Minting..." : "Mint NFT"}
</button>


        </div>
      </div>
<style jsx global>{`
  @keyframes slideIn {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
`}</style>

<style jsx global>{`
/* Modal backdrop */
.ock\\:bg-ock-background {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(6px);
}

/* Modal container */
.ock\\:border-ock-line.ock\\:rounded-ock-default.ock\\:bg-ock-background {
  background-color: #dd2909ff !important; /* light blue */
  border-radius: 1.5rem !important;
  padding: 2rem !important;
  max-width: 400px !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Modal header */
.ock\\:font-ock.ock\\:font-semibold.ock\\:text-ock-foreground.ock\\:text-center {
  text-align: center !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: #1e40af !important;
  margin-bottom: 1.5rem !important;
}

/* Wallet buttons */
.ock\\:rounded-ock-default.ock\\:font-ock.ock\\:font-normal.ock\\:text-base.ock\\:cursor-pointer {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 0.75rem !important;
  width: 100% !important;
  padding: 0.75rem 1rem !important;
  border-radius: 0.75rem !important;
  font-weight: 600 !important;
  background-color: #2563eb !important;
  color: white !important;
  transition: background-color 0.2s;
}

.ock\\:rounded-ock-default.ock\\:font-ock.ock\\:font-normal.ock\\:text-base.ock\\:cursor-pointer:hover {
  background-color: #1d4ed8 !important;
}

/* Modal footer / Terms links */
.ock\\:text-ock-foreground-muted.ock\\:font-ock.ock\\:text-xs {
  font-size: 0.75rem !important;
  text-align: center !important;
  color: #1e40af !important;
  margin-top: 1rem !important;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ock\\:text-ock-foreground-muted.ock\\:font-ock.ock\\:text-xs a {
  color: #3b82f6 !important;
  text-decoration: underline !important;
}
`}</style>






      {/* Animations */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(10px) translateY(5px) rotate(1deg); }
          100% { transform: translateX(0) translateY(0) rotate(0deg); }
        }
        .animate-wave { animation: wave 8s ease-in-out infinite; }

        @keyframes shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shine {
          background: linear-gradient(90deg, #ffffff 20%, #cce7ff 50%, #ffffff 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce { animation: bounce 2s infinite; }

        @keyframes pulse { 0%,100%{opacity:1;}50%{opacity:0.7;} }
        .animate-pulse { animation: pulse 1.5s infinite; }

        .capture-text {
          color: white !important;
          -webkit-text-fill-color: white !important;
        }
      `}</style>
    </div>
  );
}
