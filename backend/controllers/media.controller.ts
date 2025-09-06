
import { Request, Response, NextFunction } from 'express';
// FIX: Added 'express' and 'multer' imports to make the global Express namespace available for Multer types.
import 'express';
import 'multer';
import prisma from '../prisma';
import { logAdminAction } from '../services/audit.service';
import { AuthRequest } from '../middlewares/auth.middleware';


interface CloudinaryMulterFile extends Express.Multer.File {
    originalname: string;
    path: string; // This is the secure_url from Cloudinary
    size: number;
    mimetype: string;
}

// FIX: Add explicit types for req, res, next
export const uploadAndSaveMedia = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as CloudinaryMulterFile[];
    
    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded.' });
    }

    try {
        const filesToSave = files.map(file => ({
            name: file.originalname,
            url: file.path, // This is the secure_url from Cloudinary
            size: file.size,
            type: file.mimetype.startsWith('video') ? 'video' as const : 'image' as const,
        }));
        
        await prisma.mediaFile.createMany({
            data: filesToSave,
        });
        
        await logAdminAction((req as AuthRequest), 'Uploaded media files', `Count: ${filesToSave.length}`);

        res.status(201).json({
            message: 'Files uploaded and saved successfully',
            files: filesToSave,
        });
    } catch (error) {
        next(error);
    }
};
