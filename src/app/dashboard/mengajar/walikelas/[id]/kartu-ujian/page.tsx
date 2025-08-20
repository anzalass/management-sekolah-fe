// app/mengajar/kartu-ujian/[idKelas]/page.tsx
'use client';
import { use } from 'react'; // ini built-in React 18+
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { API } from '@/lib/server';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type Siswa = {
  id: string;
  nis: string;
  nama: string;
  kelas?: string;
  jurusan?: string | null;
  foto?: string | null;
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params); // unwrapping Promise params
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSiswa = async () => {
      try {
        // ganti endpoint sesuai punyamu, mis. /api/v1/kelas/:idKelas/siswa
        const response2 = await axios.get(`${API}kelas-walikelas/siswa/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`
          }
        });
        setSiswa(response2.data || []);
      } catch (e) {
        toast.error('Gagal mendapatkan siswa');
      } finally {
        setLoading(false);
      }
    };
    getSiswa();
  }, [id]);

  const handlePrint = () => window.print();

  // Bisa custom ukuran kartu di sini
  const cardClass =
    'kartu w-[9cm] h-[5.5cm] rounded-xl border p-3 flex flex-col justify-between break-inside-avoid';

  if (loading) return <div className='p-4'>Memuat data...</div>;

  return (
    <div className='p-4'>
      {/* Tombol & info non-print */}
      <div className='mb-4 flex items-center gap-2 print:hidden'>
        <Button onClick={handlePrint}>Cetak (PDF)</Button>
      </div>

      {/* Grid kartu */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2'>
        {siswa.map((s) => (
          <div key={s.id} className={cardClass}>
            <div className='flex items-center justify-between'>
              <div className='text-sm font-semibold'>KARTU UJIAN</div>
              {/* Logo sekolah kalau ada */}
              {/* <img src="/logo.png" alt="logo" className="h-6 w-auto" /> */}
            </div>

            <div className='mt-1 border-t pt-2 text-xs'>
              <div className='flex gap-2'>
                <div className='w-16 text-muted-foreground'>Nama</div>
                <div className='font-semibold'>{s.nama}</div>
              </div>
              <div className='flex gap-2'>
                <div className='w-16 text-muted-foreground'>NIS</div>
                <div className='font-semibold'>{s.nis}</div>
              </div>
              <div className='flex gap-2'>
                <div className='w-16 text-muted-foreground'>Kelas</div>
                <div className='font-semibold'>{s.kelas ?? '-'}</div>
              </div>
              <div className='flex gap-2'>
                <div className='w-16 text-muted-foreground'>Jurusan</div>
                <div className='font-semibold'>{s.jurusan ?? '-'}</div>
              </div>
            </div>

            <div className='flex items-end justify-between'>
              <div className='text-[10px] text-muted-foreground'>
                TTD Pengawas: __________________
              </div>
              {/* Foto opsional */}
              {/* {s.foto && <img src={s.foto} alt="foto" className="h-12 w-10 rounded object-cover border" />} */}
            </div>
          </div>
        ))}
      </div>

      {/* Style print khusus */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          .print\\:hidden {
            display: none !important;
          }
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          /* Pastikan grid tetap enak saat print */
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          /* Hilangkan shadow/background agar hemat tinta */
          .kartu {
            box-shadow: none !important;
            background: #fff !important;
          }
        }
      `}</style>
    </div>
  );
}
