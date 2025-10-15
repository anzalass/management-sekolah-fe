'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PengumumanKelas from './pengumuman-kelas';
import CatatanPerkembanganSiswa from './perkembangan-siswa';
import { useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PresensiSiswa from './presensi-siswa';
import Link from 'next/link';
import api from '@/lib/api';
import JadwalPelajaran from './jadwalPelajaran';
import PerizinanSiswaView from './perizinan-siswa-view';
import TambahWeeklyActivity from './tambah-weekly-activity';
import WeeklyActivityList from './weekly-activity-view';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type IDKelas = {
  id: string;
};

interface Student {
  id: string;
  namaSiswa: string;
  nisSiswa: string;
}

interface Student2 {
  id: string;
  nama: string;
  nis: string;
}

export type PengumumanKelasType = {
  id: string;
  idKelas: string;
  title: string;
  time: Date | string;
  content: string;
};

export type CatatanPerkembanganSiswaType = {
  id: string;
  idSiswa: string;
  nama: string;
  catatan: string;
};

const DashboardWaliKelas = ({ id }: IDKelas) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const token = session?.user?.token;

  // ✅ Query: fetch master siswa
  const { data: masterSiswa = [] } = useQuery<Student2[]>({
    queryKey: ['masterSiswa'],
    queryFn: async () => {
      const res = await api.get(`user/get-all-siswa-master`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.result.data;
    },
    enabled: !!token
  });
  // ✅ Query: fetch siswa dalam kelas
  const { data: kelasSiswa = [] } = useQuery<Student[]>({
    queryKey: ['kelasSiswa', id],
    queryFn: async () => {
      const res = await api.get(`kelas-walikelas/siswa/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.siswaList;
    },
    enabled: !!token && !!id
  });

  // ✅ Query: fetch dashboard wali kelas (pengumuman + catatan)
  const { data: dashboardData } = useQuery<{
    data: {
      pengumuman: PengumumanKelasType[];
      catatanMap: CatatanPerkembanganSiswaType[];
      namaKelas: String;
    };
  }>({
    queryKey: ['dashboardWaliKelas', id],
    queryFn: async () => {
      const res = await api.get(`dashboard-walikelas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token && !!id
  });

  const pengumumanKelas = dashboardData?.data?.pengumuman ?? [];
  const catatanPerkembangan = dashboardData?.data?.catatanMap ?? [];

  // ✅ Mutation: tambah siswa ke kelas
  const addSiswaMutation = useMutation({
    mutationFn: async (siswa: Student2) => {
      await api.post(
        `kelas-walikelas/add`,
        {
          nisSiswa: siswa.nis,
          namaSiswa: siswa.nama,
          idSiswa: siswa.id,
          idKelas: id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
    },
    onSuccess: () => {
      toast.success('Siswa berhasil ditambahkan ke kelas');
      queryClient.invalidateQueries({ queryKey: ['kelasSiswa', id] });
      queryClient.invalidateQueries({ queryKey: ['kehadiran'] });

      setSearchTerm('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  // ✅ Filtered siswa master
  const filteredMasterSiswa = useMemo(() => {
    return masterSiswa.filter(
      (s) =>
        s?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !kelasSiswa?.find((k: any) => k?.Siswa?.nis === s?.nis)
    );
  }, [searchTerm, masterSiswa, kelasSiswa]);

  return (
    <div className='space-y-8 overflow-x-auto p-4 pb-16'>
      <p className='text-base font-bold lg:text-2xl'>
        {dashboardData?.data.namaKelas}
      </p>
      <div className='grid grid-cols-2 items-center justify-between gap-4 text-sm lg:grid-cols-6 lg:text-base'>
        <Button asChild className='text-xs lg:text-base'>
          <Link href={`/mengajar/walikelas/${id}/rekap-absensi`}>
            Rekap Absensi
          </Link>
        </Button>
        <Button asChild className='text-xs lg:text-base'>
          <Link href={`/mengajar/walikelas/${id}/rekap-nilai`}>
            Rekap Nilai
          </Link>
        </Button>
        <Button asChild className='text-xs lg:text-base'>
          <Link href={`/mengajar/walikelas/${id}/list-siswa`}>List Siswa</Link>
        </Button>
        <Button asChild className='text-xs lg:text-base'>
          <Link href={`/mengajar/walikelas/${id}/kartu-ujian`}>
            Cetak Kartu Ujian
          </Link>
        </Button>
        <Button asChild className='text-xs lg:text-base'>
          <Link href={`/mengajar/walikelas/${id}/perizinan-siswa`}>
            Perizinan Siswa
          </Link>
        </Button>
        <TambahWeeklyActivity idKelas={id} />
      </div>

      <div className='w-[100%] overflow-x-scroll'>
        <PerizinanSiswaView idKelas={id} />
      </div>
      <div className='w-[100%] overflow-x-scroll'>
        <PresensiSiswa idKelas={id} />
      </div>
      <div className='w-[100%] overflow-x-scroll'>
        <JadwalPelajaran idKelas={id} />
      </div>

      {/* Tambah siswa */}
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='text-base'>Tambah Siswa ke Kelas</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Input
            placeholder='Cari nama siswa...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm.trim() !== '' && filteredMasterSiswa.length > 0 && (
            <div className='rounded border p-2'>
              <ul className='space-y-1'>
                {filteredMasterSiswa.map((siswa) => (
                  <li
                    key={siswa.nis}
                    className='flex items-center justify-between border-b pb-1 last:border-none last:pb-0'
                  >
                    <span>
                      {siswa.nama} - {siswa.nis}
                    </span>
                    <Button
                      size='sm'
                      onClick={() => addSiswaMutation.mutate(siswa)}
                      disabled={addSiswaMutation.isPending}
                    >
                      {addSiswaMutation.isPending ? 'Menambahkan...' : 'Tambah'}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <PengumumanKelas pengumuman={pengumumanKelas} id={id} />
      <CatatanPerkembanganSiswa
        catatanList={catatanPerkembangan}
        idKelas={id}
        siswa={kelasSiswa}
      />
      <WeeklyActivityList idKelas={id} />
    </div>
  );
};

export default DashboardWaliKelas;
