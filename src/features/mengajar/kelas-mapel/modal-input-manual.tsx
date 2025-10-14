'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type JenisNilai = { id: string; jenis: string; bobot: number };
interface Student {
  id: string;
  nama: string;
  nis?: string;
}

interface FormValues {
  idJenisNilai: string;
  idSiswa: string;
  nilai: number;
}

interface ModalInputNilaiProps {
  jenisNilaiList: JenisNilai[];
  siswaList: Student[];
  idKelas: string;
  onSuccess?: () => void;
}

export default function ModalInputNilaiManual({
  jenisNilaiList,
  siswaList,
  idKelas,
  onSuccess
}: ModalInputNilaiProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  console.log(siswaList);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      idJenisNilai: '',
      idSiswa: '',
      nilai: 0
    }
  });

  // ✅ Mutation React Query
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return api.post(
        `nilai-siswa`,
        {
          idSiswa: data.idSiswa,
          idKelasDanMapel: idKelas,
          idJenisNilai: data.idJenisNilai,
          nilai: data.nilai
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
    },
    onSuccess: () => {
      toast.success('Nilai berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['rekap-nilai', idKelas] }); // refresh rekap nilai
      setOpen(false);
      reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error('Gagal menyimpan nilai');
    }
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Nilai Manual</Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Tambah Nilai</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* Pilih Jenis Nilai */}
          <div>
            <Label>Jenis Nilai</Label>
            <Select
              onValueChange={(value) =>
                setValue('idJenisNilai', value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Pilih jenis nilai' />
              </SelectTrigger>
              <SelectContent>
                {jenisNilaiList.map((jn) => (
                  <SelectItem key={jn.id} value={jn.id}>
                    {jn.jenis} - {jn.bobot}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.idJenisNilai && (
              <p className='mt-1 text-sm text-red-500'>
                Jenis nilai wajib dipilih
              </p>
            )}
            <input
              type='hidden'
              {...register('idJenisNilai', { required: true })}
            />
          </div>

          {/* Pilih Siswa */}
          <div>
            <Label>Siswa</Label>
            <Select
              onValueChange={(value) =>
                setValue('idSiswa', value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Pilih siswa' />
              </SelectTrigger>
              <SelectContent>
                {siswaList.map((s: any) => (
                  <SelectItem key={s.Siswa.id} value={s.Siswa.id}>
                    {s.Siswa.nis} - {s.Siswa.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.idSiswa && (
              <p className='mt-1 text-sm text-red-500'>Siswa wajib dipilih</p>
            )}
            <input type='hidden' {...register('idSiswa', { required: true })} />
          </div>

          {/* Input Nilai */}
          <div>
            <Label>Nilai</Label>
            <Input
              type='number'
              min={0}
              max={100}
              {...register('nilai', {
                required: 'Nilai wajib diisi',
                valueAsNumber: true,
                min: { value: 0, message: 'Minimal 0' },
                max: { value: 100, message: 'Maksimal 100' }
              })}
            />
            {errors.nilai && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.nilai.message}
              </p>
            )}
          </div>

          {/* Tombol Simpan */}
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              variant='outline'
              type='button'
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
