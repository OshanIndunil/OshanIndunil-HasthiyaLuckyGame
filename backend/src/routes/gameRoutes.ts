import { Router } from 'express';
import { startGame, submitScore, getLeaderboard } from '../controllers/gameController';

const router = Router();

router.post('/start-game', startGame);

router.post('/submit-score', submitScore);

router.get('/leaderboard', getLeaderboard);

export default router;