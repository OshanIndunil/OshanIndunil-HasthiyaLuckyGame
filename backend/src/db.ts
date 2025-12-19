import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load variables from .env file
dotenv.config();

interface DbConfig {
    host: string | undefined;
    user: string | undefined;
    password: string | undefined;
    database: string | undefined;
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
}

const dbConfig: DbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

const db = pool.promise();

// Check connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error(' Database connection failed:', err.message);
    } else {
        console.log(' Connected to MySQL database successfully');
        connection.release();
    }
});

export default db;