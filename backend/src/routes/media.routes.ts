


import express, { RequestHandler } from 'express';
import { uploadAndSaveMedia } from '../controllers/media.controller';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware';
import upload from '../services/cloudinary';

const router = express.Router();

// This single route handles multi-file uploads directly to Cloudinary and saves metadata to DB.
// It accepts up to 10 files in a field named 'files'.
router.post('/upload', isAuthenticated as RequestHandler, isAdmin as RequestHandler, upload.array('files', 10), uploadAndSaveMedia as RequestHandler);


export default router;