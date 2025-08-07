'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import { RootState } from "@/store/store";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const HomePage = () => {
  const user = useSelector((state: RootState)=> state.auth.user);
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    await axios.post(`${API_URL}/user/logout`);
    dispatch(setAuthUser(null));
    toast.success('Logout successful');
  }
  return (
    <>
      <div className="h-[12vh] shadow-md">
        <div className="w-[80%] mx-auto flex items-center justify-between h-full">
          <h1 className="text-3xl font-bold uppercase">Logo</h1>
          {!user && (<Link href='/auth/signup'>
            <Button size={'lg'}>Register</Button>
          </Link>)}
          {user && (
            <div className="flex items-center space-x-2">
              <Avatar onClick={logoutHandler} className="cursor-pointer">
                <AvatarFallback className="font-bold uppercase">{user.name.split('')[0]}</AvatarFallback>
              </Avatar>
              <Button>Dashboard</Button>
              <Button variant={'ghost'} size={'sm'}>
                {user.isVerified ? 'Verified' : 'Not Verified'}
              </Button>
            </div>
          )}
        </div>
        <h1 className="flex items-center justify-center h-[80vh] text-5xl font-bold">
          Home Page
        </h1>
      </div>
    </>
  )
}

export default HomePage;