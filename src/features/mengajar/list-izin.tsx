'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'semua' | 'disetujui' | 'menunggu' | 'ditolak'
  >('semua');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    <div className='space-y-6'>
      <CardTitle>Perizinan</CardTitle>

      {/* FILTER */}
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

      {/* LIST */}
      {filteredList.length === 0 ? (
        <p className='text-center text-muted-foreground'>
          Tidak ada data izin yang cocok.
        </p>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
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
                    {izin.status.charAt(0).toUpperCase() + izin.status.slice(1)}
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
  );
}
