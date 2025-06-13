import React from 'react';
import { Airplay } from 'lucide-react';


const CameraControls = ({ 
  isCameraMode, 
  stopCamera, 
  capturePhoto, 
  toggleFlash, 
  setShowGrid, 
  showGrid,
  handleZoom,
  droneConnectionStatus,
  droneInfo
}) => {
  if (!isCameraMode) return null;

  return (
    <>
      {droneConnectionStatus === 'connected' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1001
        }}>
          <Airplay size={16} />
          <span>{droneInfo.brand} {droneInfo.model}</span>
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1001
      }}>
        <button
          onClick={() => handleZoom(0.5)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '18px',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)'
          }}
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.5)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '18px',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)'
          }}
        >
          -
        </button>

        <button
          onClick={toggleFlash}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '18px',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            position: 'absolute',
            top: '140px',
            right: '20px'
          }}
        >
          ⚡
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '18px',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            position: 'absolute',
            top: '80px',
            right: '20px'
          }}
        >
          ▦
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        padding: '16px'
      }}>
        <button
          type="button"
          onClick={stopCamera}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)'
          }}
        >
          ✕
        </button>
        <button
          type="button"
          onClick={capturePhoto}
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          📷
        </button>
        <div style={{ width: '60px' }}></div>
      </div>
    </>
  );
};

export default CameraControls;