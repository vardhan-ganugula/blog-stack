import { postSchema } from "../schema/posts.schema.js"
import BlogModel from '../models/blog.model.js';
import { uploadImage } from "../services/lib.js";

export const handlePublishPost = async (req, res) => {

    const data = req.body;
    // console.log(draftId)
    const result = postSchema.safeParse(data);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.errors.map(err => err.message)
        });
    }
    let slug = result.data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    let imageUrl;
    try {
        const url = await uploadImage(data.image);
        imageUrl = url;
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'unable to upload image',
            status: false
        })
    }

    try {
        const existingPost = await BlogModel.findOne({ slug });
        if (existingPost) {
            slug = `${slug}-${Date.now()}`;
        }

    } catch (error) {
        return res.status(500).json({
            error: "Internal server error while checking for existing post"
        });
    }

    try {
        const blogPost = await BlogModel.updateOne({draftId: data.draftId}, {
            ...result.data,
            tags: [...new Set(JSON.parse(data.tags))],
            slug,
            imageUrl,
            status: 'published',
            author: req.user.username
        });
        if (!blogPost) {
            return res.status(500).json({
                error: "Failed to create blog post"
            });
        }
        return res.status(200).json({
            message: "post created successfully",
            data: blogPost
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return res.status(500).json({
            error: "Internal server error while creating blog post"
        });
    }



}

export const handleDraftPost = async (req, res) => {

    const data = req.body;
    let slug = Date.now();
    let imageUrl = '';

    if (data.image) {
        try {
            const url = await uploadImage(data.image);
            imageUrl = url;
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'unable to upload image',
                status: false
            })
        }
    }

    try {
        const existingPost = await BlogModel.findOne({ draftId: data.draftId }); 
        if(existingPost){
            const newPost = await BlogModel.updateOne({
                draftId: data.draftId
            }, {
                title: data.title || '',
                content: data.content || '',
                description: data.description || '',
                tags: [...new Set(JSON.parse(data.tags))],
                slug,
                imageUrl,
                status: 'draft',
                author: req.user.username

            })


            return res.status(200).json({
                message: "draft updated successfully",
                data: newPost
            });
        }
    } catch (error) {
        
    }
    
    try {
        const blogPost = await BlogModel.create({
            title: data.title || '',
            content: data.content || '',
            description: data.description || '',
            tags: [...new Set(JSON.parse(data.tags))],
            draftId: data.draftId,
            slug,
            imageUrl,
            status: 'draft',
            author: req.user.username
        });
        if (!blogPost) {
            return res.status(500).json({
                error: "Failed to draft blog post"
            });
        }
        return res.status(200).json({
            message: "draft saved successfully",
            data: blogPost
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return res.status(500).json({
            error: "Internal server error while creating blog post"
        });
    }



}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find({ status: 'published' }).sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            data: blogs
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: 'failed to load blogs'
        }).status(500)
    }
}

export const getAllDrafts = async (req, res) => {
    console.log('hi')
    try {
        const drafts = await BlogModel.find({ status: 'draft', author: req.user.username }).sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            data: drafts
        })
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: 'failed to load drafts'
        }).status(500)
    }
}