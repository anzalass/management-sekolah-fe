'use client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API } from '@/lib/server';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MultiSelect } from './multi-select';

// Type sesuai Prisma
export type Tagihan = {
  id: string;
  nama: string;
  namaSiswa: string;
  nisSiswa: string;
  idSiswa?: string | null;
  waktu: string; // ISO
  jatuhTempo: string; // ISO
  status: string;
  keterangan: string;
  nominal: number;
};

interface Student2 {
  id: string;
  nama: string;
  nis: string;
}

export default function TagihanForm({
  initialData,
  id,
  pageTitle
}: {
  initialData: Tagihan | null;
  id: string;
  pageTitle: string;
}) {
  const [loading, startTransition] = useTransition();
  const [masterSiswa, setMasterSiswa] = useState<Student2[]>([]);
  const [masterKelas, setMasterKelas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMasterSiswa, setFilteredMasterSiswa] = useState<Student2[]>(
    []
  );
  const [siswaList, setSiswaList] = useState<Student2[]>([]);
  const [opsi, setOpsi] = useState<'semua' | 'kelas' | 'individu'>('semua');

  const router = useRouter();

  const defaultValue = {
    nama: initialData?.nama || '',
    idSiswa: initialData?.idSiswa || '',
    namaSiswa: initialData?.namaSiswa || '',
    nisSiswa: initialData?.nisSiswa || '',
    waktu: initialData?.waktu
      ? new Date(initialData.waktu).toISOString().split('T')[0]
      : '',
    jatuhTempo: initialData?.jatuhTempo
      ? new Date(initialData.jatuhTempo).toISOString().split('T')[0]
      : '',
    status: initialData?.status || 'Belum Dibayar',
    keterangan: initialData?.keterangan || '',
    nominal: initialData?.nominal || 0,
    siswaList: [] as Student2[], // 🔥 simpan array NIS siswa yang dipilih
    opsi: 'semua',
    kelas: ''
  };

  const form = useForm({
    defaultValues: defaultValue
  });

  // fetch semua siswa dan kelas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}user/get-all-siswa`);
        const response2 = await axios.get(`${API}list-kelas`);

        setMasterSiswa(response.data.result.data || []);
        setMasterKelas(response2.data.data);
      } catch (error) {
        toast.error('Gagal mengambil data siswa');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const selectedSiswa = form.getValues('siswaList') || [];
    const filtered = masterSiswa.filter(
      (s) =>
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSiswa.find((sel: Student2) => sel.nis === s.nis)
    );
    setFilteredMasterSiswa(filtered);
  }, [searchTerm, masterSiswa, form]);

  const handleAddSiswaToListSiswa = (siswa: Student2) => {
    const currentList: Student2[] = form.getValues('siswaList') || [];

    // Cek supaya siswa tidak duplikat
    const exists = currentList.some((s) => s.nis === siswa.nis);
    if (exists) return;

    const updatedList = [...currentList, siswa];
    form.setValue('siswaList', updatedList);
    setSearchTerm('');
  };

  async function onSubmit(values: any) {
    startTransition(async () => {
      try {
        if (id !== 'new') {
          await axios.put(`${API}pembayaran/${id}`, values, {
            headers: { 'Content-Type': 'application/json' }
          });
          toast.success('Data tagihan berhasil diubah');
        } else {
          await axios.post(`${API}pembayaran`, values, {
            headers: { 'Content-Type': 'application/json' }
          });
          toast.success('Data tagihan berhasil disimpan');
        }
        router.push('/dashboard/pembayaran/daftar-tagihan');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Terjadi Kesalahan');
      }
    });
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormItem>
                <FormLabel>Nama Tagihan</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Masukkan nama tagihan...'
                    {...form.register('nama', { required: 'Wajib diisi' })}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.nama?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Nominal</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Masukkan nominal...'
                    {...form.register('nominal', { required: 'Wajib diisi' })}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.nominal?.message}
                </FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Tanggal Dibuat</FormLabel>
                <FormControl>
                  <Input type='date' {...form.register('waktu')} />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Jatuh Tempo</FormLabel>
                <FormControl>
                  <Input type='date' {...form.register('jatuhTempo')} />
                </FormControl>
              </FormItem>

              {id === 'new' && (
                <FormItem>
                  <FormLabel>Jenis Tagihan</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val: any) => {
                        setOpsi(val);
                        form.setValue('opsi', val);
                      }}
                      defaultValue={defaultValue.opsi}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih jenis tagihan' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='semua'>Semua Siswa</SelectItem>
                        <SelectItem value='kelas'>Per Kelas</SelectItem>
                        <SelectItem value='individu'>Individu</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}

              {/* === Jenis Tagihan (opsi) === */}

              {opsi === 'kelas' && (
                <FormItem>
                  <FormLabel>Pilih Kelas</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val: any) => form.setValue('kelas', val)}
                      defaultValue={defaultValue.kelas}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih kelas' />
                      </SelectTrigger>
                      <SelectContent>
                        {masterKelas.map((kls) => (
                          <SelectItem key={kls.id} value={kls.namaKelas}>
                            {kls.namaKelas}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}

              {opsi === 'individu' && (
                <FormItem className=''>
                  <FormLabel>Pilih Siswa</FormLabel>
                  <div className=''>
                    <Input
                      placeholder='Cari nama siswa...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm.trim() !== '' &&
                      filteredMasterSiswa.length > 0 && (
                        <div className='rounded border p-2'>
                          <ul className='space-y-1'>
                            {filteredMasterSiswa.map((siswa) => (
                              <li
                                key={siswa.nis}
                                className='flex items-center justify-between border-b pb-1 last:border-none last:pb-0'
                              >
                                <span>
                                  {siswa.nama} - {siswa.nis}
                                </span>
                                <Button
                                  size='sm'
                                  onClick={() =>
                                    handleAddSiswaToListSiswa(siswa)
                                  }
                                >
                                  Tambah
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </FormItem>
              )}

              {form.getValues('siswaList')?.length > 0 && (
                <div className='space-y-2 rounded border p-2'>
                  {form.getValues('siswaList').map((siswa: Student2) => (
                    <div
                      key={siswa.nis}
                      className='flex items-center justify-between border-b pb-1 last:border-none last:pb-0'
                    >
                      <span>
                        {siswa.nama} - {siswa.nis}
                      </span>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => {
                          const updatedList = form
                            .getValues('siswaList')
                            .filter((s: Student2) => s.nis !== siswa.nis);
                          form.setValue('siswaList', updatedList);
                        }}
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <FormItem className='md:col-span-2'>
                <FormLabel>Keterangan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Masukkan keterangan...'
                    {...form.register('keterangan')}
                  />
                </FormControl>
              </FormItem>
            </div>

            <Button type='submit' disabled={loading}>
              {loading ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                'Simpan'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
