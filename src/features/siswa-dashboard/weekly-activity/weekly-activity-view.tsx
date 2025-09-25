'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import WeeklyActivityFilterMobile from './filter-weekly-mobile';

interface FotoWeeklyActivity {
  id: string;
  fotoUrl: string;
}

interface WeeklyActivity {
  id: string;
  content: string;
  waktu: string;
  FotoWeeklyActivity: FotoWeeklyActivity[];
}

export default function WeeklyActivityList() {
  const { data: session } = useSession();
  const [searchContent, setSearchContent] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch data function
  const fetchWeeklyActivity = async (): Promise<WeeklyActivity[]> => {
    if (!session?.user?.token) return [];
    const res = await api.get('weekly-activity', {
      headers: {
        Authorization: `Bearer ${session.user.token}`
      }
    });
    return res.data.data;
  };

  // React Query
  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery<WeeklyActivity[], unknown>({
    queryKey: ['weekly-activity'],
    queryFn: fetchWeeklyActivity,
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 5 // 5 menit cache
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memuat data'
      );
    }
  }, [error]);
  // Filtered data
  const filteredData = data.filter((item: any) => {
    const matchesContent = searchContent
      ? item.content.toLowerCase().includes(searchContent.toLowerCase())
      : true;
    const matchesDate = searchDate
      ? item.waktu.split('T')[0] === searchDate
      : true;
    return matchesContent && matchesDate;
  });

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'foto_weekly.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`weekly-activity/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      toast.success('Berhasil Menghapus Weekly Activity');
      refetch(); // reload data
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  if (isLoading) return <p className='p-4 text-center'>Loading data...</p>;
  if (error)
    return <p className='p-4 text-center text-red-500'>Gagal memuat data</p>;

  return (
    <div>
      <NavbarSiswa title='Weekly Activity' />

      {/* Filter Mobile */}
      <WeeklyActivityFilterMobile
        searchContent={searchContent}
        setSearchContent={setSearchContent}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        onReset={() => {
          setSearchContent('');
          setSearchDate('');
        }}
      />

      <Card className='space-y-4 p-5'>
        {/* Filter Desktop */}
        <div className='hidden justify-between gap-4 sm:flex'>
          <div className='flex gap-3'>
            <Input
              id='content'
              placeholder='Cari konten...'
              value={searchContent}
              onChange={(e) => setSearchContent(e.target.value)}
            />
            <Input
              id='date'
              type='date'
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <Button
            variant='secondary'
            onClick={() => {
              setSearchContent('');
              setSearchDate('');
            }}
          >
            Reset Filter
          </Button>
        </div>

        {/* Data */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredData.length === 0 && (
            <p className='col-span-full text-center text-gray-500'>
              Tidak ada aktivitas.
            </p>
          )}
          {filteredData.map((item: any) => (
            <Card key={item.id} className='overflow-hidden shadow-lg'>
              <CardHeader className='relative'>
                <CardTitle className='text-lg'>{item.content}</CardTitle>
                <p className='text-sm text-gray-500'>
                  {format(new Date(item.waktu), 'dd MMM yyyy HH:mm')}
                </p>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-2'>
                  {item.FotoWeeklyActivity.map((foto: any) => (
                    <div key={foto.id} className='group relative'>
                      <img
                        src={foto.fotoUrl}
                        alt='Foto'
                        className='h-32 w-full rounded-lg object-cover'
                      />
                      <div className='absolute inset-0 hidden items-center justify-center gap-2 bg-black/50 group-hover:flex'>
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => handleDownload(foto.fotoUrl)}
                        >
                          <Download className='mr-1 h-4 w-4' /> Download
                        </Button>
                        <Button
                          size='sm'
                          variant='secondary'
                          onClick={() => {
                            setSelectedPhoto(foto.fotoUrl);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className='mr-1 h-4 w-4' /> Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal Detail */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-xl'>
            <DialogHeader>
              <DialogTitle>Detail Foto</DialogTitle>
            </DialogHeader>
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt='Detail Foto'
                className='w-full rounded-lg object-contain'
              />
            )}
          </DialogContent>
        </Dialog>
      </Card>
      <BottomNav />
    </div>
  );
}
