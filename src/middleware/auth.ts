import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWTDecode } from '../types';
import logger from './logger';
import { Request, Response } from 'express';

const jwtSecret = 'rohith-api-app';

interface Tokens {
  access_token: string;
  refresh_token: string;
}

export function authenticateToken (req: Request, res: Response, next: any) {
  const accessToken = req.headers['authorization'];

  if (accessToken == null) {
    return res.status(401).send({ code: 401, message: 'Invalid acctess token' });
  }

  try {
    const isAccessTokenValid: string | JwtPayload = jwt.verify(accessToken, jwtSecret);
    if (isAccessTokenValid) {
      const tokenDetails = isAccessTokenValid as JWTDecode;
      req.body.user_id = tokenDetails.id;
      req.body.role = tokenDetails.role;
      logger.log({ level: 'info', message: `Access token authenticated for user ${tokenDetails.email}` });

      next();
    } else {
      return res.status(401).send({ code: 401, message: 'Invalid acctess token' });
    }
  } catch (error) {
    return res.status(401).send({ code: 401, message: 'Invalid acctess token' });
  }
}

export function authorizeUser (id: number, email: string, role: string): Tokens {
  const expiresInOneDay = 60 * 60 * 24;
  const expiresInOneWeek = 60 * 60 * 24 * 7;

  logger.log({ level: 'info', message: `Authorization token crated for user with email - ${email}` });

  return {
    access_token: jwt.sign({ id: id, email: email, role: role }, jwtSecret, { expiresIn: expiresInOneDay }),
    refresh_token: jwt.sign({ id: id, email: email, role: role }, jwtSecret, { expiresIn: expiresInOneWeek })
  };
}