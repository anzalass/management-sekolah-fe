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
import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  nip: z.string().nonempty({ message: 'NIP wajib diisi' }), // ✅ required
  password: z.string().nonempty({ message: 'Password wajib diisi' }) // ✅ required
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nip: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    const result = await signIn('credentials', {
      nip: data.nip,
      password: data.password,
      type: 'Guru',
      redirect: false,
      callbackUrl: callbackUrl || '/mengajar'
    });

    if (result?.error != null) {
      toast.error('Login gagal, cek NIP dan password Anda');
    } else {
      toast.success('Login berhasil, Anda akan diarahkan ke dashboard');
      startTransition(() => window.location.replace('/mengajar'));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='relative w-full space-y-5'
      >
        <FormField
          control={form.control}
          name='nip'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Masukan NIP...'
                  className='text-xs'
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative space-y-3'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Masukan Password...'
                  className='pr-10 text-xs'
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <div
                className='absolute right-3 top-[38px] cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
  );
}
