
import prisma from '../prisma';
import { Request } from 'express';
// FIX: Corrected import path.
import { AuthRequest } from '../middlewares/auth.middleware';

export const logAdminAction = async (
    // FIX: Change signature to use Request and cast internally to resolve type issues.
    req: Request,
    action: string,
    details?: string
) => {
    // FIX: Cast to AuthRequest here to access the user property.
    const authReq = req as AuthRequest;
    if (!authReq.user) {
        console.warn('Attempted to log an action without an authenticated user.');
        return;
    }
    
    try {
        await prisma.adminActivityLog.create({
            data: {
                adminUserId: authReq.user.id,
                adminUserName: (await prisma.user.findUnique({ where: { id: authReq.user.id } }))?.name || 'Unknown Admin',
                action,
                details,
                // FIX: Use ip from the original req object.
                ipAddress: req.ip,
            },
        });
    } catch (error) {
        console.error('Failed to create admin activity log:', error);
    }
};
