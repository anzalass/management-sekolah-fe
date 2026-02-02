// src/components/ListMapel.tsx
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  ClipboardList,
  CalendarCheck,
  Pencil,
  Trash2
} from 'lucide-react';
import ModalHapusKelas from './modal-hapus-kelas';
import ModalTambahKelasMapel from './modal-tambah-kelas-mapel';
import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';

/* ===================== TYPES ===================== */
type CountMapel = {
  MateriMapel?: number;
  TugasMapel?: number;
  UjianIframe?: number;
  DaftarSiswa?: number;
};

export type KelasMapel = {
  id: string;
  namaMapel: string;
  kelas: string;
  ruangKelas: string;
  tahunAjaran: string;
  banner?: string | null;
  _count?: CountMapel;
};

type DataEditMapel = {
  id: string;
  namaMapel: string;
  kelas: string;
  ruangKelas: string;
};

type Props = {
  setOpenModal: (val: string | null) => void;
  kelasMapel: KelasMapel[];
  fetchData: () => void;
};

/* ===================== HELPERS ===================== */
const generateTahunAjaranOptions = (): string[] => {
  const year = new Date().getFullYear();
  const options: string[] = ['Semua Kelas'];
  for (let i = -5; i <= 5; i++) {
    options.push(`${year + i}-${year + i + 1}`);
  }
  return options;
};

const getInitials = (str: string): string =>
  str
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/* ===================== COLOR MAP ===================== */
const statColor = {
  blue: {
    box: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
    icon: 'text-blue-700 dark:text-blue-300',
    value: 'text-blue-900 dark:text-blue-200',
    label: 'text-blue-700 dark:text-blue-400'
  },
  amber: {
    box: 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700',
    icon: 'text-amber-700 dark:text-amber-300',
    value: 'text-amber-900 dark:text-amber-200',
    label: 'text-amber-700 dark:text-amber-400'
  },
  green: {
    box: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700',
    icon: 'text-green-700 dark:text-green-300',
    value: 'text-green-900 dark:text-green-200',
    label: 'text-green-700 dark:text-green-400'
  }
} as const;

/* ===================== COMPONENT ===================== */
export default function ListKelasMapel({
  setOpenModal,
  kelasMapel,
  fetchData
}: Props) {
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<string | null>(null);

  const [dataDelete, setDataDelete] = useState<{
    id: string;
    jenis: string;
  }>({ id: '', jenis: '' });

  const [dataEditMapel, setEditMapel] = useState<DataEditMapel>({
    id: '',
    namaMapel: '',
    kelas: '',
    ruangKelas: ''
  });

  const [filterTahunAjaran, setFilterTahunAjaran] =
    useState<string>('Semua Kelas');

  const kelasMapelFiltered = useMemo(() => {
    if (filterTahunAjaran === 'Semua Kelas') return kelasMapel;
    return kelasMapel.filter((m) => m.tahunAjaran === filterTahunAjaran);
  }, [kelasMapel, filterTahunAjaran]);

  const tahunAjaranOptions = generateTahunAjaranOptions();

  /* ===================== EMPTY ===================== */
  if (kelasMapel.length === 0) {
    return (
      <Card className='p-6 dark:border-slate-700'>
        <div className='flex justify-between'>
          <CardTitle>Mata Pelajaran</CardTitle>

          <Button
            className='flex text-sm md:text-base'
            onClick={() => setOpenModal('mapel')}
          >
            + Mapel
          </Button>
        </div>
        <p className='mt-6 text-center text-muted-foreground'>
          Belum ada data mata pelajaran
        </p>
      </Card>
    );
  }

  /* ===================== UI ===================== */
  return (
    <Card className='p-4 dark:border-slate-700 md:p-8'>
      {/* HEADER */}
      <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <CardTitle>Kelas Mata Pelajaran</CardTitle>

        <div className='flex gap-2 sm:w-auto'>
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
            className='flex w-1/2 text-sm md:text-base'
            onClick={() => setOpenModal('mapel')}
          >
            + Mapel
          </Button>
        </div>
      </div>

      {/* GRID */}
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
        {kelasMapelFiltered.map((mapel) => (
          <div
            key={mapel.id}
            className='group overflow-hidden rounded-xl border shadow-sm transition hover:border-indigo-500 hover:shadow-md dark:border-slate-700'
          >
            {/* BANNER */}
            <div className='relative h-[100px]'>
              {mapel.banner ? (
                <img
                  src={mapel.banner}
                  alt={mapel.namaMapel}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 text-2xl font-bold text-white'>
                  {getInitials(mapel.namaMapel)}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className='p-4'>
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <h3 className='text-lg font-bold'>{mapel.namaMapel}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {mapel.kelas} • {mapel.ruangKelas}
                  </p>
                </div>

                <div className='flex gap-1 opacity-0 transition group-hover:opacity-100'>
                  <button
                    onClick={() => {
                      setEditMapel({
                        id: mapel.id,
                        namaMapel: mapel.namaMapel,
                        kelas: mapel.kelas,
                        ruangKelas: mapel.ruangKelas
                      });
                      setOpenModalEdit('mapel');
                    }}
                    className='rounded-lg p-2 hover:bg-blue-100 dark:hover:bg-blue-900'
                  >
                    <Pencil className='h-4 w-4 text-blue-600' />
                  </button>

                  <button
                    onClick={() => {
                      setDataDelete({ id: mapel.id, jenis: 'mapel' });
                      setModalDeleteOpen(true);
                    }}
                    className='rounded-lg p-2 hover:bg-red-100 dark:hover:bg-red-900'
                  >
                    <Trash2 className='h-4 w-4 text-red-600' />
                  </button>
                </div>
              </div>

              {/* STATS */}
              <div className='grid grid-cols-3 gap-2'>
                {[
                  {
                    label: 'Materi',
                    count: mapel._count?.MateriMapel ?? 0,
                    icon: BookOpen,
                    color: 'blue'
                  },
                  {
                    label: 'Tugas',
                    count: mapel._count?.TugasMapel ?? 0,
                    icon: ClipboardList,
                    color: 'amber'
                  },
                  {
                    label: 'Ujian',
                    count: mapel._count?.UjianIframe ?? 0,
                    icon: CalendarCheck,
                    color: 'green'
                  }
                ].map((item: any, i: any) => {
                  const Icon = item.icon;
                  const c = statColor[item.color];
                  return (
                    <div
                      key={i}
                      className={`rounded-lg border p-2 text-center ${c.box}`}
                    >
                      <Icon className={`mx-auto mb-1 h-4 w-4 ${c.icon}`} />
                      <div className={`font-bold ${c.value}`}>{item.count}</div>
                      <div className={`text-[10px] ${c.label}`}>
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href={`/mengajar/kelas-mapel/${mapel.id}`}
                className='mt-4 block'
              >
                <Button className='w-full'>Masuk Kelas</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <ModalHapusKelas
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        idKelas={dataDelete.id}
        jenis={dataDelete.jenis}
        fetchData={fetchData}
      />

      <ModalTambahKelasMapel
        openModal={openModalEdit}
        dataEdit={dataEditMapel}
        setOpenModal={setOpenModalEdit}
      />
    </Card>
  );
}
