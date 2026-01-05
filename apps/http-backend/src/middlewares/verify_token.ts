import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '@repo/backend-common/config';

export function verifyToken(req:Request, res:Response, next:NextFunction) {
    const token = req.headers['authorization'] ?? "";
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    if(decoded && typeof decoded !== 'string' ){
        req.body.userId = decoded.userId;
        next();
    }else{
        return res.status(401).json({ message: 'Unauthorized' });
    }

}