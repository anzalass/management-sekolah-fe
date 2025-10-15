'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Pencil, Save, SaveAll, Trash2 } from 'lucide-react';
import ModalInputNilaiManual from './modal-input-manual';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Student {
  id: string;
  nama: string;
  nis?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  kelas?: string;
}

type InputNilaiProps = {
  idKelas: string;
  listSiswa: Student[];
};

type NilaiItem = {
  id: string;
  nama: string;
  nilai: number;
  jenisNilai: string;
};

type JenisNilaiForm = {
  jenis: string;
  bobot: number;
};

export default function InputNilaiKelas({
  idKelas,
  listSiswa
}: InputNilaiProps) {
  const { register, handleSubmit, reset } = useForm<JenisNilaiForm>();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // 🔹 Fetch data penilaian & nilai siswa
  const { data, isLoading } = useQuery({
    queryKey: ['penilaianKelas', idKelas],
    queryFn: async () => {
      const res = await api.get(`penilaian/kelas/${idKelas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data;
    },
    enabled: !!session?.user?.token
  });

  const jenisNilai = data?.jenisNilai ?? [];
  const nilaiSiswa = data?.nilaiSiswa ?? [];

  const [defaultJenisNilai, setDefaultJenisNilai] = useState<string>('');

  useEffect(() => {
    if (jenisNilai.length > 0) {
      setDefaultJenisNilai(jenisNilai[0]?.jenis);
    }
  }, [jenisNilai]);

  const listNilai = nilaiSiswa.filter(
    (item: NilaiItem) => item.jenisNilai === defaultJenisNilai
  );

  // 🔹 Mutation Tambah Jenis Nilai
  const tambahJenisMutation = useMutation({
    mutationFn: async (data: JenisNilaiForm) => {
      return api.post(
        `penilaian`,
        { idKelasMapel: idKelas, ...data },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Jenis penilaian ditambahkan');
      reset();
      queryClient.invalidateQueries({ queryKey: ['penilaianKelas', idKelas] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal tambah jenis nilai');
    }
  });

  // 🔹 Mutation Update Jenis Nilai
  const updateJenisMutation = useMutation({
    mutationFn: async (item: { id: string; jenis: string; bobot: number }) => {
      return api.put(
        `penilaian/${item.id}`,
        { jenis: item.jenis, bobot: item.bobot },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Jenis penilaian diupdate');
      queryClient.invalidateQueries({ queryKey: ['penilaianKelas', idKelas] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal update')
  });

  // 🔹 Mutation Delete Jenis Nilai
  const deleteJenisMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`penilaian/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Jenis penilaian dihapus');
      queryClient.invalidateQueries({ queryKey: ['penilaianKelas', idKelas] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal hapus')
  });

  // 🔹 Mutation Update Nilai
  const updateNilaiMutation = useMutation({
    mutationFn: async (nilai: NilaiItem) => {
      return api.put(
        `nilai-siswa/${nilai.id}`,
        { nilai: nilai.nilai },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
    },
    onSuccess: () => {
      toast.success('Nilai berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['penilaianKelas', idKelas] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal simpan nilai')
  });

  // 🔹 Mutation Delete Nilai
  const deleteNilaiMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`nilai-siswa/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
    },
    onSuccess: () => {
      toast.success('Nilai dihapus');
      queryClient.invalidateQueries({ queryKey: ['penilaianKelas', idKelas] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || 'Gagal hapus nilai')
  });

  // 🔹 State Edit Jenis
  const [editJenis, setEditJenis] = useState<{
    id: string;
    jenis: string;
    bobot: number;
  } | null>(null);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='space-y-6'>
      {/* Jenis Penilaian */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Jenis Penilaian</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex flex-wrap gap-2'>
            {jenisNilai.map((d: any) => (
              <div
                key={d.id}
                className='flex items-center gap-2 rounded border px-2 py-1'
              >
                {editJenis?.id === d.id ? (
                  <>
                    <Input
                      value={editJenis?.jenis}
                      onChange={(e) =>
                        setEditJenis((prev) =>
                          prev ? { ...prev, jenis: e.target.value } : prev
                        )
                      }
                      className='w-24'
                    />
                    <Input
                      type='number'
                      value={editJenis?.bobot}
                      onChange={(e) =>
                        setEditJenis((prev) =>
                          prev
                            ? { ...prev, bobot: Number(e.target.value) }
                            : prev
                        )
                      }
                      className='w-20'
                    />
                    <Button
                      size='sm'
                      onClick={() =>
                        editJenis?.id &&
                        updateJenisMutation.mutate({
                          id: editJenis.id,
                          jenis: editJenis.jenis,
                          bobot: editJenis.bobot
                        })
                      }
                    >
                      Save
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setEditJenis(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant={
                        d.jenis === defaultJenisNilai ? 'default' : 'outline'
                      }
                      onClick={() => setDefaultJenisNilai(d.jenis)}
                    >
                      {d.jenis} - {d.bobot}%
                    </Button>
                    <div className='flex space-x-1'>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() =>
                          setEditJenis({
                            id: d.id,
                            jenis: d.jenis,
                            bobot: d.bobot
                          })
                        }
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        onClick={() => deleteJenisMutation.mutate(d.id)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Form Tambah Jenis */}
          <form
            onSubmit={handleSubmit((data) => tambahJenisMutation.mutate(data))}
            className='flex gap-2 pt-4'
          >
            <Input
              placeholder='Jenis penilaian'
              {...register('jenis', { required: true })}
            />
            <Input
              type='number'
              placeholder='Bobot (%)'
              {...register('bobot', { required: true, min: 1, max: 100 })}
            />
            <Button type='submit'>Tambah</Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabel Nilai */}
      <Card className='w-full'>
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle className='text-base'>
              Input Nilai: {defaultJenisNilai}
            </CardTitle>
            <ModalInputNilaiManual
              jenisNilaiList={jenisNilai}
              siswaList={listSiswa}
              idKelas={idKelas}
              onSuccess={() =>
                queryClient.invalidateQueries({
                  queryKey: ['penilaianKelas', idKelas]
                })
              }
            />
          </div>
        </CardHeader>
        <CardContent className='w-[90vw] overflow-auto'>
          <table className='w-[100vw] border-collapse overflow-x-auto'>
            <thead>
              <tr>
                <th className='border p-2'>No</th>
                <th className='border p-2'>Nama</th>
                <th className='w-[50%] border p-2'>Nilai</th>
                <th className='border p-2'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {listNilai.map((nilai: NilaiItem, index: number) => (
                <tr key={nilai.id} className='w-[300px]'>
                  <td className='border p-2'>{index + 1}</td>
                  <td className='border p-2'>{nilai.nama}</td>
                  <td className='border p-2'>
                    <Input
                      type='number'
                      min={0}
                      max={100}
                      value={nilai.nilai}
                      onChange={(e) =>
                        queryClient.setQueryData(
                          ['penilaianKelas', idKelas],
                          (old: any) => {
                            if (!old) return old;
                            return {
                              ...old,
                              nilaiSiswa: old.nilaiSiswa.map((n: any) =>
                                n.id === nilai.id
                                  ? { ...n, nilai: Number(e.target.value) }
                                  : n
                              )
                            };
                          }
                        )
                      }
                    />
                  </td>
                  <td className='flex space-x-2 border p-2'>
                    <Button onClick={() => updateNilaiMutation.mutate(nilai)}>
                      <SaveAll size={20} />
                    </Button>
                    <Button
                      className='bg-red-600 text-white hover:bg-red-700'
                      onClick={() => deleteNilaiMutation.mutate(nilai.id)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
