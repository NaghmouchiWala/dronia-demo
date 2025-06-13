import React from 'react';
import { Airplay } from 'lucide-react';

const DroneConnectionModal = ({ 
  showDroneConnectModal, 
  setShowDroneConnectModal, 
  droneInfo, 
  setDroneInfo, 
  droneConnectionStatus,
  setDroneConnectionStatus,
  startDroneCamera
}) => {
  if (!showDroneConnectModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            <Airplay size={24} style={{ marginRight: '8px' }} />
            Connecter un drone
          </h2>
          <button
            onClick={() => setShowDroneConnectModal(false)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            &times;
          </button>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
            Marque du drone *
          </label>
          <input
            type="text"
            value={droneInfo.brand}
            onChange={(e) => setDroneInfo({...droneInfo, brand: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '16px'
            }}
            placeholder="ex: DJI"
            required
          />
          
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
            Modèle *
          </label>
          <input
            type="text"
            value={droneInfo.model}
            onChange={(e) => setDroneInfo({...droneInfo, model: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '16px'
            }}
            placeholder="ex: Phantom 4 Pro"
            required
          />
          
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
            Numéro de série *
          </label>
          <input
            type="text"
            value={droneInfo.serialNumber}
            onChange={(e) => setDroneInfo({...droneInfo, serialNumber: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="ex: DJI123456789"
            required
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={() => setShowDroneConnectModal(false)}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (droneInfo.brand && droneInfo.model && droneInfo.serialNumber) {
                setDroneConnectionStatus('connecting');
                setTimeout(() => {
                  setDroneConnectionStatus('connected');
                  setShowDroneConnectModal(false);
                  startDroneCamera();
                }, 2000);
              } else {
                alert('Veuillez remplir tous les champs');
              }
            }}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {droneConnectionStatus === 'connecting' ? 'Connexion...' : 'Connecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DroneConnectionModal;