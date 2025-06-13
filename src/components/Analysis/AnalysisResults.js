import React from 'react';
import { AlertTriangle, CheckCircle, Eye, Calendar, MapPin, Clock, Globe , Leaf} from 'lucide-react';

const AnalysisResults = ({ 
  analysisResult, 
  resetForm, 
  exportAnalysis, 
  imagePreview, 
  formData, 
  location 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
          }}>Résultats de l'analyse</h2>
          <div>
            <button
              onClick={resetForm}
              style={{
                backgroundColor: '#64748b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Nouvelle analyse
            </button>
            <button
              onClick={exportAnalysis}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginLeft: '12px'
              }}
            >
              Exporter l'analyse
            </button>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: analysisResult.diseaseDetected ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${analysisResult.diseaseDetected ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              {analysisResult.diseaseDetected ? (
                <AlertTriangle size={24} color="#dc2626" />
              ) : (
                <CheckCircle size={24} color="#16a34a" />
              )}
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                État sanitaire
              </span>
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: analysisResult.diseaseDetected ? '#dc2626' : '#16a34a',
              margin: '0 0 8px 0'
            }}>
              {analysisResult.diseaseDetected ? `Maladie détectée: ${analysisResult.diseaseName}` : 'Aucune maladie détectée'}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Confiance: {(analysisResult.confidence * 100).toFixed(1)}%
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <Leaf size={24} color="#0284c7" />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                Type de plante
              </span>
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0284c7',
              margin: '0 0 8px 0'
            }}>{analysisResult.plantType}</p>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Confiance: {(analysisResult.plantConfidence * 100).toFixed(1)}%
            </p>
          </div>
          
          <div style={{
            backgroundColor: analysisResult.riskLevel === 'Élevé' ? '#fef2f2' : analysisResult.riskLevel === 'Moyen' ? '#fffbeb' : '#f0fdf4',
            border: `1px solid ${analysisResult.riskLevel === 'Élevé' ? '#fecaca' : analysisResult.riskLevel === 'Moyen' ? '#fed7aa' : '#bbf7d0'}`,
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <Eye size={24} color={analysisResult.riskLevel === 'Élevé' ? '#dc2626' : analysisResult.riskLevel === 'Moyen' ? '#d97706' : '#16a34a'} />
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                Niveau de risque
              </span>
            </div>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: analysisResult.riskLevel === 'Élevé' ? '#dc2626' : analysisResult.riskLevel === 'Moyen' ? '#d97706' : '#16a34a',
              margin: 0
            }}>{analysisResult.riskLevel}</p>
          </div>
        </div>
        
        {imagePreview && (
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 16px 0'
            }}>Image analysée</h3>
            <img 
              src={imagePreview} 
              alt="Analysed" 
              style={{
                width: '100%',
                maxWidth: '400px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            />
          </div>
        )}
      </div>

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
        }}>Informations de l'analyse</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px'
          }}>
            <Calendar size={16} color="#64748b" />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Date: {formData.date}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px'
          }}>
            <MapPin size={16} color="#64748b" />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Position: {location.lat}, {location.lng}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px'
          }}>
            <Eye size={16} color="#64748b" />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Observateur: {formData.observateur}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px'
          }}>
            <Clock size={16} color="#64748b" />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Analysé le: {new Date().toLocaleString('fr-FR')}
            </span>
          </div>
          <div style={{
            display: 'flex',  
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px'
          }}>
            <Globe size={16} color="#64748b" />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Lieu: {location.city}, {location.country}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;