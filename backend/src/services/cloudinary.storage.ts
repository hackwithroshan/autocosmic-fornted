
import { v2 as cloudinary } from 'cloudinary';
import { StorageEngine } from 'multer';
import { Request } from 'express';
import 'multer';
import config from '../config';

// Define a type for Cloudinary upload results to avoid using 'any'
interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    bytes: number;
    [key: string]: any;
}

interface CloudinaryStorageOptions {
  cloudinary: typeof cloudinary;
  params: {
    folder: string;
    allowed_formats?: string[];
    resource_type?: 'auto' | 'image' | 'video';
    [key: string]: any;
  };
}

class CustomCloudinaryStorage implements StorageEngine {
  private cloudinary: typeof cloudinary;
  private params: any;

  constructor(opts: CloudinaryStorageOptions) {
    this.cloudinary = opts.cloudinary;
    this.params = opts.params;
  }

  _handleFile(req: Request, file: any, callback: (error?: any, file?: Partial<any & { filename: string, path: string }>) => void): void {
    const uploadStream = this.cloudinary.uploader.upload_stream(
      {
        folder: this.params.folder,
        allowed_formats: this.params.allowed_formats,
        resource_type: this.params.resource_type || "auto"
      },
      (error, result) => {
        if (error) {
          return callback(error);
        }
        
        const cloudinaryResult = result as CloudinaryUploadResult;

        if (!cloudinaryResult) {
            return callback(new Error('Cloudinary upload failed with no result.'));
        }

        // Multer expects `path` and `filename`. We'll map Cloudinary's response to them.
        callback(null, {
          path: cloudinaryResult.secure_url,
          filename: cloudinaryResult.public_id,
          size: cloudinaryResult.bytes,
        });
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(req: Request, file: any, callback: (error: Error | null) => void): void {
    // Multer's file object will have the `filename` we provided in `_handleFile`, which is the public_id
    if (file.filename) {
        this.cloudinary.uploader.destroy(file.filename, (error, result) => {
            if (error) {
                return callback(error);
            }
            callback(null);
        });
    } else {
        callback(new Error('No file filename provided to remove.'));
    }
  }
}

// FIX: Add and export the createStorage function
export function createStorage(opts: CloudinaryStorageOptions): CustomCloudinaryStorage {
  return new CustomCloudinaryStorage(opts);
}
