import React from 'react';

const LoadingOverlay = ({ isAnalyzing }) => {
  if (!isAnalyzing) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px auto'
        }}></div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 8px 0'
        }}>Analyse en cours...</h3>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>Analyse de l'image et des conditions environnementales</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;