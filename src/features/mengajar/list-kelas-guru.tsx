'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Users, Trash2, Pencil } from 'lucide-react';
import ModalHapusKelas from './modal-hapus-kelas';
import ModalTambahKelas from './modal-tambah-kelas';
import ModalTambahKelasMapel from './modal-tambah-kelas-mapel';
import Image from 'next/image';

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

  const getInitials = (name: string): string => {
    if (!name) return '?';

    return name
      .split(' ') // pecah jadi array kata
      .map((word) => word[0]) // ambil huruf pertama tiap kata
      .join('') // gabung jadi string
      .substring(0, 4) // batasi maks 4 huruf biar tidak kepanjangan
      .toUpperCase();
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Wali Kelas */}
        <Card className='border-2 p-3 shadow-md md:p-6'>
          <CardHeader className='p-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <GraduationCap className='hidden h-5 w-5 text-primary md:block' />
                <CardTitle className='text-sm font-semibold lg:text-lg'>
                  Wali Kelas
                </CardTitle>
              </div>
              <Button
                size='sm'
                variant='default'
                onClick={() => setOpenModal('kelas')}
              >
                Kelas +
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4 p-2'>
            {kelasWaliKelas.map((kelas, idx) => (
              <div
                key={idx}
                className='cursor-pointer rounded-xl border border-muted p-2 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md md:p-5'
                onClick={() => router.push(`/mengajar/walikelas/${kelas.id}`)}
              >
                <div className='flex items-start gap-4'>
                  {/* Image di kiri */}
                  <div className='h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-lg bg-muted'>
                    {kelas.banner ? (
                      <Image
                        src={kelas.banner}
                        alt={kelas.nama}
                        width={1000}
                        height={1000}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white'>
                        {getInitials(kelas.nama || 'Kelas')}
                      </div>
                    )}
                  </div>

                  {/* Konten kanan */}
                  <div className='flex-1'>
                    <div className='mb-1 flex items-center justify-between'>
                      <div className='text-sm font-semibold lg:text-base'>
                        {kelas.nama}
                      </div>
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
                    <div className='text-xs text-muted-foreground'>
                      <span className='font-medium'>{kelas.tahunAjaran}</span>
                    </div>
                    <div className='mt-2 flex items-center text-sm text-muted-foreground'>
                      <Users className='mr-1 h-4 w-4 text-muted-foreground' />
                      {kelas.jumlahSiswa} siswa
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kelas Mapel */}
        <Card className='border-2 p-3 shadow-md md:p-6'>
          <CardHeader className='p-2 md:p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <BookOpen className='hidden h-5 w-5 text-primary md:block' />
                <CardTitle className='text-sm font-semibold lg:text-lg'>
                  Mengajar di Kelas
                </CardTitle>
              </div>
              <Button
                size='sm'
                variant='default'
                onClick={() => setOpenModal('mapel')}
              >
                Kelas Mapel +
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-4 p-2 md:p-2'>
            {kelasMapel.map((item, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/mengajar/kelas-mapel/${item.id}`)}
                className='cursor-pointer rounded-xl border border-muted p-2 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md md:p-5'
              >
                <div className='flex items-start gap-4'>
                  {/* Image di kiri */}
                  <div className='h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-lg bg-muted'>
                    {item.banner ? (
                      <Image
                        src={item.banner}
                        alt={item.namaMapel}
                        width={1000}
                        height={1000}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-bold text-white'>
                        {getInitials(item.namaMapel || 'Mapel')}
                      </div>
                    )}
                  </div>
                  {/* Konten kanan */}
                  <div className='flex-1'>
                    <div className='mb-1 flex items-center justify-between'>
                      <div className='text-sm font-semibold lg:text-base'>
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

                    <div className='mb-2 text-xs text-muted-foreground'>
                      <span className='font-medium'>{item.kelas}</span>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      <span className='font-medium'>{item.tahunAjaran}</span>
                    </div>
                    <div className='mt-2 flex items-center text-sm text-muted-foreground'>
                      <Users className='mr-1 h-4 w-4 text-muted-foreground' />
                      {item.jumlahSiswa} siswa
                    </div>
                  </div>
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
        openModal={openModalEdit}
        setOpenModal={setOpenModalEdit}
        dataEdit={dataEditKelas}
      />
      <ModalTambahKelasMapel
        openModal={openModalEdit}
        dataEdit={dataEditMapel}
        setOpenModal={setOpenModalEdit}
      />
    </>
  );
}
