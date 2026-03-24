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

    // Run scraper every 6 hours: min hour day month weekday
    cron.schedule('0 */6 * * *', () => {
        console.log('[Cron] Running scheduled DTU news scrape...');
        scrapeAndSaveNews();
    });

    // Run once on startup to populate DB immediately
    scrapeAndSaveNews();
})