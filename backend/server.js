import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectDB } from './db/connectDB.js';
import routes from './routes/route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;  

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/',routes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is up and running");
})