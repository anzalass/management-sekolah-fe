'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import BottomNav from '../bottom-nav';

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function UbahPasswordView() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    try {
      api.patch(
        `auth/ubah-password-siswa`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      toast.success('Password Berhasil diubah');
      router.push('/siswa');
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  // regex password kuat:
  // minimal 8 karakter, ada huruf besar, angka, simbol
  const passwordValidation = {
    required: 'Password wajib diisi',
    pattern: {
      value:
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{8,}$/,
      message: 'Password minimal 8 karakter, ada huruf besar, angka, dan simbol'
    }
  };

  return (
    <div className='mb-10 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4'>
      {/* Button Back */}
      <div className='mb-4 w-full max-w-md'>
        <Link href='/siswa'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Kembali
          </Button>
        </Link>
      </div>

      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader>
          <CardTitle className='text-center text-xl font-bold text-blue-600'>
            🔒 Ubah Password
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-4'>
            {/* Password Lama */}
            <div className='space-y-2'>
              <Label htmlFor='oldPassword'>Password Lama</Label>
              <div className='relative'>
                <Input
                  id='oldPassword'
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder='Masukkan password lama'
                  className='pr-10'
                  {...register('oldPassword', {
                    required: 'Password lama wajib diisi'
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
                >
                  {showOldPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className='text-sm text-red-500'>
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* Password Baru */}
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>Password Baru</Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='Masukkan password baru'
                  className='pr-10'
                  {...register('newPassword', passwordValidation)}
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
                >
                  {showNewPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className='text-sm text-red-500'>
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Konfirmasi Password Baru */}
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Konfirmasi Password Baru</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Konfirmasi password baru'
                  className='pr-10'
                  {...register('confirmPassword', {
                    required: 'Konfirmasi password wajib diisi',
                    validate: (val) =>
                      val === watch('newPassword') ||
                      'Konfirmasi password tidak sama'
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-red-500'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className='flex justify-center'>
            <Button
              type='submit'
              className='w-full bg-blue-600 text-white hover:bg-blue-700'
            >
              Simpan Perubahan
            </Button>
          </CardFooter>
        </form>
      </Card>
      <BottomNav />
    </div>
  );
}
