import express from 'express'
import {  forgotPassword, login,  serviceRegistration, userRegistration } from '../Controllers/Auth.js';

const router = express.Router();

// router.post('/serviceRegistration',serviceRegistration);
router.post('/userRegistration',userRegistration);
router.post('/login',login);

router.patch('/resetPassword/:contact',forgotPassword)

export default router;