import { postSchema } from "../schema/posts.schema.js"
import BlogModel from '../models/blog.model.js';
import { uploadImage } from "../services/lib.js";

export const handlePublishPost = async (req, res) => {

    const data = req.body;
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
        const blogPost = await BlogModel.create({
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
    let imageUrl;

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
        const blogPost = await BlogModel.create({
            ...result.data,
            tags: [...new Set(JSON.parse(data.tags))],
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

