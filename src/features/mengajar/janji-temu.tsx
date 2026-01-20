'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, User, UserCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface JanjiTemu {
  id: string;
  waktu: string;
  status: string;
  deskripsi: string;
  siswaId: string;
  siswaNama: string;
  siswaNis: string;
  guruId: string;
  guruNama: string;
  guruNip: string;
}

export default function JanjiTemuView() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [searchNama, setSearchNama] = useState('');
  const [searchTanggal, setSearchTanggal] = useState('');

  const { data, isLoading, isError } = useQuery<JanjiTemu[]>({
    queryKey: ['janjiTemu'],
    queryFn: async () => {
      const res = await api.get('janji-temu-guru', {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token
  });

  const setujuiMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(
        `/janji-temu-status/${id}`,
        { status: 'setujui' },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['janjiTemu'] })
  });

  const tolakMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(
        `/janji-temu/${id}`,
        { status: 'tolak' },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` }
        }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['janjiTemu'] })
  });

  const filteredData = (data || []).filter((item) => {
    const matchNama = item.siswaNama
      ?.toLowerCase()
      .includes(searchNama.toLowerCase());
    const matchTanggal = searchTanggal
      ? new Date(item.waktu).toISOString().slice(0, 10) === searchTanggal
      : true;
    return matchNama && matchTanggal;
  });

  if (isLoading) {
    return (
      <div className='flex h-32 items-center justify-center'>
        <div className='h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300'>
        Gagal memuat data janji temu.
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      <div>
        <h1 className='text-xl font-bold text-gray-800 dark:text-white'>
          📅 Janji Temu
        </h1>
        <p className='text-sm text-muted-foreground'>
          Kelola permintaan janji temu dari siswa
        </p>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4'>
        <div className='w-full sm:w-64'>
          <Input
            placeholder='Cari nama siswa...'
            value={searchNama}
            onChange={(e) => setSearchNama(e.target.value)}
            className='h-9 text-sm'
          />
        </div>
        <div className='w-full sm:w-48'>
          <Input
            type='date'
            value={searchTanggal}
            onChange={(e) => setSearchTanggal(e.target.value)}
            className='h-9 text-sm'
          />
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className='space-y-4'>
          {filteredData.map((item) => (
            <Card
              key={item.id}
              className='overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md dark:border-gray-700'
            >
              <CardHeader className='pb-3'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-blue-500' />
                      <span className='font-medium text-gray-800 dark:text-white'>
                        {item.siswaNama}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        NIS: {item.siswaNis}
                      </span>
                    </div>

                    <span className='text-muted-foreground'>→</span>

                    <div className='flex items-center gap-2'>
                      <UserCheck className='h-4 w-4 text-green-600' />
                      <span className='font-medium text-gray-800 dark:text-white'>
                        {item.guruNama}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        NIP: {item.guruNip}
                      </span>
                    </div>
                  </div>

                  <Badge
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      item.status === 'setujui'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : item.status === 'tolak'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}
                  >
                    {item.status === 'setujui'
                      ? 'Disetujui'
                      : item.status === 'tolak'
                        ? 'Ditolak'
                        : 'Menunggu'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className='space-y-2 pt-0'>
                <div className='flex items-start gap-2 text-sm'>
                  <CalendarIcon className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500' />
                  <span className='text-gray-700 dark:text-gray-300'>
                    {new Date(item.waktu).toLocaleString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className='text-gray-700 dark:text-gray-300'>
                  {item.deskripsi}
                </p>
              </CardContent>

              {item.status === 'menunggu' && (
                <CardFooter className='flex justify-end gap-2 border-t pt-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30'
                    onClick={() => tolakMutation.mutate(item.id)}
                    disabled={tolakMutation.isPending}
                  >
                    Tolak
                  </Button>
                  <Button
                    size='sm'
                    className='bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600'
                    onClick={() => setujuiMutation.mutate(item.id)}
                    disabled={setujuiMutation.isPending}
                  >
                    Setujui
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center text-sm text-muted-foreground dark:border-gray-700 dark:bg-gray-900/50'>
          Tidak ada janji temu yang sesuai.
        </div>
      )}
    </div>
  );
}
