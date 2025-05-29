import { ACCESS_EXPIRES, REFRESH_EXPIRES, VERIFICATION_EXPIRES } from "../constants/constants.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import userModel from "../models/user.model.js";
dotenv.config();



export const HashedPassword = async (password) => await bcrypt.hash(password, 10);
export const verificationToken = () => crypto.randomBytes(16).toString('hex');
export const verificationTokenExpires = () => Date.now() + VERIFICATION_EXPIRES;


export const comparePassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);

export const generateAccessToken = (user) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    if (!user) {
        throw new Error('User is not defined');
    }
    return jwt.sign({
        id: user._id,
        username: user.username,    
        role: user.role,
        sessionId: user.sessionId,
    }, secret, { expiresIn: ACCESS_EXPIRES });
    
}

export const generateRefreshToken = (user) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    if (!user) {
        throw new Error('User is not defined');
    }
    return jwt.sign({
        id: user._id,
        sessionId: user.sessionId,
    }, secret, { expiresIn: REFRESH_EXPIRES });
}

export const decodeToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    if (!token) {
        throw new Error('Token is not defined');
    }
    try {
        const details =  jwt.verify(token, secret);
        return details;
    } catch (error) {
        return null;
    }
}

export const getUserIdBySession = async (sessionId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }
    if (!sessionId) {
        throw new Error('Session ID is not defined');
    }
    try {
        const userDetails = await sessionModel.findOne({_id: sessionId, valid: true}); 
        if(!userDetails) return null;
        return userDetails.userId.toString(); 
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getUserById = async(userId) => {
    if(!userId) {
        throw new Error('User ID is not defined');
    }
    try {
        const user = await userModel.findOne({_id: userId});
        if(!user) return null;
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}