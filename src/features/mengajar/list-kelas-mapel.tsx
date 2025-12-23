// src/components/ListMapel.jsx
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Pencil,
  Trash2,
  ChevronRight
} from 'lucide-react';
import ModalHapusKelas from './modal-hapus-kelas';
import ModalTambahKelasMapel from './modal-tambah-kelas-mapel';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';

// ✅ Helper: generate opsi tahun ajaran
const generateTahunAjaranOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = ['Semua Kelas'];
  for (let i = -5; i <= 5; i++) {
    const start = currentYear + i;
    const end = start + 1;
    options.push(`${start}-${end}`);
  }
  return options;
};

// Helper: ambil inisial
const getInitials = (str: any) => {
  return str
    .split(' ')
    .map((word: any) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

type dataEditMapel = {
  id: string;
  namaMapel: string;
  kelas: string;
  ruangKelas: string;
};

type Props = {
  setOpenModal: (val: string | null) => void;
  kelasMapel: any[];
  fetchData: () => void;
};

export default function ListKelasMapel({
  setOpenModal,
  kelasMapel,
  fetchData
}: Props) {
  const router = useRouter();
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState<string | null>(null);
  const [dataDelete, setDataDelete] = useState({
    id: '',
    jenis: ''
  });
  const [dataEditMapel, setEditMapel] = useState<dataEditMapel>({
    id: '',
    namaMapel: '',
    kelas: '',
    ruangKelas: ''
  });

  // ✅ State filter tahun ajaran
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('Semua Kelas');

  const openDeleteModal = (id: string, jenis: string) => {
    setModalDeleteOpen(true);
    setDataDelete({ id, jenis });
  };

  const openEditModalMapel = ({
    id,
    namaMapel,
    ruangKelas,
    kelas
  }: dataEditMapel) => {
    setOpenModalEdit('mapel');
    setEditMapel({ id, namaMapel, kelas, ruangKelas });
  };

  // ✅ Filter data berdasarkan tahun ajaran
  const kelasMapelFiltered = useMemo(() => {
    if (filterTahunAjaran === 'Semua Kelas') return kelasMapel;
    return kelasMapel.filter(
      (mapel) => mapel.tahunAjaran === filterTahunAjaran
    );
  }, [kelasMapel, filterTahunAjaran]);

  const tahunAjaranOptions = generateTahunAjaranOptions();

  if (kelasMapel.length === 0) {
    return (
      <div className='rounded-xl border bg-white p-6 shadow-sm'>
        <div className='my-5 flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
          <CardTitle>Mata Pelajaran</CardTitle>
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
              onClick={() => setOpenModal('mapel')}
              className='w-full sm:w-auto'
            >
              + Mata Pelajaran
            </Button>
          </div>
        </div>
        <div className='rounded-xl border bg-white p-6 shadow-sm'>
          <p className='text-center text-gray-500'>
            Belum ada data mata pelajaran
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className='p-3 md:p-8'>
      <div className='mb-5 flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
        <CardTitle>Kelas Mata Pelajaran</CardTitle>
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
            onClick={() => setOpenModal('mapel')}
            className='w-full sm:w-auto'
          >
            + Mata Pelajaran
          </Button>
        </div>
      </div>

      {kelasMapelFiltered.length === 0 ? (
        <p className='py-8 text-center text-muted-foreground'>
          Tidak ada mata pelajaran untuk tahun ajaran ini.
        </p>
      ) : (
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2'>
          {kelasMapelFiltered.map((mapel: any) => (
            <div
              key={mapel.id}
              className='group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-indigo-500 hover:shadow-md'
            >
              {/* Banner / Image */}
              <div className='relative h-[100px] w-full'>
                {mapel.banner ? (
                  <img
                    src={mapel.banner}
                    alt={mapel.namaMapel}
                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 text-2xl font-bold text-white'>
                    {getInitials(mapel.namaMapel)}
                  </div>
                )}

                {/* Overlay Mobile */}
                <div className='absolute inset-0 flex items-center justify-center bg-black/20 text-center md:hidden'>
                  <div>
                    <h3 className='text-xl font-bold text-white drop-shadow'>
                      {mapel.namaMapel}
                    </h3>
                    <p className='text-xs text-white/90 drop-shadow'>
                      {mapel.kelas}
                    </p>
                    <p className='text-xs text-white/90 drop-shadow'>
                      {mapel.ruangKelas}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className='flex-1 p-4 md:p-5'>
                <div className='mb-4 flex items-start justify-between'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='text-lg font-bold text-gray-900'>
                        {mapel.namaMapel}
                      </h3>
                      <ChevronRight className='h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100' />
                    </div>
                    <div className='mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600'>
                      <span>TA {mapel.tahunAjaran}</span>
                      <span>•</span>
                      <span>{mapel.ruangKelas}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 md:opacity-100'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModalMapel({
                          id: mapel.id,
                          namaMapel: mapel.namaMapel,
                          ruangKelas: mapel.ruangKelas,
                          kelas: mapel.kelas
                        });
                      }}
                      className='rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50'
                    >
                      <Pencil className='h-4 w-4' />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(mapel.id, 'mapel');
                      }}
                      className='rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                <div className='mb-4 block md:hidden'>
                  <div className='text-sm font-semibold text-gray-900'>
                    {mapel.kelas}
                  </div>
                  {/* <div className='text-xs text-gray-600'>
                    {mapel.ruangKelas} • TA {mapel.tahunAjaran}
                  </div> */}
                </div>

                <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1'>
                  <span className='text-sm font-semibold text-indigo-800'>
                    {mapel._count?.DaftarSiswa || 0} Siswa
                  </span>
                </div>

                <div className='grid grid-cols-3 gap-2'>
                  {[
                    {
                      label: 'Materi',
                      count: mapel._count?.MateriMapel || 0,
                      icon: BookOpen,
                      color: 'blue'
                    },
                    {
                      label: 'Tugas',
                      count: mapel._count?.TugasMapel || 0,
                      icon: ClipboardList,
                      color: 'amber'
                    },
                    {
                      label: 'Ujian',
                      count: mapel._count?.UjianIframe || 0,
                      icon: CalendarCheck,
                      color: 'green'
                    }
                  ].map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center rounded-lg border border-${item.color}-200 bg-${item.color}-50 p-2 transition-all hover:shadow-sm`}
                      >
                        <IconComponent
                          className={`mb-1 h-4 w-4 text-${item.color}-700`}
                        />
                        <span
                          className={`text-sm font-bold text-${item.color}-900`}
                        >
                          {item.count}
                        </span>
                        <span className={`text-[10px] text-${item.color}-700`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className='mt-3 w-full'>
                  <Link href={`/mengajar/kelas-mapel/${mapel.id}`}>
                    <Button className='w-full'>Masuk Kelas</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalHapusKelas
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        idKelas={dataDelete.id}
        fetchData={fetchData}
        jenis={dataDelete.jenis}
      />

      <ModalTambahKelasMapel
        openModal={openModalEdit}
        dataEdit={dataEditMapel}
        setOpenModal={setOpenModalEdit}
      />
    </Card>
  );
}
