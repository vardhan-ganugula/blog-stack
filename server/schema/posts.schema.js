import {z} from 'zod'; 

export const postSchema = z.object({
    title: z.string().min(5, { message: 'Title must be at least 5 characters long' }).optional(),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    content: z.string().min(10, { message: 'Content must be at least 10 characters long' }),
    tags: z.string().optional(),
    
})