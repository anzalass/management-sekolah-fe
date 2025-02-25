import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <div className='mx-auto w-[98%]'>
      <Button className='mt-7'>Tambah Kelas +</Button>
      <div className='mt-4'>
        <Card className='p-4'>
          <p>Jadwal Mengajar</p>
        </Card>
        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card className='p-4'>
            <p>XII Mipa 2</p>
          </Card>
          <Card className='p-4'>
            <p>XII Mipa 2</p>
          </Card>
          <Card className='p-4'>
            <p>XII Mipa 2</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
