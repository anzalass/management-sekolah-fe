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
import { DataTable as KehadiranGuruTable } from '@/components/ui/table/data-table';
import { columns } from './kehadiran-tables/columns';
import { KehadiranGuru } from '../presensi/kehadiran/kehadiran-guru-listing';

type Izin = {
  id: string;
  tanggal: string;
  keterangan: string;
  buktiUrl?: string;
  status: 'disetujui' | 'menunggu' | 'ditolak';
};

type Props = {
  listIzin: Izin[];
  fetchData: () => void;
};

const statusColor = {
  disetujui: 'bg-green-100 text-green-700',
  menunggu: 'bg-yellow-100 text-yellow-700',
  ditolak: 'bg-red-100 text-red-700'
};

export default function CardListIzin({ listIzin, fetchData }: Props) {
  const { data: session } = useSession();
  const [toogleChange, setToogleChange] = useState('perizinan');

  const [data, setData] = useState<KehadiranGuru[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);
  const { trigger, toggleTrigger } = useRenderTrigger();

  // filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'semua' | 'disetujui' | 'menunggu' | 'ditolak'
  >('semua');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [nip, setNip] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/perizinan-guru/delete/${id}`);
      toast.success('Data izin berhasil dihapus');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus izin');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}kehadiran-guru?page=${page}&pageSize=${pageLimit}&nip=${nip}&tanggal=${tanggal}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`
            }
          }
        );
        setData(response.data.data);
        setTotalData(response.data.total);
      } catch (error) {
        console.error('Error fetching kehadiran guru:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, nip, tanggal, pageLimit, trigger]);

  const filteredList = useMemo(() => {
    return listIzin.filter((izin) => {
      const cocokStatus =
        statusFilter === 'semua' || izin.status === statusFilter;
      const cocokSearch = izin.keterangan
        .toLowerCase()
        .includes(search.toLowerCase());
      return cocokStatus && cocokSearch;
    });
  }, [listIzin, search, statusFilter]);

  return (
    <Card className='space-y-6 p-5'>
      <div className='flex space-x-3'>
        <Button onClick={() => setToogleChange('perizinan')}>Perizinan</Button>
        <Button onClick={() => setToogleChange('kehadiran')}>Kehadiran</Button>
      </div>

      {toogleChange === 'perizinan' ? (
        <div className=''>
          {/* FILTER IZIN */}
          <div className='flex flex-col gap-4 md:flex-row md:items-center'>
            <div className='relative w-full md:w-1/2'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari berdasarkan keterangan...'
                className='pl-10'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className='relative w-full md:w-1/2'>
              <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Cari berdasarkan Tanggal...'
                className='pl-10'
                type='Tanggal'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as any)}
            >
              <SelectTrigger className='w-full md:w-52'>
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

          {/* LIST IZIN */}
          {filteredList.length === 0 ? (
            <p className='text-center text-muted-foreground'>
              Tidak ada data izin yang cocok.
            </p>
          ) : (
            <div className='mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {filteredList.map((izin) => (
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
        </div>
      ) : (
        <div className=''>
          {/* FILTER KEHADIRAN */}
          <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <Input
              placeholder='Filter NIP'
              value={nip}
              onChange={(e) => setNip(e.target.value)}
            />
            <Input
              type='date'
              placeholder='Tanggal'
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
            <Select
              value={String(pageLimit)}
              onValueChange={(val) => setPageLimit(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder='Limit per halaman' />
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
              onChange={(e) => setPage(Number(e.target.value))}
              min={1}
            />
          </div>

          {/* TABLE KEHADIRAN */}
          <KehadiranGuruTable
            columns={columns}
            data={data}
            totalItems={totalData}
          />
        </div>
      )}
    </Card>
  );
}
