import React from 'react';
import { Camera, Upload } from 'lucide-react';

const AnalysisForm = ({ 
  formData, 
  setFormData, 
  selectedImage, 
  imagePreview, 
  isAnalyzing, 
  handleSubmit, 
  handleImageUpload, 
  startCamera,
  fileInputRef,
  isCameraMode
}) => {
  return (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Camera size={20} />
          Ajouter une photo à analyser
        </h2>
        
        <div 
          onClick={() => !isCameraMode && fileInputRef.current?.click()}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            cursor: !isCameraMode ? 'pointer' : 'default',
            marginBottom: '24px',
            backgroundColor: imagePreview ? 'transparent' : '#f8fafc',
            transition: 'all 0.2s',
            position: 'relative'
          }}
        >
          {imagePreview ? (
            <div>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Changer l'image
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Camera size={16} />
                  Scanner
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Upload size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '16px', color: '#475569', margin: '0 0 4px 0' }}>
                Cliquez pour sélectionner une image
              </p>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 16px 0' }}>
                JPG, PNG jusqu'à 10MB
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Parcourir
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Camera size={16} />
                  Scanner avec caméra
                </button>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Observateur *
            </label>
            <input
              type="text"
              value={formData.observateur}
              onChange={(e) => setFormData({...formData, observateur: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Commune
            </label>
            <input
              type="text"
              value={formData.commune}
              onChange={(e) => setFormData({...formData, commune: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="ex: Montpellier"
            />
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Lieu-dit
            </label>
            <input
              type="text"
              value={formData.lieuDit}
              onChange={(e) => setFormData({...formData, lieuDit: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="ex: Les Garrigues"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Milieu
            </label>
            <select
              value={formData.milieu}
              onChange={(e) => setFormData({...formData, milieu: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            >
              <option value="culture">Culture</option>
              <option value="jardin">Jardin</option>
              <option value="friche">Friche</option>
              <option value="foret">Forêt</option>
              <option value="prairie">Prairie</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
              Certitude
            </label>
            <select
              value={formData.certitude}
              onChange={(e) => setFormData({...formData, certitude: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                boxSizing: 'border-box'
              }}
            >
              <option value="certain">Certain</option>
              <option value="probable">Probable</option>
              <option value="doute">Doute</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedImage || isAnalyzing}
          style={{
            width: '100%',
            backgroundColor: !selectedImage || isAnalyzing ? '#94a3b8' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: !selectedImage || isAnalyzing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse'}
        </button>
      </div>
    );
  };

  export default AnalysisForm;