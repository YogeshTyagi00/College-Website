import express from 'express';

import { createevents, createnews, getnews, createsociety, getsociety,signup, checkAuth, login, logout, getevents} from '../controller/controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { createOrder, verifyPayment, getDonations } from '../controller/donationController.js';
import { triggerNewsScrape } from '../controller/scraperController.js';
import { parseAndSaveEvent, parseAndSaveSociety } from '../controller/aiParserController.js';

const router = express.Router();

router.get('/check-auth',verifyToken,checkAuth);

router.post('/signup',signup);
router.post('/login',login); 
router.post('/logout',logout);

router.post('/news',createnews);
router.get('/news',verifyToken,getnews);

router.post('/events', createevents);
router.get('/events',verifyToken, getevents);

router.post('/society',createsociety);
router.get('/society',verifyToken,getsociety);

// Scraper route (protected — only logged in users can trigger manually)
router.post('/scrape/news', verifyToken, triggerNewsScrape);

// AI parser routes (protected)
router.post('/ai/event', verifyToken, parseAndSaveEvent);
router.post('/ai/society', verifyToken, parseAndSaveSociety);
router.post('/donation/create-order', createOrder);
router.post('/donation/verify', verifyPayment);
router.get('/donations', verifyToken, getDonations);

export default router;