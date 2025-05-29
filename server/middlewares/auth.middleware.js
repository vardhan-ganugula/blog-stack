import { ACCESS_EXPIRES, REFRESH_EXPIRES } from "../constants/constants.js";
import sessionModel from "../models/session.model.js";
import { decodeToken, generateAccessToken, generateRefreshToken, getUserById, getUserIdBySession } from "../services/auth.service.js";

export const authMiddleware = async(req, res, next) => {
    const refreshToken = req.cookies['refresh-token'];
    const accessToken = req.cookies['access-token'];

    if (!refreshToken && !accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(accessToken && accessToken !== undefined){
        const decoded = decodeToken(accessToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { sessionId } = decoded;
        const userId = await getUserIdBySession(sessionId);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        return next();
    }
    if(refreshToken && refreshToken !== undefined) {
        const decoded = decodeToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { sessionId } = decoded;
        const userId = await getUserIdBySession(sessionId);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const session = await sessionModel.create({
            userId: user._id,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
        })

        if (!session) {
            return res.status(500).json({ message: 'Error creating session' });
        }

        const newAccessToken = generateAccessToken({
            id : user._id,
            sessionId: session._id,
            username: user.username,
            role: user.role,
        })

        const newRefreshToken = generateRefreshToken({
            id : user._id,
            sessionId: session._id,
        })

        res.cookie('access-token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: ACCESS_EXPIRES
        });

        res.cookie('refresh-token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: REFRESH_EXPIRES
        });
        req.user = user;
        next();
        
    }

    next();
}