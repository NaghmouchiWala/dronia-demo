import React from 'react';
import { Clock } from 'lucide-react';

const AnalysisHistory = ({ showHistory, setShowHistory, analysisHistory }) => {
  if (!showHistory) return null;

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
        maxWidth: '800px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            Historique des analyses
          </h2>
          <button
            onClick={() => setShowHistory(false)}
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
        
        {analysisHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>
            Aucune analyse dans l'historique
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {analysisHistory.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                ':hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <img 
                    src={item.image} 
                    alt="Analysis preview"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        margin: 0 
                      }}>
                        {item.result.plantType} - {item.result.diseaseDetected ? item.result.diseaseName : 'Sain'}
                      </h3>
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#64748b' 
                      }}>
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#64748b',
                      margin: '0 0 8px 0'
                    }}>
                      {item.location.city}, {item.location.country}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{
                        backgroundColor: item.result.diseaseDetected ? '#fee2e2' : '#dcfce7',
                        color: item.result.diseaseDetected ? '#b91c1c' : '#166534',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {item.result.diseaseDetected ? 'Maladie détectée' : 'Aucune maladie'}
                      </span>
                      <span style={{
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {item.result.plantType}
                      </span>
                      <span style={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {item.result.environmental.temperature}°C
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;