import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export const registerSchema = z.object({
    name: z.string().min(5, { message: 'Name must be at least 5 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
})