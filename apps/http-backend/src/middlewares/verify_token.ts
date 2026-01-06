import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '@repo/backend-common/config';

export function verifyToken(req:Request, res:Response, next:NextFunction) {
    try {
        
        const token = req.headers['authorization'] ?? "";
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded && typeof decoded !== 'string' ){
            req.userId = decoded.userId;
            console.log("done");
            next();
        }else{
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.log("Error:Verify token::",error);
        res.status(404).json({message:"Token not found"})
    }

}