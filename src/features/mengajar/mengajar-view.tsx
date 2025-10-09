'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Camera from '../presensi/Camera';
import ModalTambahKelas from './modal-tambah-kelas';
import ModalTambahKelasMapel from './modal-tambah-kelas-mapel';
import ModalTambahJadwal from './modal-tambah-jadwal';
import ModalTambahIzin from './modal-tambah-izin';
import ListKelasGuru from './list-kelas-guru';
import ListJadwalGuru from './list-jadwal-guru';
import CardListIzin from './list-izin';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 🔹 fetcher untuk dashboard
const fetchDashboard = async (token: string) => {
  const response = await api.get('dashboard-mengajar', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

// 🔹 post absen pulang
const postAbsenPulang = async (token: string) => {
  const response = await api.post(
    'absen-pulang',
    {
      lat: '-6.09955851839959',
      long: '106.51911493230111'
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export default function MengajarViewPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // 🔹 Query Dashboard
  const {
    data: dashboard,
    isLoading,
    error
  } = useQuery({
    queryKey: ['dashboard-mengajar'],
    queryFn: () => fetchDashboard(session?.user?.token as string),
    enabled: !!session?.user?.token // hanya jalan kalau ada token
  });

  // 🔹 Mutation Absen Pulang
  const absenPulangMutation = useMutation({
    mutationFn: () => postAbsenPulang(session?.user?.token as string),
    onSuccess: (res) => {
      toast.success(res.message || 'Absen pulang berhasil');
      queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  const [showIzinModal, setShowIzinModal] = useState(false);
  const [showJadwalModal, setShowJadwalModal] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (isLoading) {
    return <p className='p-6'>Loading dashboard...</p>;
  }

  if (error) {
    return <p className='p-6 text-red-500'>Gagal memuat data dashboard</p>;
  }

  return (
    <div className='relative min-h-screen space-y-6 p-6'>
      {/* Camera Modal */}
      {isCameraOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <Camera
            fetchData={() =>
              queryClient.invalidateQueries({
                queryKey: ['dashboard-mengajar']
              })
            }
            open={isCameraOpen}
            setOpen={setIsCameraOpen}
          />
        </div>
      )}

      {/* Greeting */}
      <div>
        <h1 className='text-xl font-bold'>
          Selamat datang, {session?.user?.nama} 👋
        </h1>
        <p className='text-sm text-muted-foreground'>{today}</p>
      </div>

      {/* Absen Buttons */}
      <div className='flex flex-wrap gap-4'>
        <Button
          onClick={() => setIsCameraOpen(true)}
          disabled={dashboard?.statusMasuk || dashboard?.statusIzin}
        >
          {dashboard?.statusMasuk
            ? `✅ Sudah Absen Masuk (${dashboard.statusMasuk})`
            : '🕘 Absen Masuk'}
        </Button>
        <Button
          onClick={() => absenPulangMutation.mutate()}
          disabled={dashboard?.statusKeluar || dashboard?.statusIzin}
        >
          {dashboard?.statusKeluar
            ? `✅ Sudah Absen Pulang (${dashboard.statusKeluar})`
            : '🏁 Absen Pulang'}
        </Button>
        <Button
          variant='outline'
          onClick={() => setShowIzinModal(true)}
          disabled={dashboard?.statusMasuk}
        >
          {dashboard?.statusIzin
            ? '📋 Telah Izin Tidak Hadir'
            : '📋 Izin Tidak Hadir'}
        </Button>
        <Button variant='outline' onClick={() => setShowJadwalModal(true)}>
          Tambah Jadwal +
        </Button>
      </div>

      {/* Modals */}
      <ModalTambahJadwal
        fetchData={() =>
          queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] })
        }
        openModal={showJadwalModal}
        setOpenModal={setShowJadwalModal}
      />

      <ModalTambahIzin
        fetchData={() =>
          queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] })
        }
        openModal={showIzinModal}
        setOpenModal={setShowIzinModal}
      />

      {/* Status Summary */}
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Card className='flex flex-col items-center justify-center p-4 text-center'>
          <p className='mb-1 text-xs text-muted-foreground'>Status Masuk</p>
          <p
            className={`text-sm font-semibold ${
              dashboard?.statusMasuk ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {dashboard?.statusMasuk
              ? `✅ (${dashboard.statusMasuk})`
              : '❌ Belum Absen'}
          </p>
        </Card>

        <Card className='flex flex-col items-center justify-center p-4 text-center'>
          <p className='mb-1 text-xs text-muted-foreground'>Status Pulang</p>
          <p
            className={`text-sm font-semibold ${
              dashboard?.statusKeluar ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {dashboard?.statusKeluar
              ? `✅ (${dashboard.statusKeluar})`
              : '❌ Belum Absen'}
          </p>
        </Card>

        <Card className='flex flex-col items-center justify-center p-4 text-center'>
          <p className='mb-1 text-sm text-muted-foreground'>Status Izin</p>
          <p
            className={`text-sm font-semibold ${
              dashboard?.statusIzin ? 'text-yellow-600' : ''
            }`}
          >
            {dashboard?.statusIzin ? '📋 Izin Tidak Hadir' : '❌ Tidak Izin'}
          </p>
        </Card>
      </div>

      {/* Jadwal Hari Ini */}
      <ListJadwalGuru jadwalGuru={dashboard?.jadwalGuru || []} />

      {/* Wali Kelas & Kelas Diajar */}
      <ListKelasGuru
        kelasMapel={dashboard?.kelasMapel || []}
        kelasWaliKelas={dashboard?.kelasWaliKelas || []}
        setOpenModal={setOpenModal}
        fetchData={() =>
          queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] })
        }
      />

      {/* Modal Tambah Kelas */}
      <ModalTambahKelas openModal={openModal} setOpenModal={setOpenModal} />

      {/* Modal Tambah Kelas Mapel */}
      <ModalTambahKelasMapel
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      <CardListIzin />
    </div>
  );
}
