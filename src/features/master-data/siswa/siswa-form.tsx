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

import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';

// Tipe Data Siswa
export type Siswa = {
  nis: string;
  nik: string;
  nama: string;
  jurusan: string;
  tempatLahir: string;
  tanggalLahir: string;
  namaAyah: string;
  namaIbu: string;
  tahunLulus: string;
  kelas: string;
  alamat: string;
  agama: string;
  jenisKelamin: string;
  noTelepon: string;
  email: string;
  noTeleponOrtu: string;
  ekstraKulikulerPeminatan: string;
  ekstraKulikulerWajib: string;
  foto?: string;
};

export default function SiswaForm({
  initialData,
  nis,
  pageTitle
}: {
  initialData: Siswa | null;
  nis: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [masterKelas, setMasterKelas] = useState<any[]>([]);
  const [fotoUrl, setFotoUrl] = useState<string | null>(
    initialData?.foto ?? null
  );
  const [img, setImg] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Default Values dengan Fallback
  const defaultValue = {
    nis: initialData?.nis ?? '',
    nik: initialData?.nik ?? '',
    nama: initialData?.nama ?? '',
    kelas: initialData?.kelas ?? '',
    jurusan: initialData?.jurusan ?? '',
    tempatLahir: initialData?.tempatLahir ?? '',
    tanggalLahir: initialData?.tanggalLahir
      ? new Date(initialData.tanggalLahir).toISOString().split('T')[0]
      : null,
    namaAyah: initialData?.namaAyah ?? '',
    namaIbu: initialData?.namaIbu ?? '',
    tahunLulus: initialData?.tahunLulus ?? '',
    alamat: initialData?.alamat ?? '',
    agama: initialData?.agama ?? '',
    jenisKelamin: initialData?.jenisKelamin ?? '',
    noTelepon: initialData?.noTelepon ?? '',
    email: initialData?.email ?? '',
    noTeleponOrtu: initialData?.noTeleponOrtu ?? '',
    ekstraKulikulerPeminatan: initialData?.ekstraKulikulerPeminatan ?? '',
    ekstraKulikulerWajib: initialData?.ekstraKulikulerWajib ?? '',
    foto: initialData?.foto ?? null
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
      setImg(file);
    }
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  useEffect(() => {
    const getListKelas = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}list-kelas`
        );
        setMasterKelas(response.data.data);
      } catch (error) {
        toast.error('Gagal mendapatkan kelas');
      }
    };
    getListKelas();
  }, []);

  // Handle Submit
  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        const data = new FormData();
        if (img) {
          data.append('foto', img);
        }

        if (nis !== 'new') {
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}user/update-siswa/${nis}`,
            { ...values, foto: img },
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          toast.success('Data siswa berhasil diubah');
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}user/create-siswa`,
            {
              ...values,
              foto: img
            },
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          toast.success('Data siswa berhasil disimpan');
        }

        router.push('/dashboard/master-data/siswa');
      } catch (error) {
        toast.error('Gagal');
      }
    });
  }

  // Handle File Upload
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
              {/* Foto */}
              <FormItem>
                <FormLabel>Foto {'Maksimal 4 Mb'}</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/png, image/jpeg, image/jpg'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error('Ukuran file maksimal 5 MB!');
                          e.target.value = ''; // reset input
                          return;
                        }
                        handleFileChange(e);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {imagePreview ? (
                <Image
                  src={imagePreview ?? null}
                  alt='Uploaded Preview'
                  width={200}
                  height={200}
                  objectFit='contain'
                />
              ) : fotoUrl ? (
                <Image
                  src={fotoUrl ?? null}
                  alt='Uploaded Preview'
                  width={200}
                  height={200}
                  objectFit='contain'
                />
              ) : null}

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* NIS */}
                <FormItem>
                  <FormLabel>NIS</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan NIS...'
                      {...form.register('nis', {
                        required: 'NIS wajib diisi',
                        minLength: 6
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nis?.message}
                  </FormMessage>
                </FormItem>

                {/* NIK */}
                <FormItem>
                  <FormLabel>NIK</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan NIK...'
                      {...form.register('nik', {
                        required: 'NIK wajib diisi',
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message: 'NIK harus 16 digit angka'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nik?.message}
                  </FormMessage>
                </FormItem>

                {/* Nama */}
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Lengkap...'
                      {...form.register('nama', {
                        required: 'Nama wajib diisi',
                        minLength: {
                          value: 3,
                          message: 'Nama minimal 3 karakter'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.nama?.message}
                  </FormMessage>
                </FormItem>

                {/* Jurusan */}
                <FormItem>
                  <FormLabel>Jurusan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Jurusan...'
                      {...form.register('jurusan', {})}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.jurusan?.message}
                  </FormMessage>
                </FormItem>

                {/* Tempat Lahir */}
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Tempat Lahir...'
                      {...form.register('tempatLahir', {
                        required: 'Tempat lahir wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.tempatLahir?.message}
                  </FormMessage>
                </FormItem>

                {/* Tanggal Lahir */}
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...form.register('tanggalLahir', {
                        required: 'Tanggal lahir wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.tanggalLahir?.message}
                  </FormMessage>
                </FormItem>

                {/* Nama Ayah */}
                <FormItem>
                  <FormLabel>Nama Ayah</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Ayah...'
                      {...form.register('namaAyah', {
                        required: 'Nama Ayah wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.namaAyah?.message}
                  </FormMessage>
                </FormItem>

                {/* Nama Ibu */}
                <FormItem>
                  <FormLabel>Nama Ibu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Masukkan Nama Ibu...'
                      {...form.register('namaIbu', {
                        required: 'Nama Ibu wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.namaIbu?.message}
                  </FormMessage>
                </FormItem>

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
                        value={field.value}
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
                      <FormMessage>
                        {form.formState.errors.jenisKelamin?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='kelas'
                  rules={{ required: 'Kelas wajib dipilih' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kelas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih Kelas' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {masterKelas?.map((d) => (
                            <SelectItem key={d.id} value={d.namaKelas}>
                              {d.namaKelas}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.kelas?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* Tahun Lulus */}
                <FormItem>
                  <FormLabel>Tahun Lulus</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan Tahun Lulus...'
                      {...form.register('tahunLulus')}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.tahunLulus?.message}
                  </FormMessage>
                </FormItem>

                {/* Alamat */}
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Masukkan Alamat...'
                      {...form.register('alamat', {
                        required: 'Alamat wajib diisi'
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.alamat?.message}
                  </FormMessage>
                </FormItem>

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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Pilih Jenis Kelamin' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='Laki-laki'>Laki-laki</SelectItem>
                          <SelectItem value='Perempuan'>Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.jenisKelamin?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                {/* No Telepon */}
                <FormItem>
                  <FormLabel>No Telepon</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan No Telepon...'
                      {...form.register('noTelepon', {
                        required: 'No telepon wajib diisi',
                        pattern: {
                          value: /^[0-9]{10,13}$/,
                          message: 'No telepon harus 10-13 digit angka'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.noTelepon?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>No Telepon Orang Tua</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Masukkan No Telepon Orang Tua...'
                      {...form.register('noTeleponOrtu', {
                        required: 'No telepon ortu wajib diisi',
                        pattern: {
                          value: /^[0-9]{10,13}$/,
                          message: 'No telepon harus 10-13 digit angka'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.noTelepon?.message}
                  </FormMessage>
                </FormItem>

                {/* Email */}
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='Masukkan Email...'
                      {...form.register('email', {
                        required: 'Email wajib diisi',
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Format email tidak valid'
                        }
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Ekstrakulikuler Peminatan</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Eskul Peminatan...'
                      {...form.register('ekstraKulikulerPeminatan', {
                        required: 'No telepon wajib diisi',
                        min: 3
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.noTelepon?.message}
                  </FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Ekstrakulikuler Wajib</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Masukkan Eskul Wajib...'
                      {...form.register('ekstraKulikulerWajib', {
                        required: 'Eskul Wajib wajib diisi',
                        min: 3
                      })}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.noTelepon?.message}
                  </FormMessage>
                </FormItem>
              </div>
            </div>
            {/* Tombol Submit */}
            <Button type='submit' disabled={loading}>
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                'Simpan'
              )}
            </Button>{' '}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
