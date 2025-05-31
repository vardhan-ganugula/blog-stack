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
    

    let imageUrl = '';
    if (data.image) {
        try {
            imageUrl = await uploadImage(data.image);
        } catch (error) {
            console.error('Image upload error:', error);
            return res.status(500).json({
                message: 'Unable to upload image',
                status: false
            });
        }
    }

    try {
        // Check for existing slug
        const existingPost = await BlogModel.findOne({ slug });
        if (existingPost) {
            slug = `${slug}-${Date.now()}`;
        }


        let tags = [];
        try {
            tags = data.tags ? [...new Set(JSON.parse(data.tags))] : [];
        } catch (parseError) {
            tags = [];
        }

        const updateData = {
            ...result.data,
            tags,
            slug,
            imageUrl,
            status: 'published',
            author: req.user.username,
            publishedAt: new Date()
        };

        let blogPost;
        if (data.draftId) {

            blogPost = await BlogModel.findOneAndUpdate(
                { draftId: data.draftId },
                updateData,
                { new: true, upsert: false }
            );
        }


        if (!blogPost) {
            delete updateData.draftId; // Remove draftId for published posts
            blogPost = await BlogModel.create(updateData);
        }

        return res.status(200).json({
            message: "Post published successfully",
            data: blogPost
        });

    } catch (error) {
        console.error("Error publishing blog post:", error);
        return res.status(500).json({
            error: "Internal server error while publishing blog post"
        });
    }
}

export const handleDraftPost = async (req, res) => {
    const data = req.body;
    

    if (!data.draftId) {
        return res.status(400).json({
            error: "Draft ID is required"
        });
    }


    let imageUrl = '';
    if (data.image) {
        try {
            imageUrl = await uploadImage(data.image);
        } catch (error) {
            console.error('Image upload error:', error);
            return res.status(500).json({
                message: 'Unable to upload image',
                status: false
            });
        }
    }


    let tags = [];
    try {
        tags = data.tags ? [...new Set(JSON.parse(data.tags))] : [];
    } catch (parseError) {
        tags = [];
    }

    const draftData = {
        title: data.title || '',
        content: data.content || '',
        description: data.description || '',
        tags,
        slug: data.draftId, 
        imageUrl,
        status: 'draft',
        author: req.user.username,
        draftId: data.draftId
    };

    try {
        const existingDraft = await BlogModel.findOneAndUpdate(
            { draftId: data.draftId },
            draftData,
            { new: true, upsert: false }
        );

        if (existingDraft) {
            return res.status(200).json({
                message: "Draft updated successfully",
                data: existingDraft
            });
        }

        const newDraft = await BlogModel.create(draftData);
        
        return res.status(200).json({
            message: "Draft saved successfully",
            data: newDraft
        });

    } catch (error) {
        console.error("Error saving draft:", error);
        return res.status(500).json({
            error: "Internal server error while saving draft"
        });
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find({ status: 'published' })
            .sort({ publishedAt: -1, createdAt: -1 })
            .select('-draftId'); 
        
        return res.status(200).json({
            status: true,
            data: blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return res.status(500).json({
            status: false,
            message: 'Failed to load blogs'
        });
    }
}

export const getAllDrafts = async (req, res) => {
    try {
        const drafts = await BlogModel.find({ 
            status: 'draft', 
            author: req.user.username 
        }).sort({ updatedAt: -1, createdAt: -1 });
        
        return res.status(200).json({
            status: true,
            data: drafts
        });
    } catch (error) {
        console.error('Error fetching drafts:', error);
        return res.status(500).json({
            status: false,
            message: 'Failed to load drafts'
        });
    }
}

export const deleteDraft = async (req, res) => {
    const { draftId } = req.params;
    
    try {
        const deletedDraft = await BlogModel.findOneAndDelete({
            draftId,
            author: req.user.username,
            status: 'draft'
        });

        if (!deletedDraft) {
            return res.status(404).json({
                status: false,
                message: 'Draft not found'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Draft deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting draft:', error);
        return res.status(500).json({
            status: false,
            message: 'Failed to delete draft'
        });
    }
}