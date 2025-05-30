import {Router} from 'express'; 
import { getAllBlogs, handlePublishPost,handleDraftPost, getAllDrafts } from '../controllers/blog.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const app = Router(); 

app.get('/', getAllBlogs);
app.get('/drafts', authMiddleware, getAllDrafts);
app.post('/publish', authMiddleware, handlePublishPost);
app.post('/save-draft', authMiddleware, handleDraftPost);
app.get('/:blogId', (req, res) => {
    return res.json({
        "hi": "hi"
    })
});



export default app;