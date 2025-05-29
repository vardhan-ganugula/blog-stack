import {Router} from 'express'; 
import { getAllBlogs, handlePublishPost } from '../controllers/blog.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const app = Router(); 

app.get('/', getAllBlogs);
app.get('/:blogId', (req, res) => {
    return res.json({
        "hi": "hi"
    })
});
app.post('/publish', authMiddleware, handlePublishPost);
app.post('/save-draft', authMiddleware, handlePublishPost);


export default app;