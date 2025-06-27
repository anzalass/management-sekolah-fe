'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CalendarIcon, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface Tabungan {
  id: number;
  tanggal: string;
  keterangan: string;
  nominal: number;
  tipe: 'masuk' | 'keluar';
}

const dummyTabungan: Tabungan[] = [
  {
    id: 1,
    tanggal: '2025-06-19',
    keterangan: 'Setoran tabungan',
    nominal: 50000,
    tipe: 'masuk'
  },
  {
    id: 2,
    tanggal: '2025-06-18',
    keterangan: 'Penarikan jajan',
    nominal: 20000,
    tipe: 'keluar'
  },
  {
    id: 3,
    tanggal: '2025-06-17',
    keterangan: 'Setoran dari orang tua',
    nominal: 100000,
    tipe: 'masuk'
  }
];

export default function LogTabungan() {
  const [filterTanggal, setFilterTanggal] = useState('');

  const filtered = dummyTabungan.filter((item) =>
    filterTanggal ? item.tanggal === filterTanggal : true
  );

  const saldoAkhir = dummyTabungan.reduce((total, t) => {
    return t.tipe === 'masuk' ? total + t.nominal : total - t.nominal;
  }, 0);

  return (
    <div className='mx-auto max-w-4xl space-y-6 p-4'>
      <div>
        <h1 className='text-2xl font-bold'>Log Tabungan</h1>
        <p className='text-sm text-muted-foreground'>
          Riwayat transaksi masuk dan keluar tabungan siswa.
        </p>
      </div>

      {/* Saldo */}
      <Card className='border-green-400 bg-green-50'>
        <CardHeader>
          <CardTitle className='text-lg text-green-700'>
            Saldo Tabungan Saat Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold text-green-600'>
            Rp {saldoAkhir.toLocaleString('id-ID')}
          </p>
        </CardContent>
      </Card>

      {/* Filter Tanggal */}
      <div className='relative max-w-xs'>
        <CalendarIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
        <Input
          type='date'
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* List Tabungan */}
      <div className='space-y-4'>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <Card
              key={item.id}
              className='flex items-center justify-between p-4 shadow-sm'
            >
              <div>
                <h4 className='font-semibold'>{item.keterangan}</h4>
                <p className='text-sm text-muted-foreground'>{item.tanggal}</p>
              </div>
              <div className='flex items-center gap-2'>
                {item.tipe === 'masuk' ? (
                  <ArrowDownCircle className='h-5 w-5 text-green-500' />
                ) : (
                  <ArrowUpCircle className='h-5 w-5 text-red-500' />
                )}
                <p
                  className={`text-base font-semibold ${
                    item.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.tipe === 'masuk' ? '+' : '-'} Rp{' '}
                  {item.nominal.toLocaleString('id-ID')}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <p className='text-sm text-muted-foreground'>
            Tidak ada transaksi ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
