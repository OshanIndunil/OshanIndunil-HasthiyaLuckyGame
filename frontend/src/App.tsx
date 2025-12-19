import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Routes>
          {/* Screen 1: Entry/Welcome */}
          <Route path="/" element={<Welcome />} />
          
          {/* Screen 2: The Game */}
          <Route path="/game" element={<Game />} />
          
          {/* Screen 3: Leaderboard */}
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;