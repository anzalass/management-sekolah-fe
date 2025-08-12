'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar, Search, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { API } from '@/lib/server';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

type Izin = {
  id: string;
  tanggal: string;
  keterangan: string;
  buktiUrl?: string;
  status: 'disetujui' | 'menunggu' | 'ditolak';
};

export type KehadiranGuru = {
  id: string;
  tanggal: string;
  jamMasuk?: string;
  jamPulang?: string;
  status: string;
  nama: string;
  nip: string;
};

const statusColor = {
  disetujui: 'bg-green-100 text-green-700',
  menunggu: 'bg-yellow-100 text-yellow-700',
  ditolak: 'bg-red-100 text-red-700'
};

type Props = {
  izin: Izin[];
  fetchData: () => void;
};
export default function CardListIzin({ izin }: Props) {
  const { data: session } = useSession();
  const { trigger, toggleTrigger } = useRenderTrigger();
  // Toggle antara 'perizinan' atau 'kehadiran'
  const [toggleTab, setToggleTab] = useState<'perizinan' | 'kehadiran'>(
    'perizinan'
  );

  // Data izin
  const [listIzin, setListIzin] = useState<Izin[]>([]);
  const [searchIzin, setSearchIzin] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'semua' | 'disetujui' | 'menunggu' | 'ditolak'
  >('semua');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Data kehadiran
  const [dataKehadiran, setDataKehadiran] = useState<KehadiranGuru[]>([]);
  const [tanggalKehadiran, setTanggalKehadiran] = useState('');
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [loadingKehadiran, setLoadingKehadiran] = useState(false);

  // --- Fungsi fetch data izin ---
  const fetchIzin = async () => {
    if (!session?.user?.token) return;
    try {
      const res = await axios.get(`${API}perizinan-guru`, {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
      setListIzin(res.data.data || []);
    } catch (error) {
      console.error('Gagal fetch perizinan:', error);
      setListIzin([]);
    }
  };

  // --- Fungsi fetch data kehadiran ---
  const fetchKehadiran = async () => {
    if (!session?.user?.token) return;
    try {
      setLoadingKehadiran(true);
      const res = await axios.get(
        `${API}kehadiran-guru?page=${page}&pageSize=${pageLimit}&nip=${session.user.nip}&tanggal=${tanggalKehadiran}`
        // { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      setDataKehadiran(res.data.data.data || []);
      console.log('dt', res.data?.data);
    } catch (error) {
      console.error('Gagal fetch kehadiran:', error);
      setDataKehadiran([]);
    } finally {
      setLoadingKehadiran(false);
    }
  };

  useEffect(() => {
    fetchIzin();
  }, [session, trigger]);

  useEffect(() => {
    fetchKehadiran();
  }, [
    session,
    page,
    pageLimit,
    tanggalKehadiran ?? '', // jamin selalu ada nilai
    trigger
  ]);

  // Hapus izin
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/perizinan-guru/delete/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      toast.success('Data izin berhasil dihapus');
      fetchIzin();
    } catch (error) {
      toast.error('Gagal menghapus izin');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter izin berdasarkan search dan status
  const filteredIzin = useMemo(() => {
    return listIzin.filter((izin) => {
      const cocokStatus =
        statusFilter === 'semua' || izin.status === statusFilter;
      const cocokSearch = izin.keterangan
        .toLowerCase()
        .includes(searchIzin.toLowerCase());
      return cocokStatus && cocokSearch;
    });
  }, [listIzin, searchIzin, statusFilter]);

  return (
    <Card className='space-y-6 p-5'>
      {/* Tab toggle */}
      <div className='mb-4 flex space-x-3'>
        <Button
          variant={toggleTab === 'perizinan' ? 'default' : 'outline'}
          onClick={() => setToggleTab('perizinan')}
        >
          Perizinan
        </Button>
        <Button
          variant={toggleTab === 'kehadiran' ? 'default' : 'outline'}
          onClick={() => setToggleTab('kehadiran')}
        >
          Kehadiran
        </Button>
      </div>

      {toggleTab === 'perizinan' ? (
        <>
          {/* Filter Perizinan */}
          <div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center'>
            <div className='relative w-full md:w-1/2'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari berdasarkan keterangan...'
                className='pl-10'
                value={searchIzin}
                onChange={(e) => setSearchIzin(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Filter status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='semua'>Semua Status</SelectItem>
                <SelectItem value='disetujui'>Disetujui</SelectItem>
                <SelectItem value='menunggu'>Menunggu</SelectItem>
                <SelectItem value='ditolak'>Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* List Perizinan */}
          {filteredIzin.length === 0 ? (
            <p className='text-center text-muted-foreground'>
              Tidak ada data izin yang cocok.
            </p>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {filteredIzin.map((izin) => (
                <Card
                  key={izin.id}
                  className='rounded-2xl border border-muted shadow-sm transition hover:shadow-md'
                >
                  <CardContent className='space-y-3 p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Calendar className='h-4 w-4' />
                        <span>
                          {new Date(izin.tanggal).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <Badge className={statusColor[izin.status]}>
                        {izin.status.charAt(0).toUpperCase() +
                          izin.status.slice(1)}
                      </Badge>
                    </div>

                    <div>
                      <p className='text-sm font-medium text-gray-800'>
                        Keterangan:
                      </p>
                      <p className='text-sm text-gray-600'>{izin.keterangan}</p>
                    </div>

                    {izin.status === 'menunggu' && (
                      <div className='flex gap-2 pt-2'>
                        <Button
                          variant='destructive'
                          size='sm'
                          disabled={deletingId === izin.id}
                          onClick={() => handleDelete(izin.id)}
                        >
                          {deletingId === izin.id ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Trash2 className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Filter Kehadiran */}
          <div className='mb-4 flex gap-4'>
            <Input
              type='date'
              placeholder='Tanggal'
              value={tanggalKehadiran}
              onChange={(e) => setTanggalKehadiran(e.target.value)}
              className='max-w-[180px]'
            />
            <Select
              value={String(pageLimit)}
              onValueChange={(val) => setPageLimit(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Limit / halaman' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5</SelectItem>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type='number'
              placeholder='Halaman'
              value={page}
              min={1}
              onChange={(e) => setPage(Number(e.target.value))}
              className='max-w-[80px]'
            />
          </div>
          <div className='mx-auto w-[100%] overflow-x-auto'>
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse overflow-x-auto border border-gray-200'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='w-[20%] whitespace-nowrap border border-gray-300 px-4 py-2 text-left'>
                      Tanggal
                    </th>
                    <th className='w-[40%] whitespace-nowrap border border-gray-300 px-4 py-2 text-left'>
                      Nama
                    </th>
                    <th className='w-[40%] whitespace-nowrap border border-gray-300 px-4 py-2 text-left'>
                      NIP
                    </th>
                    <th className='w-[40%] whitespace-nowrap border border-gray-300 px-4 py-2 text-left'>
                      Jam Masuk
                    </th>
                    <th className='w-[40%] whitespace-nowrap border border-gray-300 px-4 py-2 text-left'>
                      Jam Pulang
                    </th>
                    <th className='w-[40%] whitespace-nowrap border border-gray-300 px-4 py-2 text-left'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingKehadiran ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='border border-gray-300 px-4 py-6 text-center'
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : dataKehadiran.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className='border border-gray-300 px-4 py-6 text-center text-gray-500'
                      >
                        Tidak ada data kehadiran
                      </td>
                    </tr>
                  ) : (
                    dataKehadiran?.map((item) => (
                      <tr
                        key={item.id}
                        className='odd:bg-white even:bg-gray-50 hover:bg-gray-100'
                      >
                        <td className='whitespace-nowrap border border-gray-300 px-4 py-2'>
                          {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className='whitespace-nowrap border border-gray-300 px-4 py-2'>
                          {item.nama}
                        </td>
                        <td className='whitespace-nowrap border border-gray-300 px-4 py-2'>
                          {item.nip}
                        </td>
                        <td className='whitespace-nowrap border border-gray-300 px-4 py-2'>
                          {item.jamMasuk ?? '-'}
                        </td>
                        <td className='whitespace-nowrap border border-gray-300 px-4 py-2'>
                          {item.jamPulang ?? '-'}
                        </td>
                        <td className='whitespace-nowrap border border-gray-300 px-4 py-2'>
                          {item.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
