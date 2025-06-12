import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Leaf } from 'lucide-react';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('dronia_users') || '[]');
    
    // Find user
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      // Store current user
      localStorage.setItem('dronia_current_user', JSON.stringify(user));
      onLogin(user);
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        width: '100%',
        maxWidth: '400px',
        margin: '20px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#10b981',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Leaf size={32} color="white" />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>Connexion à DronIA</h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>Connectez-vous pour accéder à l'analyse des cultures</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#dc2626',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px',
              display: 'block'
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="votre@email.com"
              />
              <User size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px',
              display: 'block'
            }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Votre mot de passe"
              />
              <Lock size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Se connecter
          </button>
        </div>

        {/* Switch to Register */}
        <div style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: '0 0 12px 0'
          }}>
            Pas encore de compte ?
          </p>
          <button
            onClick={onSwitchToRegister}
            style={{
              backgroundColor: 'transparent',
              color: '#10b981',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;