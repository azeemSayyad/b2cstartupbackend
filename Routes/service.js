import express from 'express'
import { fetchAllTradePersons } from '../Controllers/index.js';

const router = express.Router();

router.get('/allTradePersons',fetchAllTradePersons);

export default router;