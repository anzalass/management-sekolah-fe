'use client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Tipe Data Pendaftaran
export type Pendaftaran = {
  studentName: string;
  parentName: string;
  kategori: string;
  email: string;
  phoneNumber: string;
  yourLocation: string;
};

export default function PendaftaranForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Pendaftaran | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;

  const defaultValue = {
    studentName: initialData?.studentName || '',
    kategori: initialData?.kategori || '',
    parentName: initialData?.parentName || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    yourLocation: initialData?.yourLocation || ''
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        // Kirim sebagai JSON, tidak perlu FormData
        const jsonData = {
          studentName: values.studentName,
          parentName: values.parentName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          yourLocation: values.yourLocation,
          kategori: values.kategori
        };

        if (id !== 'new') {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}pendaftaran/update/${id}`,
            jsonData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          toast.success('Pendaftaran berhasil diperbarui');
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}pendaftaran/`,
            jsonData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          toast.success('Pendaftaran berhasil disimpan');
        }

        router.push('/dashboard/pendaftaran');
      } catch (error) {
        const axiosError = error as any;
        const errorMessage =
          axiosError.response?.data?.message || 'Terjadi Kesalahan';
        toast.error(errorMessage);
      }
    });
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Student Name */}
                <FormItem>
                  <FormLabel>Nama Peserta Didik</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Nama Peserta Didik...'
                      {...form.register('studentName', {
                        required: 'Nama Peserta Didik wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.studentName?.message}
                  </FormMessage>
                </FormItem>

                {/* Parent Name */}
                <FormItem>
                  <FormLabel>Nama Wali Murid</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Orang Tua...'
                      {...form.register('parentName', {
                        required: 'Nama Orang Tua wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.parentName?.message}
                  </FormMessage>
                </FormItem>

                <FormField
                  control={form.control}
                  name='kategori'
                  rules={{ required: 'Jenis Kelas wajib dipilih' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pilih Jenis Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih Jenis Kelas' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='LAC'>
                            Little Alley Cyberschool
                          </SelectItem>
                          <SelectItem value='LAP'>
                            Little Alley Preschool
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.kategori?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Email...'
                      {...form.register('email', {
                        required: 'Email wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>

                {/* Phone Number */}
                <FormItem>
                  <FormLabel>No Telepon</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan No Telepon...'
                      {...form.register('phoneNumber', {
                        required: 'No telepon wajib diisi',
                        pattern: {
                          value: /^[0-9]{10,13}$/,
                          message: 'No telepon harus 10-13 digit angka'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.phoneNumber?.message}
                  </FormMessage>
                </FormItem>

                {/* Location */}
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Alamat...'
                      {...form.register('yourLocation', {
                        required: 'Alamat wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.yourLocation?.message}
                  </FormMessage>
                </FormItem>
              </div>
            </div>

            {/* Submit Button */}
            <Button type='submit' disabled={loading}>
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                'Simpan'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
