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
import {
  Clock,
  LogOut,
  FileText,
  CalendarPlus,
  CheckCircle,
  ClipboardList
} from 'lucide-react';

import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PengumumanKelasGuru from './pengumuman-guru';

const fetchDashboard = async (token: string) => {
  const response = await api.get('dashboard-mengajar', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

const postAbsenPulang = async (token: string) => {
  const response = await api.post(
    'absen-pulang',
    { lat: '-6.09955851839959', long: '106.51911493230111' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export default function MengajarViewPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: dashboard,
    isLoading,
    error
  } = useQuery({
    queryKey: ['dashboard-mengajar'],
    queryFn: () => fetchDashboard(session?.user?.token as string),
    enabled: !!session?.user?.token
  });

  const absenPulangMutation = useMutation({
    mutationFn: () => postAbsenPulang(session?.user?.token as string),
    onSuccess: (res) => {
      toast.success(res.message || 'Absen pulang berhasil!');
      queryClient.invalidateQueries({ queryKey: ['dashboard-mengajar'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal absen pulang');
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
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-300'>
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900'>
        <Card className='max-w-md p-6 text-center'>
          <div className='text-2xl'>⚠️</div>
          <p className='mt-2 text-red-600 dark:text-red-400'>
            Gagal memuat data dashboard
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen'>
      {/* <div className='absolute -z-50 h-[30%] w-full bg-blue-800'></div> */}

      <div className='mx-auto space-y-6 p-4 pb-20'>
        {/* Camera Modal */}
        {isCameraOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
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
        <div className='text-center'>
          <h1 className='text-xl font-bold text-gray-800 dark:text-white'>
            Selamat datang, {session?.user?.nama} 👋
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{today}</p>
        </div>
        {/* Action Buttons - Clean & Modern */}
        <div className=''>
          <ListJadwalGuru jadwalGuru={dashboard?.jadwalGuru || []} />
        </div>
        {/* Status Summary - Simple Cards */}

        <div className='w-full'>
          {/* Flex container utama: status + ikon aksi */}
          <div className='mx-auto flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6 md:flex-row'>
            {/* === Bagian Status (Teks Ringkas) === */}
            <div className='flex w-full items-center gap-4 rounded-md md:w-1/2'>
              <div className='flex items-center gap-1.5 border-2 p-2 text-sm'>
                <span className='font-medium text-gray-700 dark:text-gray-300'>
                  Masuk:
                </span>
                <span
                  className={
                    dashboard?.statusMasuk
                      ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {dashboard?.statusMasuk ? '✅' : 'belum'}
                </span>
              </div>

              <div className='flex items-center gap-1.5 border-2 p-2 text-sm'>
                <span className='font-medium text-gray-700 dark:text-gray-300'>
                  Pulang:
                </span>
                <span
                  className={
                    dashboard?.statusKeluar
                      ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {dashboard?.statusKeluar ? '✅' : 'belum'}
                </span>
              </div>

              <div className='flex items-center gap-1.5 border-2 p-2 text-sm'>
                <span className='font-medium text-gray-700 dark:text-gray-300'>
                  Izin:
                </span>
                <span
                  className={
                    dashboard?.statusIzin
                      ? 'font-semibold text-amber-600 dark:text-amber-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {dashboard?.statusIzin ? 'Aktif' : '–'}
                </span>
              </div>
            </div>

            {/* === Bagian Aksi (Hanya Ikon) === */}
            <div className='flex w-full items-center justify-start gap-3 md:w-1/2 md:justify-end'>
              {/* Absen Masuk */}
              <Button
                size='icon'
                variant='outline'
                onClick={() => setIsCameraOpen(true)}
                disabled={dashboard?.statusMasuk || dashboard?.statusIzin}
                aria-label={
                  dashboard?.statusMasuk ? 'Sudah absen masuk' : 'Absen masuk'
                }
                className={`rounded-lg border-2 bg-blue-300 p-2.5 transition-all ${
                  dashboard?.statusMasuk
                    ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                    : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
                }`}
              >
                {dashboard?.statusMasuk ? (
                  <CheckCircle size={20} />
                ) : (
                  <Clock size={20} />
                )}
              </Button>

              {/* Absen Pulang */}
              <Button
                size='icon'
                variant='outline'
                onClick={() => absenPulangMutation.mutate()}
                disabled={dashboard?.statusKeluar || dashboard?.statusIzin}
                aria-label={
                  dashboard?.statusKeluar
                    ? 'Sudah absen pulang'
                    : 'Absen pulang'
                }
                className={`rounded-lg border-2 bg-green-300 p-2.5 transition-all ${
                  dashboard?.statusKeluar
                    ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                    : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                }`}
              >
                {dashboard?.statusKeluar ? (
                  <CheckCircle size={20} />
                ) : (
                  <LogOut size={20} />
                )}
              </Button>

              {/* Izin Tidak Hadir */}
              <Button
                size='icon'
                variant='outline'
                onClick={() => setShowIzinModal(true)}
                disabled={!!dashboard?.statusMasuk}
                aria-label={
                  dashboard?.statusIzin ? 'Izin aktif' : 'Ajukan izin'
                }
                className={`rounded-lg border-2 bg-amber-300 p-2.5 transition-all ${
                  dashboard?.statusIzin
                    ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30'
                    : 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/30'
                }`}
              >
                {dashboard?.statusIzin ? (
                  <CheckCircle size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </Button>

              {/* Tambah Jadwal */}
              <Button
                size='icon'
                variant='outline'
                onClick={() => setShowJadwalModal(true)}
                aria-label='Tambah jadwal mengajar'
                className='rounded-lg border-2 bg-purple-300 p-2.5 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/30'
              >
                <CalendarPlus size={20} />
              </Button>
            </div>
          </div>
        </div>
        <div className=''>
          <ListKelasGuru
            kelasMapel={dashboard?.kelasMapel || []}
            kelasWaliKelas={dashboard?.kelasWaliKelas || []}
            setOpenModal={setOpenModal}
            fetchData={() =>
              queryClient.invalidateQueries({
                queryKey: ['dashboard-mengajar']
              })
            }
          />
        </div>
        <div className=''>
          <PengumumanKelasGuru />
        </div>
        <div className=''>
          <CardListIzin />
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
        <ModalTambahKelas openModal={openModal} setOpenModal={setOpenModal} />
        <ModalTambahKelasMapel
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </div>
    </div>
  );
}
