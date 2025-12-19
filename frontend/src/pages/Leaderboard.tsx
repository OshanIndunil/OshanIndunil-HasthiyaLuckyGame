import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, Hash, House, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeaderboardEntry {
  email: string;
  score: number;
  created_at: string;
}

const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/leaderboard?page=${page}`);
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                <Trophy className="w-8 h-8 text-yellow-500" />
             </div>
             <div className='text-left'>
                <p className="text-4xl font-bold text-white">Global Standings</p>
                <div className="text-slate-400 text-sm">Top players ranked by efficiency</div>
             </div>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-4 rounded-xl border border-slate-700"
          >
             <House className='w-6 h-6'/>
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-5 w-20">Rank</th>
                  <th className="p-5">Player</th>
                  <th className="p-5 text-right">Score</th>
                  <th className="p-5 text-right hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500 animate-pulse">Loading data...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-500">No records yet.</td>
                  </tr>
                ) : (
                  data.map((entry, index) => {
                    const rank = ((page - 1) * 10) + index + 1;
                    return (
                    <tr key={index} className="hover:bg-slate-700/50 transition duration-150 group">
                      <td className="p-5 font-bold text-slate-500 group-hover:text-slate-700">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full p-2 ${rank === 1 ? 'bg-yellow-500 text-slate-900' : rank === 2 ? 'bg-gray-400 text-slate-900' : rank === 3 ? 'bg-orange-700 text-slate-200' : 'bg-slate-700 text-slate-400'}`}>
                            {rank === 1 || rank === 2 || rank === 3 ? <Trophy className="w-4 h-4" /> : `#${rank}`}
                        </span>
                      </td>
                      <td className="p-5 text-slate-300 font-medium">{entry.email}</td>
                      <td className="p-5 text-right font-bold text-emerald-400 text-lg">{entry.score}</td>
                      <td className="p-5 text-right text-slate-500 text-sm hidden md:table-cell font-mono">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-900/30 border-t border-slate-700 flex justify-between items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-2 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
             <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-slate-500 text-sm">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((prev) => (page < totalPages ? prev + 1 : prev))}
              disabled={page >= totalPages}
              className="px-2 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className='w-6 h-6'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;