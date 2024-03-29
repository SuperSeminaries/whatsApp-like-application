import Router from 'express';
import { createUserAndSendOTP, resendOtp, verifyOTP } from '../controllers/user.controllers.js';

const router = Router()

// /----- Authentication Routes: -----/

router.route('/register').post(createUserAndSendOTP)
router.route('/login').post(verifyOTP)
router.route('/resend').post(resendOtp)


export default router