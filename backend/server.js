import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cron from 'node-cron';

import { connectDB } from './db/connectDB.js';
import routes from './routes/route.js';
import { scrapeAndSaveNews } from './scraper/newsScraper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;  
const __dirname = path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
//self-ping endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/route',routes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './frontend/dist','index.html'));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server is up and running");

    cron.schedule('0 */6 * * *', () => {
        console.log('[Cron] Running scheduled DTU news scrape...');
        scrapeAndSaveNews();
    });

    // Run once on startup to populate DB immediately
    scrapeAndSaveNews();

    // RENDER_EXTERNAL_URL is injected automatically by Render
    if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
        const PING_URL = `${process.env.RENDER_EXTERNAL_URL}/health`;
        cron.schedule('*/14 * * * *', async () => {
            try {
                const res = await fetch(PING_URL);
                console.log(`[Keep-alive] Pinged ${PING_URL} → ${res.status}`);
            } catch (err) {
                console.error('[Keep-alive] Ping failed:', err.message);
            }
        });
        console.log(`[Keep-alive] Self-ping scheduled every 14 min → ${PING_URL}`);
    }
})