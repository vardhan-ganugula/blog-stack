import {Router} from 'express';
import { getUserSessions } from '../controllers/auth.controller.js';

const router = Router(); 



router.get('/profile', (req,res)=> {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(200).json({ user });
});

router.get('/sessions', getUserSessions);

export default router;