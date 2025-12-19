import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Gamepad2, Mail, Trophy, ArrowRight } from 'lucide-react';

const Welcome: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/start-game', { email });
      if (response.status === 200) {
        localStorage.setItem('userEmail', email);
        navigate('/game');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 403) {
        setError('⚠️ This email has already played the game.');
      } else {
        setError('Server error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-8 relative">
      
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="flex justify-center mb-6">
          <div className="bg-indigo-900/50 p-4 rounded-full border border-indigo-500/30">
            <Gamepad2 className="w-12 h-12 text-indigo-400" />
          </div>
        </div>

        <p className="text-4xl font-extrabold text-center text-white mb-3 tracking-tight ">
          Hasthiya Lucky 4
        </p>
        <p className="text-slate-400 text-center mb-8 text-sm">
          Enter your email to test your luck and software skills.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="email"
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="developer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center flex items-center justify-center gap-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'Checking...' : (
                <>
                    Start Game <ArrowRight className="w-5 h-5" />
                </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
          <button 
            onClick={() => navigate('/leaderboard')}
            className="bg-yellow-600 text-slate-600 hover:text-slate-900 text-sm flex items-center justify-center px-4 py-2 rounded-md gap-2 mx-auto transition-colors"
          >
            <Trophy className="w-4 h-4" /> View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;