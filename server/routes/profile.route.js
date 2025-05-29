import {Router} from 'express';

const router = Router(); 



router.get('/profile', (req,res)=> {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(200).json({ user });
});


export default router;