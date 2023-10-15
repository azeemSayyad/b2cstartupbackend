import express from 'express'
import { fetchAllTradePersons, fetchByTrades } from '../Controllers/fetch.js';

const router = express.Router();

router.get('/allTradePersons',fetchAllTradePersons);
router.get('/:trade',fetchByTrades);

export default router;