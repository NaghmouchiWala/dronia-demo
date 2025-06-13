import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';

const EnvironmentalData = ({ analysisResult }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1e293b',
        margin: '0 0 20px 0'
      }}>Conditions environnementales</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Thermometer size={20} color="#d97706" />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#92400e' }}>
              Température
            </span>
          </div>
          <p style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#92400e',
            margin: 0
          }}>{analysisResult.environmental.temperature}°C</p>
        </div>
        
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Droplets size={20} color="#2563eb" />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e40af' }}>
              Humidité
            </span>
          </div>
          <p style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e40af',
            margin: 0
          }}>{analysisResult.environmental.humidity}%</p>
        </div>
        
        <div style={{
          backgroundColor: '#f3e8ff',
          border: '1px solid #d8b4fe',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#7c3aed',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              fontWeight: 'bold'
            }}>P</div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#5b21b6' }}>
              Pression
            </span>
          </div>
          <p style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#5b21b6',
            margin: 0
          }}>{analysisResult.environmental.pressure} hPa</p>
        </div>
        
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              fontWeight: 'bold'
            }}>≈</div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#047857' }}>
              Vent
            </span>
          </div>
          <p style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#047857',
            margin: 0
          }}>{analysisResult.environmental.windSpeed} km/h</p>
        </div>
        
        <div style={{
          backgroundColor: '#fef7cd',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              fontWeight: 'bold'
            }}>☀</div>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#92400e' }}>
              UV Index
            </span>
          </div>
          <p style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#92400e',
            margin: 0
          }}>{analysisResult.environmental.uvIndex}</p>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalData;