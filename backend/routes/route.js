import express from 'express';

import { createevents, createnews, getnews, createsociety, getsociety,signup, checkAuth, login, logout, getevents} from '../controller/controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { createOrder, verifyPayment, getDonations } from '../controller/donationController.js';
import { triggerNewsScrape } from '../controller/scraperController.js';
import { parseAndSaveEvent, parseAndSaveSociety } from '../controller/aiParserController.js';
import {authorizeRole} from '../middleware/authorizeRole.js';

const router = express.Router();

router.get('/check-auth',verifyToken,checkAuth);

router.post('/signup',signup);
router.post('/login',login); 
router.post('/logout',logout);

router.post('/news', verifyToken, authorizeRole('admin'),createnews);
router.get('/news',verifyToken,getnews);

router.post('/events',  verifyToken, authorizeRole('admin'),createevents);
router.get('/events',verifyToken, getevents);

router.post('/society', verifyToken, authorizeRole('admin'),createsociety);
router.get('/society',verifyToken,getsociety);

router.post('/scrape/news', verifyToken, triggerNewsScrape);

router.post('/ai/event', verifyToken, authorizeRole('admin'), parseAndSaveEvent);
router.post('/ai/society', verifyToken, authorizeRole('admin'), parseAndSaveSociety);

router.post('/donation/create-order', createOrder);
router.post('/donation/verify', verifyPayment);
router.get('/donations', verifyToken, getDonations);

export default router;