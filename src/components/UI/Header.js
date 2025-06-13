import React from 'react';
import { Leaf, LogOut, Airplay } from 'lucide-react';

const Header = ({ 
  currentUser, 
  handleLogout, 
  droneConnectionStatus, 
  setShowDroneConnectModal,
  disconnectDrone,
  droneInfo
}) => {
  return (
    <div className="header-card" style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <div className="header-content" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#10b981',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Leaf size={32} color="white" />
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 4px 0'
            }}>DronIA</h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              margin: 0
            }}>Analyse intelligente des cultures par drone</p>
          </div>
        </div>
        
        <div className="user-section" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div className="user-info" style={{
            textAlign: 'right'
          }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 4px 0'
            }}>Bonjour, {currentUser?.name}</p>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              margin: 0
            }}>{currentUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {droneConnectionStatus === 'connected' ? (
            <button
              onClick={disconnectDrone}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Airplay size={16} />
              Drone connecté
            </button>
          ) : (
            <button
              onClick={() => setShowDroneConnectModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <Airplay size={16} />
              Connecter drone
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;