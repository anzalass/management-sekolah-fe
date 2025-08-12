'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import { CatatanPerkembanganSiswaType } from './walikelas-view';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

interface Student2 {
  id: string;
  namaSiswa: string;
  nisSiswa: string;
}
type Props = {
  idKelas: string;
  siswa: Student2[];
  catatanList: CatatanPerkembanganSiswaType[];
};

interface FormValues {
  studentId: any;
  keterangan: string;
}

const CatatanPerkembanganSiswa = ({ siswa, idKelas, catatanList }: Props) => {
  const [editId, setEditId] = useState<string | null>(null);
  const { trigger, toggleTrigger } = useRenderTrigger();
  console.log('siswakelas', siswa);

  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      studentId: '',
      keterangan: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { idSiswa, nisSiswa, nama }: any = data.studentId; // udah langsung bisa ambil
      console.log('dts', nisSiswa, idSiswa, nama);

      if (editId) {
        await axios.put(`${API}catatan-siswa/${editId}`, {
          idKelas: idKelas,
          idSiswa: idSiswa,
          content: data.keterangan
        });
        setEditId(null);
      } else {
        await axios.post(`${API}catatan-siswa`, {
          idKelas: idKelas,
          idSiswa: idSiswa,
          content: data.keterangan
        });
      }

      toggleTrigger();
      toast.success('Berhasil membuat catatan perkembangan siswa');
    } catch (error) {
      console.log(error);
      toast.error('Gagal membuat catatan perkembangan siswa');
    }

    reset();
  };

  const handleEdit = (id: string) => {
    const catatan = catatanList.find((c) => c.id === id);
    if (!catatan) return;

    // cari object siswa yang sesuai
    const siswaObj = siswa.find((s) => s.id === catatan.idSiswa);
    if (!siswaObj) return;

    setValue('studentId', siswaObj); // set ke object siswa
    setValue('keterangan', catatan.catatan);
    setEditId(id);
  };

  const handleDelete = (id: string) => {};

  return (
    <Card className='mb-[200px]'>
      <CardHeader>
        <CardTitle>Catatan Perkembangan Siswa</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <Controller
            name='studentId'
            control={control}
            rules={{ required: 'Pilih siswa wajib diisi' }}
            render={({ field }) => (
              <Select
                value={field.value ? JSON.stringify(field.value) : ''}
                onValueChange={(val) => field.onChange(JSON.parse(val))}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Pilih siswa' />
                </SelectTrigger>
                <SelectContent>
                  {siswa?.map((s: Student2) => (
                    <SelectItem key={s.id} value={JSON.stringify(s)}>
                      {s.namaSiswa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name='keterangan'
            control={control}
            rules={{ required: 'Keterangan wajib diisi' }}
            render={({ field }) => (
              <Textarea
                placeholder='Tulis catatan perkembangan...'
                {...field}
              />
            )}
          />

          <Button type='submit'>
            {editId ? 'Update Catatan' : 'Tambah Catatan'}
          </Button>
        </form>

        {/* List */}
        {catatanList?.length === 0 ? (
          <p className='text-sm text-muted-foreground'>
            Belum ada catatan perkembangan.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
            {catatanList.map((c) => (
              <div key={c.id} className='3'>
                <Card className='relative flex shadow-sm transition-shadow hover:shadow-md'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-base font-semibold'>
                      {c.nama}
                    </CardTitle>
                    <p className='text-base'>{c.catatan}</p>
                  </CardHeader>

                  <CardFooter className='absolute -right-2 top-4 flex justify-end gap-2'>
                    <Button size='sm' onClick={() => handleEdit(c.id)}>
                      Edit
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDelete(c.id)}
                    >
                      Hapus
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CatatanPerkembanganSiswa;
