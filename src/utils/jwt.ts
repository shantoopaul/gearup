import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
    userId: string;
    role: string;
}

export const generateToken = (
    payload: JwtPayload,
    secret: string,
    expiresIn: SignOptions['expiresIn']
): string => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
};