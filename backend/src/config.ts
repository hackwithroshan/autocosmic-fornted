import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    },
    phonepe: {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        saltKey: process.env.PHONEPE_SALT_KEY,
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    gcs: {
        bucketName: process.env.GCS_BUCKET_NAME,
    }
};

export default config;
