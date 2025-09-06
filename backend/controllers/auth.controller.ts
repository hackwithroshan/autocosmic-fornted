
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../prisma';
import config from '../config';

const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (password.length < 8) {
        errors.push('Must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Must contain at least one number.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Must contain at least one special character.');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // --- Input Validation ---
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ message: 'Password is not strong enough.', errors: passwordValidation.errors });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    // --- End Validation ---

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Ensure role is uppercase for consistency
        const userRole = user.role.toUpperCase();

        const options: SignOptions = { expiresIn: config.jwt.expiresIn };
        const token = jwt.sign(
            { id: user.id, role: userRole },
            config.jwt.secret,
            options
        );
        
        const { password: _, ...userResponse } = user;

        res.json({ token, user: { ...userResponse, role: userRole } });
    } catch (error) {
        next(error);
    }
};
