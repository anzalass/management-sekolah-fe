'use client';

import React, { startTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

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
      <Card className='w-full max-w-md rounded-2xl shadow-lg'>
        <CardHeader className='space-y-2 text-center'>
          <CardTitle className='text-2xl font-bold text-blue-700'>
            Login Siswa
          </CardTitle>
          <p className='text-sm text-gray-500'>
            Masukkan NIS dan password untuk melanjutkan
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* NIS */}
            <div className='space-y-2'>
              <Label htmlFor='nis'>NIS</Label>
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
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Masukkan password'
                className='focus-visible:ring-blue-500'
                {...register('password', { required: 'Password wajib diisi' })}
              />
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
              className='w-full rounded-lg bg-blue-600 py-2 font-semibold text-white shadow hover:bg-blue-700'
            >
              {isSubmitting ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
