'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Users, Trash2, Pencil } from 'lucide-react';
import ModalHapusKelas from './modal-hapus-kelas';
import ModalTambahKelas from './modal-tambah-kelas';
import ModalTambahKelasMapel from './modal-tambah-kelas-mapel';

type Props = {
  setOpenModal: (val: string | null) => void;
  kelasWaliKelas: any[];
  kelasMapel: any[];
  fetchData: () => void;
};

type dataEditMapel = {
  id: string;
  namaMapel: string;
  kelas: string;
  ruangKelas: string;
};

type dataEditKelas = {
  id: string;
  nama: string;
  ruangKelas: string;
};

export default function ListKelasGuru({
  setOpenModal,
  kelasWaliKelas,
  kelasMapel,
  fetchData
}: Props) {
  const router = useRouter();
  const [modalDeleteOpen, setModalDeleteOpen] = React.useState(false);
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

  const [dataEditKelas, setEditKelas] = useState<dataEditKelas>({
    id: '',
    nama: '',
    ruangKelas: ''
  });

  const openDeleteModal = (id: string, jenis: string) => {
    setModalDeleteOpen(true);
    setDataDelete({
      id: id,
      jenis: jenis
    });
  };

  const openEditModalMapel = ({
    id,
    namaMapel,
    ruangKelas,
    kelas
  }: dataEditMapel) => {
    setOpenModalEdit('mapel');
    setEditMapel({
      id: id,
      namaMapel: namaMapel,
      kelas: kelas,
      ruangKelas: ruangKelas
    });
  };

  const openEditModalKelas = ({ id, nama, ruangKelas }: dataEditKelas) => {
    setOpenModalEdit('kelas');
    setEditKelas({
      id: id,
      nama: nama,
      ruangKelas: ruangKelas
    });
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Wali Kelas */}
        <Card className='shadow-md'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <GraduationCap className='h-5 w-5 text-primary' />
                <CardTitle className='text-lg font-semibold'>
                  Wali Kelas
                </CardTitle>
              </div>
              <Button
                size='sm'
                variant='default'
                onClick={() => setOpenModal('kelas')}
              >
                Tambah Kelas
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {kelasWaliKelas.map((kelas, idx) => (
              <div
                key={idx}
                className='cursor-pointer rounded-xl border border-muted p-5 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md'
                onClick={() =>
                  router.push(`/dashboard/mengajar/walikelas/${kelas.id}`)
                }
              >
                <div className='mb-1 flex items-center justify-between'>
                  <div className='text-base font-semibold'>{kelas.nama}</div>
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModalKelas({
                          id: kelas.id,
                          nama: kelas.nama,
                          ruangKelas: kelas.ruangKelas
                        });
                      }}
                    >
                      <Pencil className='h-4 w-4 text-primary' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(kelas.id, 'wali');
                      }}
                    >
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </div>
                <div className='text-sm text-muted-foreground'>
                  Tahun Ajaran:{' '}
                  <span className='font-medium'>{kelas.tahunAjaran}</span>
                </div>
                <div className='mt-2 flex items-center text-sm text-muted-foreground'>
                  <Users className='mr-1 h-4 w-4 text-muted-foreground' />
                  {kelas.jumlahSiswa} siswa
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kelas Mapel */}
        <Card className='shadow-md'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5 text-primary' />
                <CardTitle className='text-lg font-semibold'>
                  Mengajar di Kelas
                </CardTitle>
              </div>
              <Button
                size='sm'
                variant='default'
                onClick={() => setOpenModal('mapel')}
              >
                Tambah Kelas Mapel
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {kelasMapel.map((item, idx) => (
              <div
                key={idx}
                onClick={() =>
                  router.push(`/dashboard/mengajar/kelas-mapel/${item.id}`)
                }
                className='cursor-pointer rounded-xl border border-muted p-5 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md'
              >
                <div className='mb-1 flex items-center justify-between'>
                  <div className='text-base font-semibold'>
                    {item.namaMapel}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModalMapel({
                          id: item.id,
                          namaMapel: item.namaMapel,
                          ruangKelas: item.ruangKelas,
                          kelas: item.kelas
                        });
                      }}
                    >
                      <Pencil className='h-4 w-4 text-primary' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(item.id, 'mapel');
                      }}
                    >
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </div>
                <div className='text-sm text-muted-foreground'>
                  Kelas: <span className='font-medium'>{item.kelas}</span>
                </div>
                <div className='mt-2 flex items-center text-sm text-muted-foreground'>
                  <Users className='mr-1 h-4 w-4 text-muted-foreground' />
                  {item.jumlahSiswa} siswa
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal Hapus */}
      <ModalHapusKelas
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        idKelas={dataDelete.id}
        fetchData={fetchData}
        jenis={dataDelete.jenis}
      />

      <ModalTambahKelas
        fetchData={fetchData}
        openModal={openModalEdit}
        setOpenModal={setOpenModalEdit}
        dataEdit={dataEditKelas}
      />
      <ModalTambahKelasMapel
        fetchData={fetchData}
        openModal={openModalEdit}
        dataEdit={dataEditMapel}
        setOpenModal={setOpenModalEdit}
      />
    </>
  );
}
