
// FIX: Imported specific types from express instead of the whole namespace.
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

// Export an AuthRequest interface for use in controllers.
// FIX: Extended the imported Request type from express.
export interface AuthRequest extends Request {
    user?: {
        id:string;
        role: string;
    }
}


export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as { id: string; role: string; iat: number; exp: number };
        
        (req as AuthRequest).user = { id: decoded.id, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export const attachUserIfAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, config.jwt.secret) as { id: string; role: string };
            (req as AuthRequest).user = { id: decoded.id, role: decoded.role };
        } catch (error) {
            // Invalid token, but we don't block. Just don't attach user.
            console.warn('Invalid token encountered for optional authentication route.');
        }
    }
    next();
};


export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};
