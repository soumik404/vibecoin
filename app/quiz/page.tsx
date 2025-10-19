"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * QuizPage with Base-style modal for collecting Discord + Twitter.
 * - Debounced twitter fetch (1s)
 * - Fetch onBlur
 * - Shows spinner while pfp downloading
 * - Saves {discord,twitter,pfp,baseTime} to localStorage key "vibecoin_user"
 * - Starts quiz after modal submit
 */

const questions = [
  { q: "What is Base?", a: ["A blockchain", "A game", "A meme"], correct: 0 },
  { q: "What is the main token used for gas on Base?", a: ["$BASE", "USDC", "ETH"], correct: 2 },
  { q: "What blockchain is Base built on top of?", a: ["Arbitrum", "Ethereum", "Polygon"], correct: 1 },
  { q: "Which company founded Base?", a: ["Coinbase", "OpenAI", "Meta"], correct: 0 },
  { q: "Which Layer 2 framework does Base use?", a: ["Arbitrum Nitro", "StarkNet", "Optimism OP Stack"], correct: 2 },
  { q: "What Layer of Ethereum is Base considered?", a: ["Layer 0", "Layer 1", "Layer 2"], correct: 2 },
  { q: "What technology does Base use to reduce gas fees?", a: ["Proof of Work", "Rollups", "Sidechain"], correct: 1 },
  { q: "Base is optimized for?", a: ["Low fees", "High fees", "NFT only"], correct: 0 },
  { q: "What consensus does Base use?", a: ["PoW", "PoS","Optimistic Rollup"], correct: 2 },
  { q: "Is Base EVM compatible?", a: ["Yes", "No", "Partially"], correct: 0 },
];

