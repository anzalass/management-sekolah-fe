import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import ModalTambahKelas from './modal-tambah-kelas';
import ModalHapusKelas from './modal-hapus-kelas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';

// ===== Helper =====
const generateTahunAjaranOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = ['Semua Kelas'];

  for (let i = -5; i <= 5; i++) {
    const start = currentYear + i;
    options.push(`${start}-${start + 1}`);
  }

  return options;
};

const getInitials = (nama: string) =>
  nama
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

type Props = {
  setOpenModal: (val: string | null) => void;
  kelasList: any[];
  fetchData: () => void;
};

type DataEditKelas = {
  id: string;
  nama: string;
  ruangKelas: string;
};

export default function ListKelas2({
  setOpenModal,
  kelasList,
  fetchData
}: Props) {
  const [openModalEdit, setOpenModalEdit] = useState<string | null>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [dataDelete, setDataDelete] = useState({ id: '', jenis: '' });
  const [dataEditKelas, setEditKelas] = useState<DataEditKelas>({
    id: '',
    nama: '',
    ruangKelas: ''
  });
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('Semua Kelas');

  const tahunAjaranOptions = generateTahunAjaranOptions();

  const kelasListFiltered = useMemo(() => {
    if (filterTahunAjaran === 'Semua Kelas') return kelasList;
    return kelasList.filter((k) => k.tahunAjaran === filterTahunAjaran);
  }, [kelasList, filterTahunAjaran]);

  const openEditModalKelas = ({ id, nama, ruangKelas }: DataEditKelas) => {
    setOpenModalEdit('kelas');
    setEditKelas({ id, nama, ruangKelas });
  };

  const openDeleteModal = (id: string, jenis: string) => {
    setModalDeleteOpen(true);
    setDataDelete({ id, jenis });
  };

  if (kelasList.length === 0) {
    return (
      <Card className='p-6 dark:bg-slate-900'>
        <div className='flex justify-between'>
          <CardTitle>Kelas</CardTitle>
          <Button onClick={() => setOpenModal('kelas')}>+ Kelas</Button>
        </div>

        <p className='mt-4 text-center text-muted-foreground'>
          Belum ada data kelas
        </p>
      </Card>
    );
  }

  return (
    <Card className='p-4 md:p-8'>
      {/* ===== HEADER ===== */}
      <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <CardTitle>Kelas</CardTitle>

        <div className='flex gap-2'>
          <Select
            value={filterTahunAjaran}
            onValueChange={setFilterTahunAjaran}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tahunAjaranOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setOpenModal('kelas')}>+ Kelas</Button>
        </div>
      </div>

      {/* ===== LIST ===== */}
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
        {kelasListFiltered.map((kelas) => {
          const stats = [
            {
              label: 'Hadir',
              value: kelas.kehadiran?.Hadir || 0,
              bg: 'bg-green-50 dark:bg-green-900/30',
              text: 'text-green-700 dark:text-green-300'
            },
            {
              label: 'Alpha',
              value: kelas.kehadiran?.TanpaKeterangan || 0,
              bg: 'bg-red-50 dark:bg-red-900/30',
              text: 'text-red-700 dark:text-red-300'
            },
            {
              label: 'Izin',
              value: kelas.kehadiran?.Izin || 0,
              bg: 'bg-amber-50 dark:bg-amber-900/30',
              text: 'text-amber-700 dark:text-amber-300'
            },
            {
              label: 'Sakit',
              value: kelas.kehadiran?.Sakit || 0,
              bg: 'bg-blue-50 dark:bg-blue-900/30',
              text: 'text-blue-700 dark:text-blue-300'
            }
          ];

          return (
            <div
              key={kelas.id}
              className='group overflow-hidden rounded-xl border border-gray-200 shadow-sm transition hover:border-blue-500 hover:shadow-md dark:border-slate-700'
            >
              {/* ===== BANNER ===== */}
              <div className='flex h-[100px] items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-2xl font-bold text-white'>
                {getInitials(kelas.nama)}
              </div>

              {/* ===== CONTENT ===== */}
              <div className='p-4'>
                {/* HEADER + ACTION */}
                <div className='flex items-start justify-between'>
                  <h3 className='font-bold text-gray-900 dark:text-white'>
                    {kelas.nama}
                  </h3>

                  {/* ACTION BUTTON */}
                  <div className='flex gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModalKelas({
                          id: kelas.id,
                          nama: kelas.nama,
                          ruangKelas: kelas.ruangKelas
                        });
                      }}
                      className='rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
                    >
                      <Pencil className='h-4 w-4' />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(kelas.id, 'wali');
                      }}
                      className='rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <div className='mt-3 flex w-full justify-between text-xs font-bold'>
                  <p>{kelas.tahunAjaran}</p>
                  <p>{kelas.ruangKelas}</p>
                </div>

                {/* STATS */}
                <div className='mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4'>
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-2 text-center ${stat.bg}`}
                    >
                      <div className={`font-bold ${stat.text}`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs ${stat.text}`}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* BUTTON */}
                <Link
                  href={`/mengajar/walikelas/${kelas.id}`}
                  className='mt-4 block'
                >
                  <Button className='w-full'>Masuk Kelas</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== MODAL ===== */}
      <ModalTambahKelas
        openModal={openModalEdit}
        setOpenModal={setOpenModalEdit}
        dataEdit={dataEditKelas}
      />

      <ModalHapusKelas
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        idKelas={dataDelete.id}
        fetchData={fetchData}
        jenis={dataDelete.jenis}
      />
    </Card>
  );
}
