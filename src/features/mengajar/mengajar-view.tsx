'use client';

import { useEffect, useState } from 'react';
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
import { API } from '@/lib/server';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function MengajarViewPage() {
  const { data: session } = useSession();

  const [dashboard, setDashboard] = useState({
    statusMasuk: false,
    statusKeluar: false,
    statusIzin: false,
    jadwalGuru: [],
    kelasWaliKelas: [],
    kelasMapel: [],
    perizinan: []
  });

  const dataDashboard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}dashboard-mengajar`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          }
        }
      );

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || 'Gagal mengambil data dashboard');
      }

      const result = await response.json();
      const data = result.data;

      setDashboard({
        statusMasuk: data.statusMasuk,
        statusKeluar: data.statusKeluar,
        statusIzin: data.statusIzin,
        jadwalGuru: data.jadwalGuru,
        kelasWaliKelas: data.kelasWaliKelas,
        kelasMapel: data.kelasMapel,
        perizinan: data.perizinan
      });
    } catch (error) {
      toast.error('Gagal mengambil dashboard');
    }
  };

  const [showIzinModal, setShowIzinModal] = useState(false);
  const [showJadwalModal, setShowJadwalModal] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [absenType, setAbsenType] = useState<any>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.token) {
      dataDashboard();
    }
  }, [session]);

  // Contoh data (ganti dengan data asli dari props atau API)
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const absenPulang = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}absen-pulang`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.token}`
          },
          body: JSON.stringify({
            lat: '-6.09955851839959',
            long: '106.51911493230111'
          })
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal absen');
      }

      dataDashboard();
      const result = await response.json();
      toast.success(result.message || 'Absen pulang berhasil');
    } catch (error: any) {
      toast.error(error?.message || 'Gagal absen');
    }
  };

  return (
    <div className='relative min-h-screen space-y-6 p-6'>
      {/* Camera Modal */}
      {isCameraOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <Camera
            fetchData={dataDashboard}
            open={isCameraOpen}
            setOpen={setIsCameraOpen}
          />
        </div>
      )}

      {/* Greeting */}
      <div>
        <h1 className='text-xl font-bold'>Selamat datang, Pak Andi 👋</h1>
      </div>

      {/* Absen Buttons */}
      <div className='flex flex-wrap gap-4'>
        <Button
          onClick={() => setIsCameraOpen(true)}
          disabled={dashboard.statusMasuk || dashboard.statusIzin}
        >
          {dashboard.statusMasuk
            ? `✅ Sudah Absen Masuk (${dashboard.statusMasuk})`
            : '🕘 Absen Masuk'}
        </Button>
        <Button
          onClick={absenPulang}
          disabled={dashboard.statusKeluar || dashboard.statusIzin}
        >
          {dashboard.statusKeluar
            ? `✅ Sudah Absen Pulang (${dashboard.statusKeluar})`
            : '🏁 Absen Pulang'}
        </Button>
        <Button
          variant='outline'
          onClick={() => setShowIzinModal(true)}
          disabled={dashboard.statusMasuk}
        >
          {dashboard.statusIzin
            ? '📋 Telah Izin Tidak Hadir'
            : '📋 Izin Tidak Hadir'}
        </Button>
        <Button variant='outline' onClick={() => setShowJadwalModal(true)}>
          Tambah Jadwal +
        </Button>
      </div>

      <ModalTambahJadwal
        fetchData={dataDashboard}
        openModal={showJadwalModal}
        setOpenModal={setShowJadwalModal}
      />

      <ModalTambahIzin
        fetchData={dataDashboard}
        openModal={showIzinModal}
        setOpenModal={setShowIzinModal}
      />

      {/* Status Summary */}
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Card className='flex flex-col items-center justify-center p-4 text-center'>
          <p className='mb-1 text-xs text-muted-foreground'>Status Masuk</p>
          <p
            className={`text-sm font-semibold ${
              dashboard.statusMasuk ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {dashboard.statusMasuk
              ? `✅ (${dashboard.statusMasuk})`
              : '❌ Belum Absen'}
          </p>
        </Card>

        <Card className='flex flex-col items-center justify-center p-4 text-center'>
          <p className='mb-1 text-sm text-muted-foreground'>Status Pulang</p>
          <p
            className={`text-sm font-semibold ${
              dashboard.statusKeluar ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {dashboard.statusKeluar
              ? `✅ (${dashboard.statusKeluar})`
              : '❌ Belum Absen'}
          </p>
        </Card>

        <Card className='flex flex-col items-center justify-center p-4 text-center'>
          <p className='mb-1 text-sm text-muted-foreground'>Status Izin</p>
          <p
            className={`text-sm font-semibold ${
              dashboard.statusIzin ? 'text-yellow-600' : ''
            }`}
          >
            {dashboard.statusIzin ? '📋 Izin Tidak Hadir' : '❌ Tidak Izin'}
          </p>
        </Card>
      </div>

      {/* Jadwal Hari Ini */}
      <ListJadwalGuru
        jadwalGuru={dashboard?.jadwalGuru}
        fetchData={dataDashboard}
      />

      {/* Wali Kelas & Kelas Diajar */}
      <ListKelasGuru
        kelasMapel={dashboard?.kelasMapel || []}
        kelasWaliKelas={dashboard?.kelasWaliKelas || []}
        setOpenModal={setOpenModal}
        fetchData={dataDashboard}
      />

      {/* Modal Tambah Kelas */}
      <ModalTambahKelas
        fetchData={dataDashboard}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      {/* Modal Tambah Kelas Mapel */}
      <ModalTambahKelasMapel
        fetchData={dataDashboard}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      <div className=''></div>

      <CardListIzin izin={dashboard?.perizinan} fetchData={dataDashboard} />
    </div>
  );
}
