import { Document} from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  phone?: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role?: string;
  isVerified?: boolean;
  otp?: string;
  otpExpires: number;
  resetOtp?: string;
  resetOTPExpires: number;
  verificationCode?: number;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
  createdAt: Date;
}
