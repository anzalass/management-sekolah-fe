import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { API } from '@/lib/server';
import { CircleXIcon, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

const videoConstraints = {
  width: 340,
  facingMode: 'environment'
};

type CameraProps = {
  open: boolean;
  fetchData: () => void;
  setOpen: (open: boolean) => void;
};

export default function Camera({ open, setOpen, fetchData }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null
  });

  const capturePhoto = useCallback((): void => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setUrl(imageSrc);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setLocation({ lat: coords.latitude, lng: coords.longitude }),
      (err) => setError(err.message)
    );
  }, []);

  const handleCheckIn = async () => {
    if (!url) return setError('Foto belum diambil');
    if (!location.lat || !location.lng)
      return setError('Lokasi belum tersedia');

    try {
      setIsLoading(true); // Start loading

      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], 'absen-masuk.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('fotoMasuk', file);
      formData.append('lat', '-6.09955851839959');
      formData.append('long', '106.51911493230111');

      const response = await fetch(`${API}absen-masuk`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Gagal absen');
      }

      const result = await response.json();
      toast.success(result.message || 'Absen masuk berhasil');
      setOpen(false);
      fetchData();
      handleRefresh();
    } catch (err: any) {
      toast.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat absen');
      setError(err.message || 'Terjadi kesalahan saat absen');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleRefresh = () => {
    setUrl(null);
    setError(null);
    setLocation({ lat: null, lng: null });
  };

  return (
    <Card className='relative z-50 mx-auto w-full max-w-sm rounded-lg bg-white p-4 shadow-lg'>
      {/* Close Button */}
      <div className='absolute right-2 top-2'>
        <CircleXIcon
          onClick={() => setOpen(false)}
          className='h-6 w-6 cursor-pointer text-gray-600'
        />
      </div>

      {/* Camera or Image */}
      {url ? (
        <Image
          src={url}
          alt='Screenshot'
          unoptimized
          width={340}
          height={340}
          className='w-full rounded-lg'
        />
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat='image/jpeg'
          videoConstraints={videoConstraints}
          className='w-full rounded-lg'
        />
      )}

      {/* Buttons */}
      <div className='mt-4 flex items-center justify-between'>
        <div className='space-x-2'>
          <Button onClick={capturePhoto}>Ambil Foto</Button>
          <Button variant='secondary' onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
        {url && location.lat && location.lng ? (
          <Button onClick={handleCheckIn} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Menyimpan...
              </>
            ) : (
              'Submit Absen'
            )}
          </Button>
        ) : (
          <Loader2 className='h-5 w-5 animate-spin' />
        )}
      </div>

      {/* Error Message */}
      {error && <p className='mt-2 text-red-500'>{error}</p>}
    </Card>
  );
}
