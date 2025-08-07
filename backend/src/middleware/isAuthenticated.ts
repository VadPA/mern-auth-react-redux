import { Request, Response, NextFunction } from 'express';
import { catchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from '../utils/ErrorHandler';
import jwt, { Secret } from 'jsonwebtoken';
import userModel from '../models/user.model';

export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    // console.log('token: ', token);
    // console.log('req.cookies: ', req.cookies);
    // console.log('req.headers.authorization: ', req.headers.authorization);

    if(!token) {
      return next(new ErrorHandler('You are not signup. Please login to access', 401));
    }

    try {
      const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY || 'fghfdghjssghfhnghdgjfgh';
      const decoded = jwt.verify(token, SECRET_KEY);
      // console.log('decoded: ', decoded);
      if (typeof decoded !== 'object' || !decoded.id) {
        res.status(401).json({ error: 'Access denied' });
        return;
      }
      const currentUser = await userModel.findById(decoded.id);
      if(!currentUser) {
        return next(new ErrorHandler('The user belonging to this token does not exist', 401));
      }
      // console.log('currentUser: ', currentUser);
      req.user = currentUser;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Access denied' });
    }
  }
);