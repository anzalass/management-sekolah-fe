'use client';

import React, { useState, startTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

type UserFormValue = {
  nis: string;
  password: string;
};

export default function SignSiswaView() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserFormValue>();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: UserFormValue) => {
    const result = await signIn('credentials', {
      nip: data.nis,
      password: data.password,
      type: 'Siswa',
      redirect: false,
      callbackUrl: '/siswa'
    });

    if (result?.error) {
      toast.error('Login gagal, cek NIS dan password Anda');
    } else {
      toast.success('Login berhasil, Anda akan diarahkan ke dashboard');
      startTransition(() => window.location.replace('/siswa'));
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4'>
      <div className='w-full max-w-md rounded-2xl'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-2xl font-bold text-blue-700'>
            Little Alley Apps
          </CardTitle>
          <p className='text-sm text-gray-500'>
            Every Childs Is A World Possibilities
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* NIS */}
            <div className='space-y-2'>
              <Label className='font-bold text-black' htmlFor='nis'>
                NIS
              </Label>
              <Input
                id='nis'
                type='text'
                placeholder='Masukkan NIS'
                className='focus-visible:ring-blue-500'
                {...register('nis', { required: 'NIS wajib diisi' })}
              />
              {errors.nis && (
                <p className='text-sm text-red-500'>{errors.nis.message}</p>
              )}
            </div>

            {/* Password */}
            <div className='relative space-y-2'>
              <Label className='font-bold text-black' htmlFor='password'>
                Password
              </Label>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Masukkan password'
                className='pr-10 focus-visible:ring-blue-500'
                {...register('password', { required: 'Password wajib diisi' })}
              />
              <div
                className='absolute right-3 top-[38px] cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full rounded-full bg-blue-600 py-2 font-semibold text-white shadow hover:bg-blue-700'
            >
              {isSubmitting ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
