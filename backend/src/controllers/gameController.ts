import { Request, Response } from 'express';
import db from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const HIDDEN_NUMBERS = (process.env.HIDDEN_NUMBERS || "").split(',').map(Number);

interface GameResult extends RowDataPacket {
    id: number;
    email: string;
    generated_numbers: any; 
    score: number;
    is_played: number; 
}

export const startGame = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }

        const [rows] = await db.query<GameResult[]>('SELECT * FROM game_results WHERE email = ?', [email]);

        if (rows.length > 0) {
            if (rows[0].is_played) {
                res.status(403).json({ error: "Game already played with this email." });
                return;
            } else {
                res.status(200).json({ message: "Welcome back!", hidden_count: HIDDEN_NUMBERS.length });
                return;
            }
        }
        res.status(200).json({ message: "User can play", hidden_count: HIDDEN_NUMBERS.length });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error during login" });
    }
};

export const submitScore = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, generatedNumbers } = req.body;

        // Validation
        if (!email || !generatedNumbers || generatedNumbers.length !== 4) {
             res.status(400).json({ error: "Invalid data. 4 numbers required." });
             return;
        }

        const [existing] = await db.query<GameResult[]>('SELECT is_played FROM game_results WHERE email = ?', [email]);
        if (existing.length > 0 && existing[0].is_played) {
             res.status(403).json({ error: "Game already played." });
             return;
        }

        let totalDifference = 0;
        
        for (let i = 0; i < 4; i++) {
            const hidden = HIDDEN_NUMBERS[i];
            const generated = generatedNumbers[i];
            totalDifference += Math.abs(hidden - generated);
        }

        let score = 100 - (totalDifference * 2);

        if (score < 0) score = 0;

        // Save to Database
        const query = `
            INSERT INTO game_results (email, generated_numbers, score, is_played) 
            VALUES (?, ?, ?, true)
            ON DUPLICATE KEY UPDATE generated_numbers = VALUES(generated_numbers), score = VALUES(score), is_played = true
        `;

        await db.query<ResultSetHeader>(query, [email, JSON.stringify(generatedNumbers), score]);

        res.status(200).json({ 
            success: true, 
            score: score,
            message: "Score saved successfully!" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save score" });
    }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const [rows] = await db.query<GameResult[]>(
            'SELECT email, score, created_at, generated_numbers FROM game_results WHERE is_played = true ORDER BY score DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        
        const [countResult] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM game_results WHERE is_played = true');
        const total = countResult[0].total;

        res.status(200).json({
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};