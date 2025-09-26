'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, SearchIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import NavbarSiswa from '../navbar-siswa';
import BottomNav from '../bottom-nav';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import FilterMobile from './filter-pengumuman-mobile';
import Loading from '../loading';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface Pengumuman {
  id: number;
  title: string;
  content: string;
  time: string;
}

export default function PengumumanView() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  // state untuk modal
  const [selectedPengumuman, setSelectedPengumuman] =
    useState<Pengumuman | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: pengumuman = [],
    isLoading,
    error
  } = useQuery<Pengumuman[]>({
    queryKey: ['pengumuman-siswa'],
    queryFn: async () => {
      if (!session?.user?.token) return [];
      const res = await api.get('siswa/pengumuman', {
        headers: { Authorization: `Bearer ${session.user.token}` }
      });
      return res.data.data;
    },
    enabled: !!session?.user?.token,
    staleTime: 1000 * 60 * 5
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

  const filteredPengumuman = pengumuman
    .filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      if (!filterTanggal) return true;
      const dateOnly = new Date(item.time).toISOString().split('T')[0];
      return dateOnly === filterTanggal;
    });

  return (
    <div className='mx-auto mb-36 space-y-6'>
      <NavbarSiswa title='Pengumuman' />

      {/* Filter Desktop */}
      <div className='hidden flex-col gap-4 p-4 pr-4 sm:flex sm:flex-row'>
        <div className='relative w-full'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari judul atau isi...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='relative w-full sm:max-w-xs'>
          <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            type='date'
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Filter Mobile */}
      <FilterMobile
        searchValue={search}
        setSearchValue={setSearch}
        tanggalValue={filterTanggal}
        setTanggalValue={setFilterTanggal}
      />

      {/* Loading/Error */}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className='p-4 text-center text-red-500'>Gagal memuat pengumuman</p>
      ) : (
        <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2'>
          {filteredPengumuman.length > 0 ? (
            filteredPengumuman.map((item) => (
              <Card
                key={item.id}
                className='cursor-pointer shadow-sm transition hover:shadow-md'
                onClick={() => {
                  setSelectedPengumuman(item);
                  setIsDialogOpen(true);
                }}
              >
                <div className='px-6 pb-2 pt-3'>
                  <h3 className='text-base font-semibold md:text-lg'>
                    {item.title}
                  </h3>
                </div>
                <CardContent className='space-y-2 text-sm text-muted-foreground'>
                  <div
                    className='line-clamp-2'
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></div>
                  <p className='text-xs font-medium text-black'>
                    Tanggal:{' '}
                    {new Date(item.time).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className='col-span-full text-center text-sm text-muted-foreground'>
              Tidak ada pengumuman ditemukan.
            </p>
          )}
        </div>
      )}

      {/* Modal Detail Pengumuman */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{selectedPengumuman?.title}</DialogTitle>
          </DialogHeader>
          {selectedPengumuman && (
            <div className='space-y-4'>
              <div
                className='prose prose-sm max-w-none'
                dangerouslySetInnerHTML={{ __html: selectedPengumuman.content }}
              ></div>
              <p className='text-xs font-medium text-gray-500'>
                {new Date(selectedPengumuman.time).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
