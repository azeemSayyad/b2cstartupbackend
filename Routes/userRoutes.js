import express from 'express'
import { addToSave, deleteService, fetchAllServiceProviders,  fetchAllUsers, fetchByService, removeFromSave, updateName, updateServiceProvider,  } from '../Controllers/user.js';
import { verifyToken } from '../Middleware/auth.js';

const router = express.Router();

// Get Routes
router.get('/getUsers',fetchAllUsers);
router.get('/getServiceProviders',fetchAllServiceProviders);
router.get('/get/:service',fetchByService);



// update Routes
router.put('/updateDetails/:serviceProvider_id',updateServiceProvider)
router.patch('/updateName/:user_id',updateName)
router.patch('/addToSave/:user_id',addToSave)
router.patch('/removeFromSave/:user_id',removeFromSave)

//Delete
router.post("/deleteService/:service_id",deleteService);

export default router;