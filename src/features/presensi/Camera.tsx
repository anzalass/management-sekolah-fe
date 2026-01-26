'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRenderTrigger } from '@/hooks/use-rendertrigger';
import api from '@/lib/api';
import { CircleXIcon, Loader2, RotateCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

type CameraProps = {
  open: boolean;
  fetchData: () => void;
  setOpen: (open: boolean) => void;
};

export default function Camera({ open, setOpen, fetchData }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const { data: session } = useSession();

  const { toggleTrigger } = useRenderTrigger();

  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });

  // 🔥 Kamera default: DEPAN
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoConstraints = {
    width: 340,
    facingMode
  };

  // ========================
  // Capture Photo + Location
  // ========================
  const capturePhoto = useCallback(() => {
    setError(null);

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('Gagal mengambil foto');
      return;
    }

    setUrl(imageSrc);

    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          lat: coords.latitude,
          lng: coords.longitude
        });
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  // ==========
  // Submit API
  // ==========
  const handleCheckIn = async () => {
    if (!url) return setError('Foto belum diambil');
    if (!location.lat || !location.lng)
      return setError('Lokasi belum tersedia');

    try {
      setIsLoading(true);

      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], 'absen-masuk.jpg', {
        type: 'image/jpeg'
      });

      const formData = new FormData();
      formData.append('fotoMasuk', file);
      formData.append('lat', String(location.lat));
      formData.append('long', String(location.lng));

      const response = await api.post('absen-masuk', formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`
        }
      });

      toast.success(response.data.message || 'Absen berhasil');

      setOpen(false);
      fetchData();
      toggleTrigger();
      handleReset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal absen');
      setError(err.response?.data?.message || 'Gagal absen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl(null);
    setError(null);
    setLocation({ lat: null, lng: null });
  };

  if (!open) return null;

  return (
    <Card className='relative z-50 mx-auto w-full max-w-sm rounded-xl bg-white p-4 shadow-xl'>
      {/* Close */}
      <div className='absolute right-2 top-2'>
        <CircleXIcon
          onClick={() => setOpen(false)}
          className='h-6 w-6 cursor-pointer text-gray-600'
        />
      </div>

      {/* Camera / Image */}
      {url ? (
        <Image
          src={url}
          alt='Preview'
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
          mirrored={facingMode === 'user'}
          className='w-full rounded-lg'
        />
      )}

      {/* Controls */}
      <div className='mt-4 flex items-center justify-between gap-2'>
        <div className='flex gap-2'>
          <Button onClick={capturePhoto}>Ambil Foto</Button>

          <Button
            variant='outline'
            onClick={() =>
              setFacingMode((prev) =>
                prev === 'user' ? 'environment' : 'user'
              )
            }
          >
            <RotateCcw className='mr-1 h-4 w-4' />
            Kamera
          </Button>
        </div>

        {url && location.lat && location.lng ? (
          <Button onClick={handleCheckIn} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Menyimpan
              </>
            ) : (
              'Submit'
            )}
          </Button>
        ) : (
          <Loader2 className='h-5 w-5 animate-spin text-gray-500' />
        )}
      </div>

      {/* Error */}
      {error && <p className='mt-2 text-sm text-red-500'>{error}</p>}
    </Card>
  );
}
