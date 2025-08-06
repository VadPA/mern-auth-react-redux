import jwt, { Secret } from 'jsonwebtoken';
import { Response, CookieOptions } from 'express';
import { StringValue } from 'ms';

import { IUser } from '../types/userInterface';

export const signToken = (id) => {
  const JWT_SECRET: Secret = process.env.JWT_SECRET_KEY || 'hysjuteb__28437';
  // const EXPIRE = process.env.JWT_EXPIRES as any || '30d';
  // const EXPIRE: string | StringValue = process.env.JWT_EXPIRES || '30d';
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '2 days',
  });
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response,
  message: string
) => {
  const token = signToken(user._id);

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES as string)
    ),
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // only secure in production
    // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
  };

  // console.log('cookieOptions: ', cookieOptions);
  // console.log('token: ', token);
  // console.log('res.cookie: ', res.cookie);
  res.cookie('token', token, cookieOptions);
  user.password = '';
  user.passwordConfirm = '';
  user.otp = '';

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user,
    },
  });
};
