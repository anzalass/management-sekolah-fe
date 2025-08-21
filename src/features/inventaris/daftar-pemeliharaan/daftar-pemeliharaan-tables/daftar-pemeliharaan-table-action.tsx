'use client';

import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useDaftarInventarisTableFilters } from './daftar-pemeliharaan-inventaris-table-filters';
import { useEffect, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Ruangan } from '@/features/master-data/ruang/ruang-listing';
import axios from 'axios';
import { API } from '@/lib/server';
import { toast } from 'sonner';

export default function DaftarPemeliharaanInventarisTableAction() {
  const [isLoading, startTransition] = useTransition();
  const [ruang, setRuang] = useState<Ruangan[]>([]);

  const {
    isAnyFilterActive,
    setWaktuPengadaanFilter,
    waktuPengadaanFilter,
    ruangFilter,
    setRuangFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
    setPage,
    namaFilter,
    setNamaFilter
  } = useDaftarInventarisTableFilters();

  const handleChangeTanggal = (value: string) => {
    setWaktuPengadaanFilter(value, { startTransition });
    setPage(1);
  };

  const handleChangeRuangan = (value: string) => {
    setRuangFilter(value, { startTransition });
    setPage(1);
  };

  const handleChangeStatus = (value: string) => {
    setStatusFilter(value, { startTransition });
    setPage(1);
  };

  const getAllRuang = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}ruang2`
      );

      setRuang(response.data.data);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getAllRuang();
  }, []);

  return (
    <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-4'>
      <DataTableSearch
        searchKey='Nama'
        searchQuery={namaFilter}
        setSearchQuery={setNamaFilter}
        setPage={setPage}
      />

      <Select value={statusFilter} onValueChange={handleChangeStatus}>
        <SelectTrigger>
          <SelectValue placeholder='Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'Sedang Maintenence'}>
            Sedang Maintenence
          </SelectItem>
          <SelectItem value={'Selesai Di Maintenence'}>
            Selesai Di Maintenence
          </SelectItem>
          <SelectItem value={'Non Aktif'}>Non Aktif</SelectItem>
        </SelectContent>
      </Select>

      <Select value={ruangFilter} onValueChange={handleChangeRuangan}>
        <SelectTrigger>
          <SelectValue placeholder='Pilih Ruangan' />
        </SelectTrigger>
        <SelectContent>
          {ruang.length > 0 ? (
            ruang.map((item, i) => (
              <SelectItem
                key={item.id ? item.id : `ruang-${i}`}
                value={item.nama}
              >
                {item.nama}
              </SelectItem>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </SelectContent>
      </Select>

      <Input
        type='date'
        placeholder='Masukan Tanggal'
        value={waktuPengadaanFilter}
        onChange={(e) => handleChangeTanggal(e.target.value)}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
