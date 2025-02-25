import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CircleXIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 340,
  facingMode: 'environment'
};

type CameraProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Camera({ open, setOpen }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
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

  const checkIn = () => {
    console.log('Photo URL:', url);
    console.log('Latitude:', location.lat);
    console.log('Longitude:', location.lng);
  };

  const handleRefresh = () => {
    setUrl(null);
    setError(null);
    setLocation({ lat: null, lng: null });
  };

  return (
    <Card className='relative mx-auto w-full p-4'>
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
          width={500}
          height={500}
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
      <div className='mt-4 flex justify-between'>
        <div className='space-x-2'>
          <Button onClick={capturePhoto}>Capture</Button>
          <Button variant='secondary' onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
        {url && location.lat && location.lng ? (
          <Button onClick={checkIn}>Check In</Button>
        ) : (
          <Loader2 className='h-5 w-5 animate-spin' />
        )}
      </div>

      {/* Error Message */}
      {error && <p className='mt-2 text-red-500'>{error}</p>}
    </Card>
  );
}
