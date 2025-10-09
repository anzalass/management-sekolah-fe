'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Download, Eye, Trash2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FotoWeeklyActivity {
  id: string;
  fotoUrl: string;
}

interface WeeklyActivity {
  id: string;
  judul: string;
  content: string;
  waktu: string;
  FotoWeeklyActivity: FotoWeeklyActivity[];
}

export default function WeeklyActivityList({ idKelas }: { idKelas: string }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [searchContent, setSearchContent] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // FETCH DATA
  const { data, isLoading, isError } = useQuery<WeeklyActivity[]>({
    queryKey: ['weekly-activity', idKelas],
    queryFn: async () => {
      const res = await api.get(`weekly-activity-guru/${idKelas}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data.data;
    }
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`weekly-activity/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-activity', idKelas] });
      toast.success('Berhasil Menghapus Weekly Activity');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus activity');
    }
  });

  // FILTER DATA
  const filteredData = useMemo(() => {
    if (!data) return [];
    let filtered = data;

    if (searchContent.trim()) {
      filtered = filtered.filter((item) =>
        item.content.toLowerCase().includes(searchContent.toLowerCase())
      );
    }

    if (searchDate.trim()) {
      filtered = filtered.filter(
        (item) => item.waktu.split('T')[0] === searchDate
      );
    }

    return filtered;
  }, [data, searchContent, searchDate]);

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'foto_weekly.jpg';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className='space-y-4 p-5'>
      <p className='text-base font-bold'>Weekly Activity</p>

      {/* Filter */}
      <div className='flex flex-wrap gap-4'>
        <div className='flex flex-col'>
          <Input
            placeholder='Cari konten...'
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <Input
            type='date'
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <div className='flex items-end'>
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
      </div>

      {/* Data */}
      {isLoading ? (
        <p className='text-center text-gray-500'>Loading...</p>
      ) : isError ? (
        <p className='text-center text-red-500'>Gagal memuat data activity.</p>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredData.length === 0 && (
            <p className='col-span-full text-center text-gray-500'>
              Tidak ada aktivitas.
            </p>
          )}
          {filteredData.map((item) => (
            <Card key={item.id} className='overflow-hidden shadow-lg'>
              <CardHeader className='relative'>
                <CardTitle className='text-lg'>{item.judul}</CardTitle>
                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                <p className='text-sm text-gray-500'>
                  {format(new Date(item.waktu), 'dd MMM yyyy HH:mm')}
                </p>
                <Trash2Icon
                  onClick={() => deleteMutation.mutate(item.id)}
                  className='absolute right-3 top-3 cursor-pointer hover:text-red-600'
                />
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-2'>
                  {item.FotoWeeklyActivity.map((foto) => (
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
      )}

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
  );
}
