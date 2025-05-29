import {Schema, model} from 'mongoose'; 


const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    imageUrl: {
        type: String,
        default: null
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status : {
        type: String,
        enum : ['draft', 'published'],
        default: 'draft'
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Blog = model('Blog', blogSchema);
export default Blog;