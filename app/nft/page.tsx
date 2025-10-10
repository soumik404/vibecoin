"use client";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
// import MintButton from "../components/MintButton"; // adjust path if needed
import { useSearchParams } from "next/navigation";

export default function NFTPage() {
  const [user, setUser] = useState<{
    discord: string;
    twitter: string;
    pfp: string;
    baseTime: { value: number; unit: "days" | "months" | "years" };
  } | null>(null);

  const [roles, setRoles] = useState<string[]>([]);
  const [pfpLoaded, setPfpLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const score = searchParams.get("score") || "0";
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
      alert("Please wait for the profile picture to load.");
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

          <img
            src={user.pfp}
            alt="Profile Picture"
            className="w-36 h-36 rounded-full border-4 border-white mt-6 object-cover"
          />

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

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition"
          >
            Download
          </button>
          <button
            onClick={() => alert("Minting not connected yet")}
            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Mint
          </button>
          {/* <MintButton
            onClick={() => alert("Minting not connected yet")}
            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Mint
          <MintButton /> */}
        </div>
      </div>

 


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
