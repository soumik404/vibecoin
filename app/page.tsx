"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import styles from "./page.module.css";

export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const router = useRouter();

  // Initialize the mini app when loaded
  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  return (
    <div className={styles.container}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to VibeCoin Quiz 🎯</h1>

        <p className="text-lg mb-8 text-gray-200">
          Hey {context?.user?.displayName || "there"} 👋<br />
          Test your knowledge and mint your unique NFT reward!
        </p>

        <button
          onClick={() => router.push("/quiz")}
          className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-xl shadow-md hover:scale-105 transition-all"
        >
          Start Quiz
        </button>

        <p className="text-sm text-gray-300 mt-8">
          Powered by Base 
        </p>
      </div>
    </div>
  );
}
