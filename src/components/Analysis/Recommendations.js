import React from 'react';

const Recommendations = ({ recommendations }) => {
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
      }}>Recommandations</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {recommendations.map((rec, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              marginTop: '6px',
              flexShrink: 0
            }}></div>
            <p style={{
              fontSize: '14px',
              color: '#374151',
              margin: 0,
              lineHeight: '1.5'
            }}>{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;