type NFTPageSearchParams = {
  score?: string;
};

import { Suspense } from "react";
import NFTClient from "./NFTClient";
import './vibe-modal.css';
export const dynamic = "force-dynamic";
export default async function NFTPage({ searchParams }: { searchParams: Promise<NFTPageSearchParams> }) {
  // Await the searchParams before using
  const params = await searchParams; 
  return (
    
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-xl text-blue-800 font-semibold">
        Loading your NFT...
      </div>
      
    }>
      <NFTClient searchParams={params} />
    </Suspense>
    
  );
}
