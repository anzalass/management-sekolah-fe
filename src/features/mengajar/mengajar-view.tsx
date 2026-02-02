'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Camera from '../presensi/Camera';
import ModalTambahKelas from './modal-tambah-kelas';
import ModalTambahKelasMapel from './modal-tambah-kelas-mapel';
import ModalTambahJadwal from './modal-tambah-jadwal';
import ModalTambahIzin from './modal-tambah-izin';
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
  XCircle
} from 'lucide-react';

import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PengumumanKelasGuru from './pengumuman-guru';
import ListKelas2 from './list-kelas-2';
import ListKelasMapel from './list-kelas-mapel';

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
    <div className='relative min-h-screen w-full px-0 md:px-5'>
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
        {/* <div className='text-center'>
          <h1 className='text-xl font-bold text-gray-800 dark:text-white'>
            Selamat datang, {session?.user?.nama} 👋
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{today}</p>
        </div> */}
        {/* Action Buttons - Clean & Modern */}

        <div className='flex w-full flex-col-reverse 2xl:flex-row 2xl:space-x-8'>
          <div className='flex w-full flex-col 2xl:w-[33%]'>
            {/* ✅ Hapus h-full di sini */}
            <div className='mt-4 flex flex-col rounded-xl border border-slate-200 p-5 shadow-lg dark:border-slate-700 md:mt-0'>
              <p className='mb-3 text-sm font-semibold text-slate-800 dark:text-slate-100 md:text-base lg:text-lg'>
                Summary Singkat
              </p>

              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
                {/* Kelas Diajar */}
                <div className='flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/30 md:min-h-[160px]'>
                  <span className='text-2xl font-bold text-blue-700 dark:text-blue-300'>
                    {dashboard?.SummarySingkat?.kelasDiajar || 0}
                  </span>
                  <span className='mt-1 text-center text-xs text-blue-600 dark:text-blue-400'>
                    Kelas Diajar
                  </span>
                </div>

                {/* Kelas Diwali */}
                <div className='flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-700 dark:bg-purple-900/30 md:min-h-[160px]'>
                  <span className='text-2xl font-bold text-purple-700 dark:text-purple-300'>
                    {dashboard?.SummarySingkat?.kelasDiwali || 0}
                  </span>
                  <span className='mt-1 text-center text-xs text-purple-600 dark:text-purple-400'>
                    Kelas Diwali
                  </span>
                </div>

                {/* Total Izin Bulan Ini */}
                <div className='flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/30 md:min-h-[160px]'>
                  <span className='text-2xl font-bold text-amber-700 dark:text-amber-300'>
                    {dashboard?.SummarySingkat?.izinBulanIni || 0}
                  </span>
                  <span className='mt-1 text-center text-xs text-amber-600 dark:text-amber-400'>
                    Total Izin Bulan Ini
                  </span>
                </div>

                {/* Total Jadwal */}
                <div className='flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/30 md:min-h-[160px]'>
                  <span className='text-2xl font-bold text-green-700 dark:text-green-300'>
                    {dashboard?.SummarySingkat?.totalJadwal || 0}
                  </span>
                  <span className='mt-1 text-center text-xs text-green-600 dark:text-green-400'>
                    Total Jadwal
                  </span>
                </div>

                {/* Total Murid */}
                <div className='flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-700 dark:bg-cyan-900/30 md:min-h-[160px]'>
                  <span className='text-2xl font-bold text-cyan-700 dark:text-cyan-300'>
                    {dashboard?.SummarySingkat?.totalMurid || 0}
                  </span>
                  <span className='mt-1 text-center text-xs text-cyan-600 dark:text-cyan-400'>
                    Total Murid
                  </span>
                </div>

                {/* Janji Temu */}
                <div className='flex min-h-[100px] flex-col items-center justify-center rounded-lg border border-pink-200 bg-pink-50 p-3 dark:border-pink-700 dark:bg-pink-900/30'>
                  <span className='text-2xl font-bold text-pink-700 dark:text-pink-300'>
                    {dashboard?.SummarySingkat?.janjiTemu || 0}
                  </span>
                  <span className='mt-1 text-center text-xs text-pink-600 dark:text-pink-400'>
                    Janji Temu
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-5 w-full 2xl:mt-0 2xl:w-[33%]'>
            <ListJadwalGuru jadwalGuru={dashboard?.jadwalGuru || []} />
          </div>
          <div className='mt-5 h-full w-full space-y-5 rounded-lg border-2 p-5 text-sm shadow-lg dark:border-gray-700 md:text-base 2xl:mt-0 2xl:w-[33%]'>
            {/* Status Absen */}
            <div className='space-y-6'>
              {/* Absen Masuk */}
              <div className='flex w-full items-center rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/30'>
                <span className='mr-3 font-bold text-gray-700 dark:text-gray-200'>
                  Absen Masuk :
                </span>
                {dashboard?.statusMasuk ? (
                  <div className='flex items-center gap-2'>
                    <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                    <p className='font-bold text-green-800 dark:text-green-300'>
                      Sudah Absen
                    </p>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <XCircle className='h-5 w-5 text-red-500 dark:text-red-400' />
                    <p className='font-bold text-red-800 dark:text-red-300'>
                      Belum Absen
                    </p>
                  </div>
                )}
              </div>

              {/* Absen Pulang */}
              <div className='flex w-full items-center rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/30'>
                <span className='mr-3 font-bold text-gray-700 dark:text-gray-200'>
                  Absen Pulang :
                </span>
                {dashboard?.statusKeluar ? (
                  <div className='flex items-center gap-2'>
                    <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                    <p className='font-bold text-green-800 dark:text-green-300'>
                      Sudah Absen
                    </p>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <XCircle className='h-5 w-5 text-red-500 dark:text-red-400' />
                    <p className='font-bold text-red-800 dark:text-red-300'>
                      Belum Absen
                    </p>
                  </div>
                )}
              </div>

              {/* Status Izin */}
              <div className='flex w-full items-center rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-700 dark:bg-yellow-900/30'>
                <span className='mr-3 font-bold text-gray-700 dark:text-gray-200'>
                  Status Izin :
                </span>
                {dashboard?.statusIzin ? (
                  <div className='flex items-center gap-2'>
                    <CheckCircle className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
                    <p className='font-bold text-yellow-800 dark:text-yellow-300'>
                      Sedang Izin
                    </p>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <XCircle className='h-5 w-5 text-red-500 dark:text-red-400' />
                    <p className='font-bold text-red-800 dark:text-red-300'>
                      Tidak Izin
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className='grid w-full grid-cols-2 gap-6'>
              {/* Masuk */}
              <Button
                onClick={() => setIsCameraOpen(true)}
                disabled={dashboard?.statusMasuk || dashboard?.statusIzin}
                className='flex min-h-[70px] flex-col items-center justify-center rounded-xl border bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-70 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
              >
                {dashboard?.statusMasuk ? (
                  <CheckCircle size={20} />
                ) : (
                  <Clock size={20} />
                )}
                <span className='mt-1 text-base font-medium'>Masuk</span>
              </Button>

              {/* Pulang */}
              <Button
                onClick={() => absenPulangMutation.mutate()}
                disabled={dashboard?.statusKeluar || dashboard?.statusIzin}
                className='flex min-h-[70px] flex-col items-center justify-center rounded-xl border bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-70 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
              >
                {dashboard?.statusKeluar ? (
                  <CheckCircle size={20} />
                ) : (
                  <LogOut size={20} />
                )}
                <span className='mt-1 text-base font-medium'>Pulang</span>
              </Button>

              {/* Izin */}
              <Button
                onClick={() => setShowIzinModal(true)}
                disabled={!!dashboard?.statusMasuk}
                className='flex min-h-[70px] flex-col items-center justify-center rounded-xl border bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-70 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'
              >
                {dashboard?.statusIzin ? (
                  <CheckCircle size={20} />
                ) : (
                  <FileText size={20} />
                )}
                <span className='mt-1 text-base font-medium'>Izin</span>
              </Button>

              {/* Jadwal */}
              <Button
                onClick={() => setShowJadwalModal(true)}
                className='flex min-h-[70px] flex-col items-center justify-center rounded-xl border bg-purple-100 text-purple-700 hover:bg-purple-200 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50'
              >
                <CalendarPlus size={20} />
                <span className='mt-1 text-base font-medium'>Jadwal</span>
              </Button>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col gap-4 xl:flex-row'>
          <div className='w-full xl:w-1/2'>
            <ListKelas2
              setOpenModal={setOpenModal}
              fetchData={() =>
                queryClient.invalidateQueries({
                  queryKey: ['dashboard-mengajar']
                })
              }
              kelasList={dashboard?.kelasWaliKelasKehadiran || []}
            />
          </div>
          <div className='w-full xl:w-1/2'>
            <ListKelasMapel
              setOpenModal={setOpenModal}
              fetchData={() =>
                queryClient.invalidateQueries({
                  queryKey: ['dashboard-mengajar']
                })
              }
              kelasMapel={dashboard?.kelasMapel || []}
            />
          </div>
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