export default function QuizPage() {
  const router = useRouter();

  // user input state (modal)
  const [discord, setDiscord] = useState("");
  const [twitter, setTwitter] = useState("");
  const [baseTime, setBaseTime] = useState<{ value: number; unit: "days" | "months" | "years" }>({
    value: 2,
    unit: "years",
  });

  // modal + pfp
  const [modalOpen, setModalOpen] = useState(false);
  const [pfp, setPfp] = useState<string>("/user.jpg");
  const [pfpLoaded, setPfpLoaded] = useState(false);
  const [pfpLoading, setPfpLoading] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const pfpAbortRef = useRef<AbortController | null>(null);

  // quiz state
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false); // answer feedback
  const timerRef = useRef<number | null>(null);

  // open modal when user clicks "Start Quiz" (you asked it should appear when clicked)
  const openModal = () => {
    setModalOpen(true);
    // Reset local modal state if needed
  };

  // fetch pfp from your proxy route: /api/auth/twitter-pfp?handle=
  const fetchPfp = async (handle: string) => {
    if (!handle) {
      setPfp("/user.jpg");
      setPfpLoaded(true);
      setPfpLoading(false);
      return;
    }

    // cancel previous request
    if (pfpAbortRef.current) pfpAbortRef.current.abort();
    pfpAbortRef.current = new AbortController();

    setPfpLoading(true);
    setPfpLoaded(false);

    try {
      const res = await fetch(`/api/auth/twitter-pfp?handle=${encodeURIComponent(handle)}`, {
        signal: pfpAbortRef.current.signal,
      });
      if (!res.ok) throw new Error("Failed to fetch pfp");
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setPfp(reader.result as string);
        setPfpLoaded(true);
        setPfpLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("pfp fetch error", err);
      setPfp("/user.jpg");
      setPfpLoaded(true);
      setPfpLoading(false);
    }
  };

  // debounce typing
  const handleTwitterChange = (value: string) => {
    setTwitter(value);
    setPfpLoaded(false);
    setPfp("/user.jpg");

    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      fetchPfp(value);
    }, 1000);
  };

  // also fetch on blur
  const handleTwitterBlur = () => {
    if (!pfpLoaded) fetchPfp(twitter);
  };

  // when user submits modal: validate, store to localStorage, close modal and start quiz
  const handleModalSubmit = async () => {
    if (!discord.trim() || !twitter.trim()) {
      alert("Please enter both Discord and Twitter usernames.");
      return;
    }

    // if pfp not loaded yet, fetch now and wait
    if (!pfpLoaded && !pfpLoading) {
      await fetchPfp(twitter);
    }

    // final ensure pfpLoaded
    if (!pfpLoaded) {
      alert("Still loading profile picture — please wait a second.");
      return;
    }

    // Save to localStorage so NFT page can read it immediately
    const user = { discord: discord.trim(), twitter: twitter.trim(), pfp, baseTime };
    try {
      localStorage.setItem("vibecoin_user", JSON.stringify(user));
      console.log("Saved user to localStorage", user);
    } catch (err) {
      console.warn("localStorage set error", err);
    }

    setModalOpen(false);
    setStarted(true);
  };

  // quiz answer handling (with feedback)
  const handleAnswer = (i: number) => {
    if (feedbackVisible) return; // prevent double clicks
    const correctIndex = questions[step].correct;
    const isCorrect = i === correctIndex;
    const newScore = isCorrect ? score + 1 : score;

    setSelected(i);
    setFeedbackVisible(true);

    timerRef.current = window.setTimeout(() => {
      setFeedbackVisible(false);
      setSelected(null);

      if (step + 1 < questions.length) {
        setStep((s) => s + 1);
        setScore(newScore);
      } else {
        // finish
        setScore(newScore);
        router.push(`/nft?score=${newScore}`);
      }
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
      if (pfpAbortRef.current) pfpAbortRef.current.abort();
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 py-12">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center animate-shine">Test Your Base Knowledge! 🧠</h1>

      {!started && (
        <div className="w-[380px] bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,123,255,0.8)] border-2 border-blue-500">
          <p className="text-white mb-6">Click start to begin — you&apos;ll be asked for Discord & Twitter first.</p>

          <div className="flex gap-3">
            <button
              onClick={openModal}
              className="flex-1 bg-white text-blue-700 font-bold py-3 rounded-xl hover:scale-105 transition"
            >
              Start Quiz
            </button>
            
          </div>
        </div>
      )}

      {/* Quiz content */}
      {started && (
        <div className="relative w-[400px] rounded-3xl p-6 shadow-[0_0_50px_rgba(0,123,255,0.8)] border-2 border-blue-500 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 animate-wave mt-6">
          <h2 className="text-2xl font-bold text-white mb-6">{questions[step].q}</h2>

          <div className="flex flex-col gap-3">
            {questions[step].a.map((ans, i) => {
              let cls = "bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition";
              if (feedbackVisible && selected === i) {
                cls = i === questions[step].correct ? "bg-green-500 text-white py-3 px-4 rounded-xl" : "bg-red-500 text-white py-3 px-4 rounded-xl";
              } else if (feedbackVisible && i === questions[step].correct) {
                cls = "bg-green-600 text-white py-3 px-4 rounded-xl";
              } else {
                cls += " hover:bg-white/50";
              }

              return (
                <button key={i} onClick={() => handleAnswer(i)} className={cls + " animate-pulse"} disabled={feedbackVisible}>
                  {ans}
                </button>
              );
            })}
          </div>

          <div className="mt-6 px-4 py-2 text-white font-bold text-lg text-center rounded-full bg-gradient-to-r from-white/20 to-white/10 shadow-lg border border-white/30 animate-pulse">
            Score: {score}
          </div>

          <div className="mt-4 text-sm text-white/80 text-center">
            Question {step + 1} of {questions.length}
          </div>
        </div>
      )}

      {/* Modal */}
     {modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* backdrop */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-bg" />

    {/* fancy modal card */}
    <div className="relative z-10 w-[440px] bg-white/10 backdrop-blur-xl border border-blue-400/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(59,130,246,0.6)] overflow-hidden animate-pop-up">

      {/* animated glow border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-br from-blue-400 via-blue-500 to-blue-300 bg-[length:200%_200%] animate-gradient-move opacity-40" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-inner">💫</div>
          <h3 className="text-2xl font-bold text-white">Enter Your Details</h3>
        </div>
        <p className="text-white/70 mb-6">We&apos;ll fetch your Twitter avatar and attach it to your Base NFT.</p>

        {/* Discord input */}
        <div className="mb-4">
          <label className="text-sm text-white/80">Discord Name</label>
          <input
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            placeholder="Your Discord name"
            className="w-full mt-2 p-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-blue-400/40 focus:border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
          />
        </div>

        {/* Twitter input + PFP */}
        <div className="mb-4">
          <label className="text-sm text-white/80">Twitter Handle (without @)</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              value={twitter}
              onChange={(e) => handleTwitterChange(e.target.value)}
              onBlur={handleTwitterBlur}
              placeholder="twitterhandle"
              className="flex-1 p-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-blue-400/40 focus:border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-300 shadow-inner flex items-center justify-center bg-blue-400/20">
              {pfpLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <img src={pfp} alt="preview" className="w-full h-full object-cover animate-fade-in-slow" />
              )}
            </div>
          </div>
        </div>

        {/* Base time */}
        <div className="mb-4">
  <label className="text-sm text-white/80">Spend on BASE</label>
  <br />
  <div className="flex gap-3 mt-2 items-center">
    <input
      type="number"
      min={0}
      value={baseTime.value}
      onChange={(e) =>
        setBaseTime({ ...baseTime, value: Number(e.target.value) })
      }
      className="p-2 rounded-xl bg-white/10 text-white border border-blue-400/40 focus:border-blue-300 focus:ring-2 focus:ring-blue-400 w-20 outline-none"
    />
    <select
      value={baseTime.unit}
      onChange={(e) =>
        setBaseTime({
          ...baseTime,
          unit: e.target.value as "days" | "months" | "years",
        })
      }
      className="p-2 rounded-xl bg-white/10 text-white border border-blue-400/40 focus:border-blue-300 focus:ring-2 focus:ring-blue-400 outline-none"
    >
    <option value="days" className="bg-gray-900 text-white">Days</option>
  <option value="months" className="bg-gray-900 text-white">Months</option>
  <option value="years" className="bg-gray-900 text-white">Years</option>
    </select>
  </div>
</div>


        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setModalOpen(false)}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleModalSubmit}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Start Quiz 🚀
          </button>
        </div>
      </div>
    </div>

    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-blue-300 opacity-30 animate-float"
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 4}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      ></div>
    ))}

    <style jsx>{`
      @keyframes fadeBg { from { opacity: 0 } to { opacity: 1 } }
      .animate-fade-bg { animation: fadeBg 0.4s ease; }

      @keyframes popUp {
        0% { transform: scale(0.9) translateY(20px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      .animate-pop-up { animation: popUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-move { animation: gradientMove 6s ease infinite; }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-12px); }
      }
      .animate-float { animation: float linear infinite; }

      @keyframes fadeInSlow { from { opacity: 0 } to { opacity: 1 } }
      .animate-fade-in-slow { animation: fadeInSlow 0.6s ease; }
    `}</style>
  </div>
)}

     
    </div>
  );
}
