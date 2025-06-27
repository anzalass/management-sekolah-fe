'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ImageIcon, Plus, SearchIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Izin {
  id: number;
  judul: string;
  keterangan: string;
  tanggal: string; // Format: YYYY-MM-DD
  bukti?: File | null;
}

export default function Perizinan() {
  const [search, setSearch] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');
  const [izinList, setIzinList] = useState<Izin[]>([
    {
      id: 1,
      judul: 'Izin Sakit',
      keterangan: 'Demam tinggi, disarankan istirahat oleh dokter.',
      tanggal: '2025-06-18'
    },
    {
      id: 2,
      judul: 'Izin Keluarga',
      keterangan: 'Menghadiri acara keluarga di luar kota.',
      tanggal: '2025-06-10'
    },
    {
      id: 4,
      judul: 'Izin Keperluan Penting',
      keterangan: 'Mengurus dokumen penting di instansi pemerintah.',
      tanggal: '2025-06-05'
    },
    {
      id: 5,
      judul: 'Izin Sakit',
      keterangan: 'Demam tinggi, disarankan istirahat oleh dokter.',
      tanggal: '2025-06-18'
    },
    {
      id: 6,
      judul: 'Izin Keluarga',
      keterangan: 'Menghadiri acara keluarga di luar kota.',
      tanggal: '2025-06-10'
    },
    {
      id: 7,
      judul: 'Izin Keperluan Penting',
      keterangan: 'Mengurus dokumen penting di instansi pemerintah.',
      tanggal: '2025-06-05'
    }
  ]);

  const [form, setForm] = useState({
    judul: '',
    keterangan: '',
    tanggal: '',
    bukti: null as File | null
  });

  const filteredData = izinList
    .filter(
      (izin) =>
        izin.judul.toLowerCase().includes(search.toLowerCase()) ||
        izin.keterangan.toLowerCase().includes(search.toLowerCase())
    )
    .filter((izin) => (filterTanggal ? izin.tanggal === filterTanggal : true));

  const handleSubmit = () => {
    const newIzin: Izin = {
      id: Date.now(),
      judul: form.judul,
      keterangan: form.keterangan,
      tanggal: form.tanggal,
      bukti: form.bukti
    };
    setIzinList((prev) => [newIzin, ...prev]);
    setForm({ judul: '', keterangan: '', tanggal: '', bukti: null });
  };

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Riwayat Perizinan</h1>
          <p className='text-sm text-muted-foreground'>
            Lihat daftar pengajuan izin yang sudah dibuat.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='flex gap-1'>
              <Plus size={16} />
              Ajukan Izin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Form Pengajuan Izin</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label>Judul</Label>
                <Input
                  value={form.judul}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, judul: e.target.value }))
                  }
                  placeholder='Judul izin (contoh: Izin Sakit)'
                />
              </div>
              <div>
                <Label>Keterangan</Label>
                <Textarea
                  value={form.keterangan}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      keterangan: e.target.value
                    }))
                  }
                  placeholder='Alasan atau penjelasan izin'
                />
              </div>
              <div>
                <Label>Tanggal</Label>
                <Input
                  type='date'
                  value={form.tanggal}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tanggal: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='bukti'>Upload Bukti (opsional)</Label>
                <div className='flex items-center gap-2'>
                  <ImageIcon className='h-4 w-4 text-muted-foreground' />
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        bukti: e.target.files?.[0] ?? null
                      }))
                    }
                  />
                </div>
                {form.bukti && (
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {form.bukti.name}
                  </p>
                )}
              </div>
              <div className='flex justify-end'>
                <Button onClick={handleSubmit}>Kirim Izin</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Search & Date */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='relative w-full'>
          <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari judul atau keterangan...'
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

      {/* Daftar Perizinan */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {filteredData.length > 0 ? (
          filteredData.map((izin) => (
            <Card key={izin.id}>
              <CardHeader>
                <CardTitle className='text-lg'>{izin.judul}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p>{izin.keterangan}</p>
                <p className='text-xs font-medium text-primary'>
                  Tanggal: {izin.tanggal}
                </p>
                {izin.bukti && (
                  <div className='mt-1'>
                    <span className='text-xs'>Bukti: </span>
                    <span className='text-xs italic'>{izin.bukti.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada data ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
