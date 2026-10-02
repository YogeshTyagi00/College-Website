import express from 'express';

import { createevents, createnews, getnews, createsociety, getsociety,signup, checkAuth, login, logout, getevents} from '../controller/controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { triggerNewsScrape } from '../controller/scraperController.js';
import { parseAndSaveEvent, parseAndSaveSociety } from '../controller/aiParserController.js';
import {authorizeRole} from '../middleware/authorizeRole.js';
import { requestAdmin, getAllRequests, reviewRequest } from '../controller/adminRequestController.js';

const router = express.Router();

router.get('/check-auth',verifyToken,checkAuth);

router.post('/signup',signup);
router.post('/login',login); 
router.post('/logout',logout);

router.post('/news', verifyToken, authorizeRole('admin','superAdmin'),createnews);
router.get('/news',verifyToken,getnews);

router.post('/events',  verifyToken, authorizeRole('admin','superAdmin'),createevents);
router.get('/events',verifyToken, getevents);

router.post('/society', verifyToken, authorizeRole('admin','superAdmin'),createsociety);
router.get('/society',verifyToken,getsociety);

router.post('/ai/event', verifyToken, authorizeRole('admin','superAdmin'), parseAndSaveEvent);
router.post('/ai/society', verifyToken, authorizeRole('admin','superAdmin'), parseAndSaveSociety);

router.post('/scrape/news', verifyToken, triggerNewsScrape);

router.post('/admin-request', verifyToken, requestAdmin);
router.get('/admin-request/all', verifyToken, authorizeRole('superAdmin'), getAllRequests);
router.patch('/admin-request/:userId/review', verifyToken, authorizeRole('superAdmin'), reviewRequest);


export default router;