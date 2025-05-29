import {z} from 'zod'; 


export const postSchema = z.object({
    title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    content: z.string().min(10, { message: 'Content must be at least 10 characters long' }),
    tags: z.string().optional(),
    image: z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, {
        message: 'Image size must be less than 10MB',
    }).refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
    message: 'Image must be in JPEG, PNG, or WEBP format',
    }),
})