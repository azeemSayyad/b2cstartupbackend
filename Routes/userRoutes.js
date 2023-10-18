import express from 'express'
import { fetchAllServiceProviders,  fetchAllUsers, fetchByService, updateServiceProvider,  } from '../Controllers/user.js';
import { verifyToken } from '../Middleware/auth.js';

const router = express.Router();

// Get Routes
router.get('/getUsers',fetchAllUsers);
router.get('/getServiceProviders',fetchAllServiceProviders);
router.get('/get/:service',fetchByService);

// update Routes
router.put('/updateDetails/:serviceProvider_id',verifyToken,updateServiceProvider)

export default router;