import { HelpCircle } from "lucide-react";

interface SlotProps {
  index: number;
  num: number | null;
  handleRoll: (index: number) => void;
  loading: boolean;
  score: number | null;
}
// Single Slot Component
const Slot = (props: SlotProps) => {
  const { index, num, handleRoll, loading, score } = props;
  return (
    <div key={index} className="flex flex-col items-center group">
      <button
        onClick={() => handleRoll(index)}
        disabled={num !== null || loading || score !== null}
        className={`
                  relative w-24 h-24 md:w-32 md:h-32 rounded-2xl text-4xl font-bold shadow-2xl transition-all duration-300 transform
                  ${
                    num !== null
                      ? "bg-slate-800 text-emerald-400 border-2 border-emerald-500/50 cursor-default scale-100 rotate-0"
                      : "bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:scale-105 hover:-rotate-3 border border-transparent shadow-indigo-500/30"
                  }
                `}
      >
        <span className="drop-shadow-lg">
          {num !== null ? (
            num
          ) : (
            <HelpCircle className="w-10 h-10 mx-auto opacity-50" />
          )}
        </span>
      </button>
      <span className="mt-4 text-xs uppercase tracking-widest text-slate-500 font-semibold group-hover:text-indigo-400 transition-colors">
        Slot {index + 1}
      </span>
    </div>
  );
};

export default Slot;
