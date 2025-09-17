'use client';

import React, { useEffect, useState } from 'react';
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
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

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
  const [data, setData] = useState<JanjiTemu[]>([]);
  const { data: session } = useSession();
  const fetchData = async () => {
    try {
      const res = await api.get('/janji-temu-guru', {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      }); // sesuaikan endpoint API kamu
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetujui = async (id: string) => {
    try {
      await api.put(
        `/janji-temu-status/${id}`,
        {
          status: 'setujui'
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTolak = async (id: string) => {
    try {
      await api.put(
        `/janji-temu/${id}`,
        {
          status: 'tolak'
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='space-y-4'>
      <h1 className='mb-4 text-xl font-bold'>📅 Daftar Janji Temu</h1>

      {data.length > 0 ? (
        data.map((item) => (
          <Card key={item.id} className='border shadow-sm'>
            <CardHeader className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
              <CardTitle className='flex flex-col text-base font-semibold sm:flex-row sm:items-center sm:gap-2'>
                <span className='flex items-center gap-2 text-blue-500'>
                  <User className='h-4 w-4' /> {item.siswaNama}
                </span>
                <span className='text-xs text-muted-foreground'>
                  (NIS: {item.siswaNis})
                </span>
                <span className='text-sm text-muted-foreground sm:ml-2 sm:mr-2'>
                  dengan
                </span>
                <span className='flex items-center gap-2 text-green-600'>
                  <UserCheck className='h-4 w-4' /> {item.guruNama}
                </span>
                <span className='text-xs text-muted-foreground'>
                  (NIP: {item.guruNip})
                </span>
              </CardTitle>

              <Badge
                variant={
                  item.status === 'setuju'
                    ? 'default'
                    : item.status === 'tolak'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {item.status}
              </Badge>
            </CardHeader>

            <CardContent className='space-y-2 text-sm text-muted-foreground'>
              <p className='flex items-center gap-2'>
                <CalendarIcon className='h-4 w-4 text-blue-500' />
                {new Date(item.waktu).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className='text-foreground'>{item.deskripsi}</p>
            </CardContent>

            <CardFooter className='flex justify-end gap-3'>
              <Button
                variant='destructive'
                onClick={() => handleTolak(item.id)}
              >
                Tolak
              </Button>
              <Button variant='default' onClick={() => handleSetujui(item.id)}>
                Setujui
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p className='text-sm text-muted-foreground'>
          Tidak ada janji temu ditemukan.
        </p>
      )}
    </div>
  );
}
