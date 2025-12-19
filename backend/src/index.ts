import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db';

dotenv.config();

// Initialize the Express application
const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hasthiya Lucky 4 Backend is Running!');
});

// Start the Server
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    try {
        await db.query('SELECT 1');
        console.log('Database connection confirmed.');
    } catch (error) {
        console.error('Database connection error:', error);
    }
});