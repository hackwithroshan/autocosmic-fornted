
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import { createStorage } from './cloudinary.storage';

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
    cloudinary.config({
        cloud_name: config.cloudinary.cloudName,
        api_key: config.cloudinary.apiKey,
        api_secret: config.cloudinary.apiSecret,
    });
} else {
    console.warn("Cloudinary configuration is incomplete. Media uploads will fail. Please check your .env file.");
}


const storage = createStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zaina-collection',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'mov'],
    resource_type: 'auto'
  },
});

const upload = multer({ storage: storage });

export default upload;