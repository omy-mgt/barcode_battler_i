import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Use useState to ensure the reader instance is stable across re-renders
  const [reader] = useState(() => new BrowserMultiFormatReader());
  const [status, setStatus] = useState('Initializing camera...');

  useEffect(() => {
    // Store the stream in a ref to access it in the cleanup function
    const streamRef = { current: null as MediaStream | null };

    const startScan = async () => {
      try {
        const videoInputDevices = await reader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          setStatus('No camera found.');
          return;
        }

        const rearCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back'));
        const deviceId = rearCamera ? rearCamera.deviceId : videoInputDevices[0].deviceId;
        
        setStatus('Starting scanner...');

        if (videoRef.current) {
          const controls = reader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
            if (result) {
              onScan(result.getText());
            }
            if (err && !(err instanceof NotFoundException)) {
              setStatus(`Scan Error: ${err.message}`);
              console.error(err);
            }
          });
          // Get the stream from the controls to stop it later
          if (controls) {
            streamRef.current = controls.getStream();
          }
        }
      } catch (err: any) {
        setStatus(`Error: ${err.name} - ${err.message}`);
        console.error("Failed to start scanner", err);
      }
    };

    startScan();

    return () => {
      // Stop all tracks of the stream to turn off the camera light
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Reset the reader to clean up resources
      reader.reset();
    };
  }, [onScan, reader]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <p style={{color: 'white', marginBottom: '1rem'}}>{status}</p>
      <video ref={videoRef} style={{ width: '80%', maxWidth: '600px', border: '1px solid #ccc' }} />
      <button 
        onClick={onClose} 
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#f44336',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
    </div>
  );
};
