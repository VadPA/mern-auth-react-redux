'use client';

import { Button } from '@/components/ui/button';
import { API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import { RootState } from '@/store/store';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const Verify = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.replace('/auth/signup');
    }
  }, [user, router]);

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // if (value.length === 1 && inputRefs.current[index + 1]) {
    //   console.log(inputRefs.current[index + 1]);
    //   inputRefs.current[index + 1]?.focus();
    // }
    if (value && index < otp.length) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      event.key === 'Backspace' &&
      !inputRefs.current[index]?.value &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const otpValue = otp.join('');
      const response = await axios.post(
        `${API_URL}/user/verify`,
        { otp: otpValue },
        { withCredentials: true }
      );
      const verifiedUser = response.data.data.user;
      dispatch(setAuthUser(verifiedUser));
      toast.success('Verification Successful');
      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(true);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/user/resend-otp`, null, {
        withCredentials: true,
      });
      toast.success('New Otp is send to your email.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4 font-semibold">
        Enter your email verification code here
      </h1>
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((index) => {
          return (
            <input
              type="number"
              key={index}
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className="w-20 h-20 rounded-lg bg-gray-200 text-3xl font-bold text-center no-spinner"
            />
          );
        })}
      </div>
      {!isLoading && (
        <div className="flex items-center space-x-4 mt-6">
          <Button onClick={handleSubmit} variant={'default'}>
            Submit
          </Button>
          <Button onClick={handleResendOtp} className="bg-orange-600">
            Resend OTP
          </Button>
        </div>
      )}
      {isLoading && (
        <Button className="mt-6">
          <Loader className="animate-spin" />
        </Button>
      )}
    </div>
  );
};

export default Verify;
