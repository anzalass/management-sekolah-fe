'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import GithubSignInButton from './github-auth-button';

const formSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  const onSubmit = async (data: UserFormValue) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: '/dashboard'
    });

    if (result?.error != null) {
      toast.error('Login gagal, cek email dan password anda');
      return;
    } else {
      toast.success('Login berhasil, anda akan diarahkan ke dashboard');
      startTransition(() => window.location.replace('/dashboard'));
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-5'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <div className=''>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukan Email...'
                      className='text-xs'
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <div className=''>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Masukan Password...'
                      className='text-xs'
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className='ml-auto w-full' type='submit'>
            Masuk
          </Button>
        </form>
      </Form>
    </>
  );
}
