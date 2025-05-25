import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../constants/env';
import BadRequest from '../errors/BadRequest';

interface TokenPayload {
  userId?: string;
  sessionId?: string;
  aud?: string[];
  exp?: number;
  iat?: number;
}

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    if (!decoded.userId || !decoded.sessionId) {
      throw new BadRequest('Invalid token payload');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new BadRequest('Invalid access token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new BadRequest('Access token expired');
    }
    throw error;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    
    if (!decoded.sessionId) {
      throw new BadRequest('Invalid refresh token payload');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new BadRequest('Invalid refresh token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new BadRequest('Refresh token expired');
    }
    throw error;
  }
};

export const verifyTokenFromRequest = (req: Request): TokenPayload => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new BadRequest('No token provided');
  }

  const token = authHeader.split(' ')[1];
  return verifyAccessToken(token);
};