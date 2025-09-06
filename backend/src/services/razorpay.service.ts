

import Razorpay from 'razorpay';

// The service now just creates an instance from provided keys.
// It is no longer async and does not fetch from the database.
export const getRazorpayInstance = (keyId: string, keySecret: string): Razorpay | null => {
    if (!keyId || !keySecret) {
        console.error("Razorpay instance cannot be created without keyId and keySecret.");
        return null;
    }
    try {
        const instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        return instance;
    } catch (error) {
        console.error("Failed to initialize Razorpay:", error);
        return null;
    }
};