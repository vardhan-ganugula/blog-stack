import { Router } from "express"; 

import { register, login, logout, verifyEmail, handleVerificationEmail } from "../controllers/auth.controller.js";

const router = Router(); 


router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/verify-email', verifyEmail)
router.get('/send-verification-email', handleVerificationEmail);
export default router;