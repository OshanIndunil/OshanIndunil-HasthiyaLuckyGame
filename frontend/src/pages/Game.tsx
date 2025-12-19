import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Trophy, LogOut } from "lucide-react";
import Slot from "../components/Slot";
import { submitScore } from "../services";

const Game: React.FC = () => {
  const [numbers, setNumbers] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  useEffect(() => {
    const checkCompletion = async () => {
      if (numbers.every((n) => n !== null) && !score && !loading) {
        await submitGame();
      }
    };
    checkCompletion();
  }, [numbers]);
  
// Handle Rolling a Number
  const handleRoll = (index: number) => {
    if (numbers[index] !== null) return;
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const newNumbers = [...numbers];
    newNumbers[index] = randomNum;
    setNumbers(newNumbers);
  };

// Submit Game Score
  const submitGame = async () => {
    setLoading(true);

    const response = await submitScore(email!, numbers as number[]);
    if (response.status === 200) {
      setTimeout(() => setScore(response?.data.score), 800);
    }

    console.error("Failed to submit score", response.message);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate("/")}
          className="text-slate-500 p-2 rounded-lg hover:text-slate-700 transition"
        >
          <LogOut className=" w-8 h-8" />
        </button>
      </div>

      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Reveal Your Destiny
          </h2>
          <p className="text-slate-400">
            Tap the mystery boxes to generate your lucky numbers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {numbers.map((num, index) => (
            <Slot
              index={index}
              num={num}
              handleRoll={handleRoll}
              loading={loading}
              score={score}
            />
          ))}
        </div>

        <div className="h-48 flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-3 text-indigo-400 animate-pulse">
              <RefreshCcw className="w-8 h-8 animate-spin" />
              <span className="text-sm tracking-widest uppercase">
                Computing Score...
              </span>
            </div>
          )}

          {score !== null && (
            <div className="animate-bounce-in w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

              <h3 className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-2">
                Final Result
              </h3>
              <div className="text-6xl font-black text-white mb-2 flex items-center justify-center gap-3">
                <Trophy className="w-10 h-10 text-yellow-500" /> {score}
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Score = 100 - (Difference × 2)
              </p>

              <button
                onClick={() => navigate("/leaderboard")}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Check Global Leaderboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
