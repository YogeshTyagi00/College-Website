import express from 'express';

import { createevents, createnews, getnews, createsociety, getsociety,signup, checkAuth, login, logout, getevents} from '../controller/controller.js';
import { verifyToken } from '../middleware/verifyToken.js';



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

export default router;