import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Leaf, UserPlus } from 'lucide-react';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('dronia_users') || '[]');
    const existingUser = users.find(u => u.email === formData.email);
    
    if (existingUser) {
      setError('Cette adresse email est déjà utilisée');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('dronia_users', JSON.stringify(users));
    localStorage.setItem('dronia_current_user', JSON.stringify(newUser));

    onRegister(newUser);
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
            backgroundColor: '#3b82f6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <UserPlus size={32} color="white" />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>Créer un compte</h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>Rejoignez DronIA pour analyser vos cultures</p>
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

        {/* Register Form */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px',
              display: 'block'
            }}>
              Nom complet
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Votre nom complet"
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
              <Mail size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
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
                placeholder="Au moins 6 caractères"
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

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px',
              display: 'block'
            }}>
              Confirmer le mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Confirmez votre mot de passe"
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: '100%',
              backgroundColor: '#3b82f6',
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
            Créer mon compte
          </button>
        </div>

        {/* Switch to Login */}
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
            Déjà un compte ?
          </p>
          <button
            onClick={onSwitchToLogin}
            style={{
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;