import React, { useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

interface MediaDeviceInfo {
  deviceId: string;
  kind: string;
  label: string;
}

const AllCameras: React.FC = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoInputDevices = mediaDevices.filter(
      (device) => device.kind === 'videoinput'
    );
    setDevices(videoInputDevices);
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => handleDevices(devices as MediaDeviceInfo[]))
      .catch((error) => toast.error('Failed to enumerate devices:', error));
  }, [handleDevices]);

  return (
    <>
      {devices.map((device, index) => (
        <div key={device.deviceId}>
          <Webcam
            audio={false}
            videoConstraints={{ deviceId: device.deviceId }}
          />
          <p>{device.label || `Device ${index + 1}`}</p>
        </div>
      ))}
    </>
  );
};

export default AllCameras;
