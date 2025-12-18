'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Schema validation with zod
const schema = z.object({
  nama: z.string().min(3, 'Nama sekolah minimal 3 karakter'),
  npsn: z.string().min(1, 'NPSN wajib diisi'),
  kas: z.coerce.number().optional(),
  desa: z.string().optional(),
  kecamatan: z.string().optional(),
  kabupaten: z.string().optional(),
  provinsi: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional(),
  website: z.string().optional(),
  namaKepsek: z.string().optional(),
  tahunAjaran: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function SekolahForm() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: '',
      npsn: '',
      kas: undefined,
      desa: '',
      kecamatan: '',
      kabupaten: '',
      provinsi: '',
      telephone: '',
      email: '',
      website: '',
      namaKepsek: '',
      tahunAjaran: ''
    }
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // fetch data sekolah dari API
  useEffect(() => {
    const fetchSekolah = async () => {
      try {
        const res = await api.get('sekolah', {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        const data = res.data.data; // asumsi API mengembalikan 1 objek sekolah
        reset({
          nama: data.nama,
          npsn: data.npsn,
          kas: data.kas ?? undefined,
          desa: data.desa ?? '',
          kecamatan: data.kecamatan ?? '',
          kabupaten: data.kabupaten ?? '',
          provinsi: data.provinsi ?? '',
          telephone: data.telephone ?? '',
          email: data.email ?? '',
          website: data.website ?? '',
          namaKepsek: data.namaKepsek ?? '',
          tahunAjaran: data.tahunAjaran ?? ''
        });
        if (data.logo) {
          setLogoPreview(data.logo);
        }
      } catch (err) {
        console.error('Gagal fetch sekolah:', err);
      }
    };
    fetchSekolah();
  }, [reset]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setLogoFile(f);
    if (f) setLogoPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });
      if (logoFile) formData.append('foto', logoFile);

      const res = await api.put(`sekolah`, formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      alert('Data sekolah tersimpan');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan');
    }
  };

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle>Form Sekolah</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <Label className='mb-1'>Nama Sekolah</Label>
              <Input placeholder='Nama Sekolah' {...register('nama')} />
              {errors.nama && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.nama.message}
                </p>
              )}
            </div>

            <div>
              <Label className='mb-1'>NPSN</Label>
              <Input placeholder='NPSN' {...register('npsn')} />
              {errors.npsn && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.npsn.message}
                </p>
              )}
            </div>

            <div>
              <Label className='mb-1'>Kas (Rp)</Label>
              <Input
                type='number'
                placeholder='Saldo kas'
                {...(register('kas') as any)}
              />
            </div>

            <div>
              <Label className='mb-1'>Tahun Ajaran</Label>
              <Select {...register('tahunAjaran')}>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih tahun ajaran' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='2023-2024'>2023-2024</SelectItem>
                  <SelectItem value='2024-2025'>2024-2025</SelectItem>
                  <SelectItem value='2025-2026'>2025-2026</SelectItem>
                  <SelectItem value='2026-2027'>2026-2027</SelectItem>
                  <SelectItem value='2027-2028'>2027-2028</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className='mb-1'>Nama Kepala Sekolah</Label>
              <Input placeholder='Nama Kepsek' {...register('namaKepsek')} />
            </div>

            <div>
              <Label className='mb-1'>Telepon</Label>
              <Input placeholder='08xxxxxxxx' {...register('telephone')} />
            </div>

            <div>
              <Label className='mb-1'>Email</Label>
              <Input
                placeholder='email@sekolah.sch.id'
                {...register('email')}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label className='mb-1'>Website</Label>
              <Input placeholder='https://' {...register('website')} />
            </div>

            <div>
              <Label className='mb-1'>Provinsi</Label>
              <Input placeholder='Provinsi' {...register('provinsi')} />
            </div>

            <div>
              <Label className='mb-1'>Kabupaten</Label>
              <Input placeholder='Kabupaten' {...register('kabupaten')} />
            </div>

            <div>
              <Label className='mb-1'>Kecamatan</Label>
              <Input placeholder='Kecamatan' {...register('kecamatan')} />
            </div>

            <div>
              <Label className='mb-1'>Desa</Label>
              <Input placeholder='Desa' {...register('desa')} />
            </div>
          </div>

          <div className='grid grid-cols-1 items-start gap-4 sm:grid-cols-3'>
            <div className='sm:col-span-2'>
              <Label className='mb-1'>
                Alamat singkat / catatan (optional)
              </Label>
              <Textarea placeholder='Alamat atau catatan tambahan' rows={4} />
            </div>

            <div className='flex flex-col items-center gap-2'>
              <Label className='mb-1'>Logo Sekolah</Label>
              <div className='h-28 w-28 overflow-hidden rounded-md border'>
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt='logo'
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-gray-100 text-sm text-muted-foreground'>
                    Preview
                  </div>
                )}
              </div>
              <input type='file' accept='image/*' onChange={onFileChange} />
              {logoFile && (
                <Button
                  variant='ghost'
                  type='button'
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview(null);
                  }}
                >
                  Hapus
                </Button>
              )}
            </div>
          </div>

          <div className='flex items-center justify-end gap-3'>
            <Button
              variant='ghost'
              type='button'
              onClick={() => window.location.reload()}
            >
              Batal
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
