'use client';

import { Button } from '@/components/ui/button';
import { API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/signup`, formData, {
        withCredentials: true,
      });
      const user = response.data.data.user;
      toast.success('Signup successful');
      dispatch(setAuthUser(user));
      router.push('/auth/verify');
      // console.log('user: ', user);
      // console.log('response.data.token: ', response.data.token);
      // console.log('response.data.data: ', response.data.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="shadow-md rounded-lg w-[80%] sm:w-[350px] md:w-[350px] lg:w-[450px] p-8 bg-white">
        <h1 className="text-center font-bold text-3xl mb-4">Logo</h1>
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-bold">
              Username
            </label>
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-200 rounded-md outline-none w-full"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="block mb-2 text-sm font-bold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-200 rounded-md outline-none w-full"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block mb-2 text-sm font-bold">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-200 rounded-md outline-none w-full"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="passwordConfirm"
              className="block mb-2 text-sm font-bold"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-200 rounded-md outline-none w-full"
            />
          </div>
          {!loading && (
            <Button type="submit" className="mt-6 w-full" size={'lg'}>
              Submit
            </Button>
          )}
          {loading && (
            <Button className="mt-6 w-full" size={'lg'}>
              <Loader className="animate-spin" />
            </Button>
          )}
        </form>
        <h1 className="mt-6 text-center">
          Already have account?{' '}
          <Link href="/auth/login">
            <span className="text-blue-600 cursor-pointer">Login</span>
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Signup;
