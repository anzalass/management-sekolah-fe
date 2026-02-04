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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useTransition } from 'react';

export type GuruStaff = {
  nip: string;
  nik: string;
  jabatan: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir?: string;
  alamat: string;
  agama: string;
  jenisKelamin: string;
  noTelepon: string;
  email: string;
  status: string;
};

export default function GuruStaffForm({
  initialData,
  idGuru,
  pageTitle
}: {
  initialData: GuruStaff | null;
  idGuru: string;
  pageTitle: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, startTransition] = useTransition();

  const defaultValues: GuruStaff = {
    nip: initialData?.nip || '',
    nik: initialData?.nik || '',
    jabatan: initialData?.jabatan || '',
    nama: initialData?.nama || '',
    tempatLahir: initialData?.tempatLahir || '',
    tanggalLahir: initialData?.tanggalLahir || '',
    alamat: initialData?.alamat || '',
    agama: initialData?.agama || '',
    jenisKelamin: initialData?.jenisKelamin || '',
    noTelepon: initialData?.noTelepon || '',
    email: initialData?.email || '',
    status: initialData?.status || ''
  };

  const form = useForm<GuruStaff>({
    defaultValues
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onSubmit = (values: GuruStaff) => {
    startTransition(async () => {
      try {
        let res;
        if (idGuru !== 'new') {
          res = await api.put(`user/update-guru/${idGuru}`, values, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
        } else {
          res = await api.post('user/create-guru', values, {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
        }

        toast.success(
          idGuru !== 'new'
            ? 'Berhasil mengubah data Guru / Staff'
            : 'Berhasil menambahkan data Guru / Staff'
        );

        router.push('/dashboard/master-data/guru-staff');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Terjadi kesalahan');
      }
    });
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-xl font-bold md:text-2xl'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* NIP */}
              <FormField
                control={form.control}
                name='nip'
                rules={{ required: 'NIP wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIP</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Masukan NIP...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NIK */}
              <FormField
                control={form.control}
                name='nik'
                rules={{
                  required: 'NIK wajib diisi',
                  minLength: { value: 16, message: 'NIK harus 16 digit' },
                  maxLength: { value: 16, message: 'NIK harus 16 digit' },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'NIK hanya boleh angka'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Masukan NIK...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nama */}
              <FormField
                control={form.control}
                name='nama'
                rules={{ required: 'Nama wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Masukan Nama Lengkap...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Jabatan */}
              <FormField
                control={form.control}
                name='jabatan'
                rules={{ required: 'Jabatan wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Jabatan' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Kepala Sekolah'>
                          Kepala Sekolah
                        </SelectItem>
                        <SelectItem value='Wakil Kepala Sekolah'>
                          Wakil Kepala Sekolah
                        </SelectItem>
                        <SelectItem value='Guru Pengajar'>
                          Guru Pengajar
                        </SelectItem>
                        <SelectItem value='Tata Usaha'>Tata Usaha</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tempat Lahir */}
              <FormField
                control={form.control}
                name='tempatLahir'
                rules={{ required: 'Tempat lahir wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Masukan Tempat Lahir...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tanggalLahir'
                rules={{ required: 'Tanggal lahir wajib diisi' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        value={formatDate(field.value)}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agama */}
              <FormField
                control={form.control}
                name='agama'
                rules={{ required: 'Agama wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agama</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Agama' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Islam'>Islam</SelectItem>
                        <SelectItem value='Kristen'>Kristen</SelectItem>
                        <SelectItem value='Budha'>Budha</SelectItem>
                        <SelectItem value='Hindu'>Hindu</SelectItem>
                        <SelectItem value='Konghucu'>Konghucu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Jenis Kelamin */}
              <FormField
                control={form.control}
                name='jenisKelamin'
                rules={{ required: 'Jenis kelamin wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Jenis Kelamin' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Laki Laki'>Laki Laki</SelectItem>
                        <SelectItem value='Perempuan'>Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alamat */}
              <FormField
                control={form.control}
                name='alamat'
                rules={{ required: 'Alamat wajib diisi' }}
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Masukan alamat lengkap...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* No Telepon */}
              <FormField
                control={form.control}
                name='noTelepon'
                rules={{
                  required: 'No Telepon wajib diisi',
                  maxLength: {
                    value: 13,
                    message: 'No Telepon maksimal 13 digit'
                  },
                  minLength: {
                    value: 10,
                    message: 'No Telepon minimal 10 digit'
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'No Telepon hanya boleh angka'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Telepon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Masukan No Telepon...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name='email'
                rules={{
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Format email tidak valid'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        {...field}
                        placeholder='Masukan Email...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name='status'
                rules={{ required: 'Status wajib dipilih' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Aktif'>Aktif</SelectItem>
                        <SelectItem value='NonAktif'>Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
