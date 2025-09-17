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
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { API } from '@/lib/server';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

export type GuruStaff = {
  nip: string;
  nik: string;
  password: string;
  jabatan: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir?: Date; // Tanggal Lahir bisa null
  alamat: string;
  agama: string;
  jenisKelamin: string;
  noTelepon: string;
  email: string;
  status: string;
  foto?: string | null; // Foto bisa null
  RiwayatPendidikanGuru: RiwayatPendidikanGuru[]; // Relasi dengan RiwayatPendidikanGuru
};

export type RiwayatPendidikanGuru = {
  id: string;
  nama: string;
  gelar: string | null;
  jenjangPendidikan: string;
  tahunLulus: string;
};

const guruStaffSchema = z.object({
  nip: z.string().min(2, {
    message: 'NIP must be at least 2 characters.'
  }),
  nik: z.string().min(2, {
    message: 'NIK must be at least 2 characters.'
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .optional()
    .refine((value) => value === undefined || value.length >= 6, {
      message: 'Password must be at least 6 characters.'
    }),

  jabatan: z.string().min(2, {
    message: 'Jabatan must be at least 2 characters.'
  }),
  nama: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  tempatLahir: z.string().min(2, {
    message: 'Tempat Lahir must be at least 2 characters.'
  }),
  tanggalLahir: z.date().optional(),
  alamat: z.string().min(10, {
    message: 'Alamat must be at least 10 characters.'
  }),
  agama: z.string().min(2, {
    message: 'Agama must be at least 2 characters.'
  }),
  jenisKelamin: z.string().min(1, {
    message: 'Jenis Kelamin is required.'
  }),
  noTelepon: z.string().min(10, {
    message: 'No Telepon must be at least 10 characters.'
  }),
  email: z.string().email({
    message: 'Invalid email address.'
  }),
  status: z.string().min(2, {
    message: 'Status must be at least 2 characters.'
  })
});

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
  const defaultValue = {
    nip: initialData?.nip,
    nik: initialData?.nik,
    password: initialData?.password,
    jabatan: initialData?.jabatan,
    nama: initialData?.nama,
    tempatLahir: initialData?.tempatLahir,
    tanggalLahir: initialData?.tanggalLahir
      ? new Date(initialData?.tanggalLahir)
      : undefined,
    alamat: initialData?.alamat,
    agama: initialData?.agama,
    jenisKelamin: initialData?.jenisKelamin,
    noTelepon: initialData?.noTelepon,
    email: initialData?.email,
    status: initialData?.status,
    RiwayatPendidikanGuru: initialData?.RiwayatPendidikanGuru || []
  };
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [fotoUrl, setFotoUrl] = useState(initialData?.foto);
  const [data, setData] = useState(defaultValue.RiwayatPendidikanGuru);
  const [img, setImg] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [riwayatPendidikanGuruArr, setRiwayatPendidikanGuruArr] = useState<
    RiwayatPendidikanGuru[]
  >([]);
  const [riwayatPendidikanGuru, setRiwayatPendidikanGuru] =
    useState<RiwayatPendidikanGuru>({
      id: '',
      nama: '',
      jenjangPendidikan: '',
      gelar: '',
      tahunLulus: ''
    });

  const form = useForm<z.infer<typeof guruStaffSchema>>({
    resolver: zodResolver(guruStaffSchema),
    defaultValues: defaultValue // Ganti `values` menjadi `defaultValues`
  });

  async function onSubmit(values: z.infer<typeof guruStaffSchema>) {
    startTransition(async () => {
      try {
        const data = new FormData();
        if (img) {
          data.append('foto', img);
        }

        data.append('nip', values.nip);
        data.append('nik', values.nik);
        if (values.password) {
          data.append('password', values.password);
        }

        data.append('jabatan', values.jabatan);
        data.append('nama', values.nama);
        data.append('tempatLahir', values.tempatLahir);

        const dateString = values.tanggalLahir
          ? values.tanggalLahir.toISOString()
          : '';
        data.append('tanggalLahir', dateString);
        data.append('alamat', values.alamat);
        data.append('agama', values.agama);
        data.append('jenisKelamin', values.jenisKelamin);
        data.append('noTelepon', values.noTelepon);
        data.append('email', values.email);
        data.append('status', values.status);

        let res;
        if (idGuru !== 'new') {
          res = await api.put(`user/update-guru/${idGuru}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
        } else {
          res = await api.post(`user/create-guru`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${session?.user?.token}`
            }
          });
        }

        if (res.status === 201) {
          await api.post(
            `user/create-riwayat-pendidikan/${idGuru}`,
            {
              data: riwayatPendidikanGuruArr
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.user?.token}`
              }
            }
          );
        }

        toast.success(
          idGuru !== 'new'
            ? 'Berhasil mengubah data Guru / Staff'
            : 'Berhasil menambahkan data Guru / Staff'
        );

        router.push('/dashboard/master-data/guru-staff');
      } catch (error: any) {
        toast.error(error?.response.data.message || 'Terjadi Kesalahan');
      }
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
      setImg(file);
    }
  };

  const pushRiwayatPendidikan = () => {
    if (!riwayatPendidikanGuru.jenjangPendidikan) {
      alert('Jenjang Pendidikan is required');
      return;
    }

    if (
      riwayatPendidikanGuru.jenjangPendidikan !== 'SD' &&
      riwayatPendidikanGuru.jenjangPendidikan !== 'SMP' &&
      riwayatPendidikanGuru.jenjangPendidikan !== 'SMA' &&
      !riwayatPendidikanGuru.gelar
    ) {
      alert('Gelar is required for this Jenjang Pendidikan');
      return;
    }

    if (!riwayatPendidikanGuru.nama) {
      alert('Nama Institusi is required');
      return;
    }

    if (!riwayatPendidikanGuru.tahunLulus) {
      alert('Tahun Lulus is required');
      return;
    }

    // Jika validasi lolos, push data ke array
    setRiwayatPendidikanGuruArr((prev) => [...prev, riwayatPendidikanGuru]);

    setRiwayatPendidikanGuru({
      id: '',
      jenjangPendidikan: '',
      nama: '',
      gelar: '',
      tahunLulus: ''
    });
  };

  const hapusRiwayatPendidikan = async (id: string) => {
    try {
      await api.delete(`user/delete-riwayat-pendidikan/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      setData((prevData) => prevData.filter((r) => r.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  useEffect(() => {
    setData(initialData?.RiwayatPendidikanGuru || []);
  }, [initialData]); // Update state setiap `initialData` berubah

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
              <FormItem className='w-full'>
                <FormLabel>Foto</FormLabel>
                <FormControl>
                  <div>
                    <Input type='file' onChange={handleFileChange} />
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
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='nip'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukan NIP...'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nik'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukan NIK...'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nama'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukan Nama Lengkap...'
                        {...field}
                        value={field.value ?? ''}
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
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukan Password...'
                        {...field}
                        value={field.value ?? ''}
                        type='password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='jabatan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field?.value || ''}
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
                        <SelectItem value='Kesiswaan'>Kesiswaan</SelectItem>
                        <SelectItem value='Kurikulum'>Kurikulum</SelectItem>
                        <SelectItem value='Bimbingan Konseling'>
                          Bimbingan Konseling
                        </SelectItem>
                        <SelectItem value='Perpustakaan'>
                          Perpustakaan
                        </SelectItem>
                        <SelectItem value='Guru Pengajar'>
                          Guru Pengajar
                        </SelectItem>
                        <SelectItem value='Tata Usaha'>Tata Usaha</SelectItem>
                        <SelectItem value='Petugas Keamanan'>
                          Petugas Keamanan
                        </SelectItem>
                        <SelectItem value='Petugas Kebersihan'>
                          Petugas Kebersihan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tempatLahir'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukan Tempat Lahir...'
                        {...field}
                        value={field.value ?? ''}
                        type='text'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tanggalLahir'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split('T')[0] // Pastikan field.value adalah Date sebelum diproses
                            : ''
                        }
                        onChange={(e) => {
                          const selectedDate = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          field.onChange(selectedDate);
                        }}
                        className='rounded border p-2'
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='agama'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agama</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
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
              <FormField
                control={form.control}
                name='alamat'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter product description'
                        className=''
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='jenisKelamin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
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

              <FormField
                control={form.control}
                name='noTelepon'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Telepon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukan No Telepon...'
                        {...field}
                        value={field.value ?? ''}
                        type='text'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Masukan Email...'
                        {...field}
                        value={field.value ?? ''}
                        type='email'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih Jenis Kelamin' />
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
            <div className='flex flex-col space-y-4'>
              <p className='mb-5'>Riwayat Pendidikan</p>

              <FormItem>
                <Select
                  onValueChange={(e) =>
                    setRiwayatPendidikanGuru((prev) => ({
                      ...prev,
                      jenjangPendidikan: e
                    }))
                  }
                  value={riwayatPendidikanGuru.jenjangPendidikan || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih Jenjang Pendidikan' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='SD'>SD</SelectItem>
                    <SelectItem value='SMP'>SMP</SelectItem>
                    <SelectItem value='SMA'>SMA</SelectItem>
                    <SelectItem value='S1'>S1</SelectItem>
                    <SelectItem value='S2'>S2</SelectItem>
                    <SelectItem value='S3'>S3</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem>
                <FormControl>
                  <Input
                    value={riwayatPendidikanGuru.nama}
                    onChange={(e) =>
                      setRiwayatPendidikanGuru((prev) => ({
                        ...prev,
                        nama: e.target.value
                      }))
                    }
                    placeholder='Masukan Nama Institusi...'
                    type='text'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormControl>
                  <Input
                    value={riwayatPendidikanGuru.gelar || ''}
                    onChange={(e) =>
                      setRiwayatPendidikanGuru((prev) => ({
                        ...prev,
                        gelar: e.target.value
                      }))
                    }
                    placeholder='Masukan Gelar...'
                    type='text'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormControl>
                  <Input
                    value={riwayatPendidikanGuru.tahunLulus}
                    onChange={(e) =>
                      setRiwayatPendidikanGuru((prev) => ({
                        ...prev,
                        tahunLulus: e.target.value
                      }))
                    }
                    placeholder='Masukan Tahun Lulus...'
                    type='number'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className='flex items-end justify-end'>
                <Button type='button' onClick={pushRiwayatPendidikan}>
                  Tambah +
                </Button>
              </div>

              <div className='flex flex-wrap gap-4'>
                {data?.map((d, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border-b p-4 shadow-sm'
                  >
                    <div className='mr-4 flex flex-col space-y-1'>
                      <p className='font-semibold'>{d.nama}</p>
                      <p className='text-sm text-gray-500'>
                        {d.jenjangPendidikan}
                      </p>
                      <p className='text-sm text-gray-400'>{d.tahunLulus}</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => hapusRiwayatPendidikan(d.id)}
                      className='text-red-500 transition-colors hover:text-red-700'
                    >
                      <Trash size={18} /> {/* Trash icon */}
                    </button>
                  </div>
                ))}
                {riwayatPendidikanGuruArr.map((d, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border-b p-4 shadow-sm'
                  >
                    <div className='mr-4 flex flex-col space-y-1'>
                      <p className='font-semibold'>{d.nama}</p>
                      <p className='text-sm text-gray-500'>
                        {d.jenjangPendidikan}
                      </p>
                      <p className='text-sm text-gray-400'>{d.tahunLulus}</p>
                    </div>
                    <button
                      // onClick={() => handleDelete(index)} // Add the function to handle delete
                      className='text-red-500 transition-colors hover:text-red-700'
                    >
                      <Trash size={18} /> {/* Trash icon */}
                    </button>
                  </div>
                ))}
              </div>
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
