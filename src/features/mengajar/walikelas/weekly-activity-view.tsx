'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Download, Eye, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';

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

export default function WeeklyActivityList({ idKelas }: { idKelas: string }) {
  const [data, setData] = useState<WeeklyActivity[]>([]);
  const [filteredData, setFilteredData] = useState<WeeklyActivity[]>([]);
  const [searchContent, setSearchContent] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const { data: session } = useSession();
  const { trigger, toggleTrigger } = useRenderTrigger();

  // state untuk modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    const res = await api.get(`weekly-activity-guru/${idKelas}`, {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`
      }
    });
    const json = await res.data.data;
    setData(json);
    setFilteredData(json); // perbaikan: langsung json (bukan json.data)
  };
  useEffect(() => {
    fetchData();
  }, [idKelas, trigger]);

  useEffect(() => {
    let filtered = data;

    if (searchContent.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.content.toLowerCase().includes(searchContent.toLowerCase())
      );
    }

    if (searchDate.trim() !== '') {
      filtered = filtered.filter(
        (item) => item.waktu.split('T')[0] === searchDate
      );
    }

    setFilteredData(filtered);
  }, [searchContent, searchDate, data]);

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
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });
      fetchData();
      toast.success('Berhasil Menghapus Weekly Activity');
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Card className='space-y-4 p-5'>
      {/* Filter */}
      <p className='font-bold'>Weekly Activity {idKelas}</p>
      <div className='flex flex-wrap gap-4'>
        <div className='flex flex-col'>
          <Input
            id='content'
            placeholder='Cari konten...'
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
          />
        </div>
        <div className='flex flex-col'>
          <Input
            id='date'
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
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredData?.length === 0 && (
          <p className='col-span-full text-center text-gray-500'>
            Tidak ada aktivitas.
          </p>
        )}
        {filteredData?.map((item) => (
          <Card key={item.id} className='overflow-hidden shadow-lg'>
            <CardHeader className='relative'>
              <CardTitle className='text-lg'>{item.content}</CardTitle>
              <p className='text-sm text-gray-500'>
                {format(new Date(item.waktu), 'dd MMM yyyy HH:mm')}
              </p>
              <Trash2Icon
                onClick={() => handleDelete(item.id)}
                className='absolute right-3 top-3'
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
                    {/* Overlay button muncul saat hover */}
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
  );
}
