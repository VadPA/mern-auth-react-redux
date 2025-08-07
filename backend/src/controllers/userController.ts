import e, { Request, Response, NextFunction, CookieOptions } from 'express';

import userModel from '../models/user.model';
import { catchAsyncError } from '../utils/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import { generateOtp } from '../utils/generateOtp';
import { sendEmail } from '../utils/sendEmail';
import { createSendToken } from '../utils/token';
import { IUser } from '../types/userInterface';

// sign up user
interface ISignupBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// signup
export const signup = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, passwordConfirm, name } = req.body;
      console.log('email', email);
      console.log('password', password);
      console.log('passwordConfirm', passwordConfirm);
      console.log('name', name);

      const isExistingUser = await userModel.findOne({ email });

      if (isExistingUser)
        return next(new ErrorHandler('Email already exist', 400));

      const otp = generateOtp();
      const otpExpires = Date.now() + 24 * 60 * 60 * 1000;

      const newUser = await userModel.create({
        name,
        email,
        password,
        passwordConfirm,
        otp,
        otpExpires: otpExpires,
      });

      const data = { user: { name: newUser.name }, otp };
      try {
        await sendEmail({
          email: newUser.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data,
        });

        createSendToken(
          newUser,
          201,
          res,
          `Please check your email: ${newUser.email} to activate your account!`
        );
      } catch (error) {
        await userModel.findByIdAndDelete(newUser.id);
        return next(
          new ErrorHandler(
            'There is an error sending the email. Try again.',
            500
          )
        );
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// verification
export const verifyAccount = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp } = req.body;
      // console.log('otp', otp);
      if (!otp) {
        return next(new ErrorHandler('Otp is missing', 400));
      }
      // console.log('otp', otp);
      // console.log('req.user', req.user);
      const user: IUser | undefined = req.user;
      if (user) {
        if (user.otp !== otp) {
          return next(new ErrorHandler('Invalid OTP', 400));
        }
        if (Date.now() > +user.otpExpires) {
          return next(
            new ErrorHandler('Otp has expired. Please request a new OTP', 400)
          );
        }
        user.isVerified = true;
        user.otp = '';
        user.otpExpires = 0;

        await user.save({ validateBeforeSave: false });
        createSendToken(user, 200, res, 'Email has been verified');
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// resend OTP
export const resendOTP = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const { email } = req.user;
      if (!email) {
        return next(new ErrorHandler('Email is required to resend otp', 400));
      }
      const user = await userModel.findOne({ email });
      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }
      if (user.isVerified) {
        return next(new ErrorHandler('This account is already verified', 400));
      }
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpires = Date.now() + 24 * 60 * 60 * 1000;

      await user.save({ validateBeforeSave: false });

      const data = { user: { name: user.name }, otp: otp };
      console.log(user.email);

      try {
        await sendEmail({
          email: user.email,
          subject: 'Resend otp for email verification',
          template: 'activation-mail.ejs',
          data,
        });

        res.status(200).json({
          status: 'success',
          message: 'A new otp has sent to your email',
        });
      } catch (error) {
        user.otp = undefined;
        user.otpExpires = 0;
        await user.save({ validateBeforeSave: false });
        return next(
          new ErrorHandler(
            'There is an error sending the email! Please try again',
            500
          )
        );
      }
    }
  }
);

// Login function
export const login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler('Please provide email and password', 400));
    }
    const user = await userModel.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ErrorHandler('Incorrect Email or password', 401));
    }
    createSendToken(user, 200, res, 'Login Successful');
  }
);

// Logout function 
export const logout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }
);

// forgot password
export const forgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ErrorHandler('No user found', 404));
    }
    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOTPExpires = Date.now() + 5 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    const data = { user: { name: user.name }, otp: otp };

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password Reset OTP (valid for 5 min)',
        template: 'resetOtp-mail.ejs',
        data,
      });
      res.status(200).json({
        status: 'success',
        message: 'Password reset otp is send to your email',
      });
    } catch (error) {
      user.resetOtp = undefined;
      user.resetOTPExpires = 0;
      await user.save({ validateBeforeSave: false });
      return next(
        new ErrorHandler(
          'There was an error sending the email. Please try again later.',
          500
        )
      );
    }
  }
);

// reset password
export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, password, passwordConfirm } = req.body;
    console.log(email);
    console.log(otp);
    console.log(password);
    const user = await userModel.findOne({
      email,
      resetOtp: otp,
      resetOTPExpires: { $gt: Date.now() },
    });
    if (!user) return next(new ErrorHandler('No user found', 400));
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.resetOtp = undefined;
    user.resetOTPExpires = 0;
    await user.save();
    createSendToken(user, 200, res, 'Password reset successfully');
  }
);
