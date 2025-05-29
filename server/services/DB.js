import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
dotenv.config();

const DB_URL = process.env.DB_URL;

export const connectDB = async () => {

    if(!DB_URL){
        throw new Error('DB_URL is not defined');
    }

    try {
        await mongoose.connect(DB_URL);
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }

};