import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  FileText,
  Pencil,
  Trash2,
  ChevronRight
} from 'lucide-react';
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

// Helper: generate tahun ajaran dari 5 tahun lalu sampai 5 tahun depan
const generateTahunAjaranOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = ['Semua Kelas']; // opsi pertama

  // 5 tahun ke belakang → 2020/2021
  for (let i = -5; i <= 5; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    options.push(`${startYear}-${endYear}`);
  }

  return options;
};

const getInitials = (nama: any) => {
  return nama
    .split(' ')
    .map((word: any) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

type Props = {
  setOpenModal: (val: string | null) => void;
  kelasList: any[];
  fetchData: () => void;
};

type dataEditKelas = {
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
  const [dataDelete, setDataDelete] = useState({
    id: '',
    jenis: ''
  });
  const [dataEditKelas, setEditKelas] = useState<dataEditKelas>({
    id: '',
    nama: '',
    ruangKelas: ''
  });

  // ✅ State untuk filter tahun ajaran
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('Semua Kelas');

  const openEditModalKelas = ({ id, nama, ruangKelas }: dataEditKelas) => {
    setOpenModalEdit('kelas');
    setEditKelas({ id, nama, ruangKelas });
  };

  const openDeleteModal = (id: string, jenis: string) => {
    setModalDeleteOpen(true);
    setDataDelete({ id, jenis });
  };

  // ✅ Filter kelas berdasarkan tahun ajaran
  const kelasListFiltered = useMemo(() => {
    if (filterTahunAjaran === 'Semua Kelas') return kelasList;
    return kelasList.filter((kelas) => kelas.tahunAjaran === filterTahunAjaran);
  }, [kelasList, filterTahunAjaran]);

  const tahunAjaranOptions = generateTahunAjaranOptions();

  if (kelasList.length === 0) {
    return (
      <div className='rounded-xl border bg-white p-6 shadow-sm'>
        <div className='my-5 flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
          <CardTitle>Kelas</CardTitle>
          <div className='flex w-full gap-2 sm:w-auto'>
            <Select
              value={filterTahunAjaran}
              onValueChange={setFilterTahunAjaran}
            >
              <SelectTrigger className='w-full sm:w-[180px]'>
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
            <Button
              onClick={() => setOpenModal('kelas')}
              className='w-full sm:w-auto'
            >
              + Kelas
            </Button>
          </div>
        </div>
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <p className='text-center text-gray-500'>Belum ada data kelas</p>
        </div>
      </div>
    );
  }

  return (
    <Card className='p-3 md:p-8'>
      <div className='mb-5 flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
        <CardTitle>Kelas</CardTitle>
        <div className='flex w-full gap-2 sm:w-auto'>
          <Select
            value={filterTahunAjaran}
            onValueChange={setFilterTahunAjaran}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
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
          <Button
            onClick={() => setOpenModal('kelas')}
            className='w-full sm:w-auto'
          >
            + Kelas
          </Button>
        </div>
      </div>

      {kelasListFiltered.length === 0 ? (
        <p className='py-8 text-center text-muted-foreground'>
          Tidak ada kelas untuk tahun ajaran ini.
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
          {kelasListFiltered.map((kelas: any) => {
            const persenHadir =
              kelas.totalSiswa > 0
                ? Math.round((kelas.hadirHariIni / kelas.totalSiswa) * 100)
                : 0;

            const alphaHariIni =
              kelas.totalSiswa -
              kelas.hadirHariIni -
              kelas.izinHariIni -
              kelas.sakitHariIni;

            return (
              <div
                key={kelas.id}
                className='group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-500 hover:shadow-md'
              >
                <div className='flex flex-col'>
                  {/* Banner */}
                  <div className='relative h-[100px] w-full'>
                    {kelas.banner ? (
                      <img
                        src={kelas.banner}
                        alt={kelas.nama}
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-2xl font-bold text-white'>
                        {getInitials(kelas.nama || 'Kelas')}
                      </div>
                    )}

                    <div className='absolute inset-0 flex items-center justify-center bg-black/20 text-center md:hidden'>
                      <div>
                        <h3 className='text-xl font-bold text-white drop-shadow'>
                          {kelas.nama}
                        </h3>
                        <p className='text-xs text-white/90 drop-shadow'>
                          TA {kelas.tahunAjaran}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Konten */}
                  <div className='flex-1 p-4 md:p-5'>
                    <div className='mb-4 flex items-start justify-between'>
                      <div>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-lg font-bold text-gray-900'>
                            {kelas.nama}
                          </h3>
                          <ChevronRight className='h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100' />
                        </div>
                        <div className='mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600'>
                          <span>TA {kelas.tahunAjaran}</span>
                          <span>•</span>
                          <span>{kelas.ruangKelas}</span>
                        </div>
                      </div>
                      <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-100'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModalKelas({
                              id: kelas.id,
                              nama: kelas.nama,
                              ruangKelas: kelas.ruangKelas
                            });
                          }}
                          className='rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50'
                        >
                          <Pencil className='h-4 w-4' />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(kelas.id, 'wali');
                          }}
                          className='rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </div>

                    <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1'>
                      <span className='text-sm font-semibold text-blue-800'>
                        {kelas._count?.DaftarSiswaKelas || 0} Siswa
                      </span>
                    </div>

                    {kelas.kehadiran && (
                      <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
                        {[
                          {
                            label: 'Hadir',
                            value: kelas.kehadiran.Hadir,
                            color: 'green',
                            percent: true
                          },
                          {
                            label: 'Alpha',
                            value: kelas.kehadiran.TanpaKeterangan,
                            color: 'red'
                          },
                          {
                            label: 'Izin',
                            value: kelas.kehadiran.Izin,
                            color: 'amber'
                          },
                          {
                            label: 'Sakit',
                            value: kelas.kehadiran.Sakit,
                            color: 'blue'
                          }
                        ].map((stat, idx) => {
                          const totalSiswa =
                            kelas._count?.DaftarSiswaKelas || 1;
                          const percent = Math.round(
                            (stat.value / totalSiswa) * 100
                          );
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col items-center rounded-lg border border-${stat.color}-200 bg-${stat.color}-50 p-2 transition-all hover:shadow-sm`}
                            >
                              <span
                                className={`text-sm font-bold text-${stat.color}-900`}
                              >
                                {stat.value}
                              </span>
                              <span
                                className={`text-[10px] font-medium text-${stat.color}-700`}
                              >
                                {stat.percent ? `(${percent}%)` : stat.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className='mt-3 w-full'>
                      <Link href={`/mengajar/walikelas/${kelas.id}`}>
                        <Button className='w-full'>Masuk Kelas</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
