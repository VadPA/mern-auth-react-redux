'use client';

import { Button } from '@/components/ui/button';
import { API_URL } from '@/server';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/user/forgot-password`, {email}, {withCredentials: true});
      toast.success('Reset code send to your email');
      router.push(`/auth/resetpassword?email=${encodeURIComponent(email)}`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-xl text-gray-900 mb-4 font-medium">
        Enter your email to get code for reset password
      </h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-[40%] mb-4 mx-auto rounded-lg bg-gray-300 px-4 py-3"
      />
      {!isLoading && <Button onClick={handleSubmit}>Submit</Button>}
      {isLoading && (
        <Button>
          <Loader className="animate-spin" />
        </Button>
      )}
    </div>
  );
};

export default ForgotPassword;
