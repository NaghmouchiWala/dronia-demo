import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Upload, Thermometer, Droplets, Leaf, AlertTriangle, CheckCircle, Eye, Calendar, Clock, Navigation, Globe } from 'lucide-react';
// Add these imports after your existing imports
import Login from './login'; // Adjust path as needed
import Register from './register'; // Adjust path as needed
import { LogOut } from 'lucide-react'; // Add LogOut to your existing lucide-react imports

const DronIA = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState({ 
    lat: 36.843087, 
    lng: 10.205569, 
    address: 'Tunis, Tunisie',
    city: 'Tunis',
    country: 'Tunisie',
    region: 'Occitanie'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [formData, setFormData] = useState({
    observateur: '',
    date: new Date().toISOString().split('T')[0],
    commune: '',
    lieuDit: '',
    milieu: 'culture',
    certitude: 'certain'
  });
  
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

// Add these state variables after your existing ones
const [currentUser, setCurrentUser] = useState(null);
const [authView, setAuthView] = useState('login'); // 'login' or 'register'
const [isAuthenticated, setIsAuthenticated] = useState(false);

const [isCameraMode, setIsCameraMode] = useState(false);
const [stream, setStream] = useState(null);
const cameraRef = useRef(null);
const canvasRef = useRef(null);


const [zoomLevel, setZoomLevel] = useState(1);
const [showGrid, setShowGrid] = useState(false);

const handleZoom = (delta) => {
  setZoomLevel(prev => {
    const newZoom = Math.max(0.5, Math.min(3, prev + delta));
    if (cameraRef.current) {
      cameraRef.current.style.transform = `scale(${newZoom})`;
    }
    return newZoom;
  });
};


// Check for existing authentication on component mount
useEffect(() => {
  const savedUser = localStorage.getItem('dronia_current_user');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    setCurrentUser(user);
    setIsAuthenticated(true);
  }
}, []);

// Authentication handlers
const handleLogin = (user) => {
  setCurrentUser(user);
  setIsAuthenticated(true);
};

const handleRegister = (user) => {
  setCurrentUser(user);
  setIsAuthenticated(true);
};

const handleLogout = () => {
  localStorage.removeItem('dronia_current_user');
  setCurrentUser(null);
  setIsAuthenticated(false);
  // Reset form and analysis
  resetForm();
};

const toggleFlash = async () => {
  if (stream) {
    const track = stream.getVideoTracks()[0];
    if (track.getCapabilities().torch) {
      await track.applyConstraints({
        advanced: [{torch: !track.getSettings().torch}]
      });
    }
  }
};

const [environmentalData, setEnvironmentalData] = useState({
  temperature: null,
  humidity: null,
  pressure: null,
  lightIntensity: null,
  soilMoisture: null
});

const [analysisHistory, setAnalysisHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);



const [isCollectingEnvData, setIsCollectingEnvData] = useState(false);

const collectEnvironmentalData = () => {
  setIsCollectingEnvData(true);
  
  // Simulate collecting data from sensors
  setTimeout(() => {
    setEnvironmentalData({
      temperature: 25 + (Math.random() * 5 - 2.5),
      humidity: 60 + (Math.random() * 20 - 10),
      pressure: 1013 + (Math.random() * 10 - 5),
      lightIntensity: Math.floor(Math.random() * 100),
      soilMoisture: Math.floor(Math.random() * 100)
    });
    setIsCollectingEnvData(false);
  }, 2000);
};

const useEnvironmentalData = () => {
  setFormData(prev => ({
    ...prev,
    environmentalData: environmentalData
  }));
  alert('Données environnementales ajoutées à votre analyse!');
};

const handleSubmitHistory = () => {
  if (!selectedImage) {
    alert('Veuillez sélectionner une image');
    return;
  }
  
  setIsAnalyzing(true);
  
  simulateAnalysis().then(result => {
    const newAnalysis = {
      id: Date.now(),
      date: new Date().toISOString(),
      image: imagePreview,
      location,
      formData,
      result
    };
    
    setAnalysisHistory(prev => [newAnalysis, ...prev]);
    localStorage.setItem('dronia_analysis_history', JSON.stringify([newAnalysis, ...analysisHistory]));
  });
};

useEffect(() => {
  const savedHistory = localStorage.getItem('dronia_analysis_history');
  if (savedHistory) {
    setAnalysisHistory(JSON.parse(savedHistory));
  }
}, []);

// Initialize map after authentication
useEffect(() => {
  if (isAuthenticated) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeMap;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  return () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    // ADD THIS LINE:
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  };
}, [isAuthenticated]);

  const initializeMap = () => {
    if (typeof window.L !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = window.L.map(mapRef.current).setView([location.lat, location.lng], 10);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Add initial marker
      markerRef.current = window.L.marker([location.lat, location.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${location.address}</b><br>Cliquez pour changer la position`);

      // Handle map clicks
      mapInstanceRef.current.on('click', handleMapClick);
      
      setMapLoaded(true);
    }
  };

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    
    // Update marker position
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

    // Reverse geocoding to get address
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
      const data = await response.json();
      
      const newLocation = {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: data.address?.city || data.address?.town || data.address?.village || 'Ville inconnue',
        country: data.address?.country || 'Pays inconnu',
        region: data.address?.state || data.address?.region || 'Région inconnue'
      };
      
      setLocation(newLocation);
      
      // Update form data with new location
      setFormData(prev => ({
        ...prev,
        commune: newLocation.city
      }));

      // Update marker popup
      if (markerRef.current) {
        markerRef.current.bindPopup(`<b>${newLocation.city}, ${newLocation.country}</b><br>${newLocation.address}`).openPopup();
      }
    } catch (error) {
      console.error('Erreur lors de la géolocalisation:', error);
      const newLocation = {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: 'Ville inconnue',
        country: 'Pays inconnu',
        region: 'Région inconnue'
      };
      setLocation(newLocation);
      
      if (markerRef.current) {
        markerRef.current.bindPopup(`<b>Position personnalisée</b><br>${lat.toFixed(6)}, ${lng.toFixed(6)}`).openPopup();
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Update map view and marker
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 13);
            markerRef.current.setLatLng([latitude, longitude]);
          }
          
          // Get address for current location
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
            const data = await response.json();
            
            const newLocation = {
              lat: parseFloat(latitude.toFixed(6)),
              lng: parseFloat(longitude.toFixed(6)),
              address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              city: data.address?.city || data.address?.town || data.address?.village || 'Ville inconnue',
              country: data.address?.country || 'Pays inconnu',
              region: data.address?.state || data.address?.region || 'Région inconnue'
            };
            
            setLocation(newLocation);
            setFormData(prev => ({
              ...prev,
              commune: newLocation.city
            }));

            if (markerRef.current) {
              markerRef.current.bindPopup(`<b>Ma position actuelle</b><br>${newLocation.city}, ${newLocation.country}`).openPopup();
            }
          } catch (error) {
            console.error('Erreur lors de la géolocalisation:', error);
          }
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'obtenir votre position actuelle');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par ce navigateur');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const exportAnalysis = () => {
    if (!analysisResult) return;
    
    const data = {
      metadata: {
        date: formData.date,
        observer: formData.observateur,
        location: location,
        environmentalData: environmentalData
      },
      analysis: analysisResult,
      image: imagePreview
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dronia-analyse-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  // 2. ADD THESE FUNCTIONS after your existing functions (around line 300, after handleImageUpload)
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setStream(mediaStream);
      setIsCameraMode(true);
      if (cameraRef.current) {
        cameraRef.current.srcObject = mediaStream;
        // Add this to make the video fill its container
        cameraRef.current.style.objectFit = 'cover';
      }
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
  }
  setIsCameraMode(false);
};

const capturePhoto = () => {
  const video = cameraRef.current;
  const canvas = canvasRef.current;
  
  if (video && canvas) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  }
};

//camera

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results
    const diseases = [
       'Botrytis'
    ];
    
    const plantTypes = [
      'Tomate', 'Tomate', 'Tomate', 'Tomate', 'Tomate', 'Tomate'
    ];
    
    const hasDisease = Math.random() > 0.4;
    const detectedDisease = hasDisease ? diseases[Math.floor(Math.random() * diseases.length)] : null;
    const plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
    
    // Mock weather data based on location
    const temperature = 18 + Math.random() * 15;
    const humidity = 40 + Math.random() * 40;
    const pressure = 1000 + Math.random() * 30;
    
    const result = {
      diseaseDetected: hasDisease,
      diseaseName: detectedDisease,
      confidence: hasDisease ? 0.75 + Math.random() * 0.2 : 0.85 + Math.random() * 0.1,
      plantType: plantType,
      plantConfidence: 0.8 + Math.random() * 0.15,
      environmental: {
        temperature: parseFloat(temperature.toFixed(1)),
        humidity: parseFloat(humidity.toFixed(1)),
        pressure: parseFloat(pressure.toFixed(1)),
        windSpeed: parseFloat((Math.random() * 15).toFixed(1)),
        uvIndex: Math.floor(Math.random() * 11)
      },
      recommendations: hasDisease ? [
        'Appliquer un traitement fongicide adapté',
        'Améliorer la ventilation entre les plants',
        'Réduire l\'arrosage pour limiter l\'humidité',
        'Surveiller l\'évolution sur les prochains jours'
      ] : [
        'Plant en bon état sanitaire',
        'Continuer la surveillance régulière',
        'Maintenir les bonnes pratiques culturales'
      ],
      riskLevel: hasDisease ? (Math.random() > 0.5 ? 'Élevé' : 'Moyen') : 'Faible'
    };
    
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      alert('Veuillez sélectionner une image');
      return;
    }
    simulateAnalysis();
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setFormData({
      observateur: '',
      date: new Date().toISOString().split('T')[0],
      commune: location.city,
      lieuDit: '',
      milieu: 'culture',
      certitude: 'certain'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Clean up existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }
    
    // Re-initialize the map after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (mapRef.current && !mapInstanceRef.current) {
        initializeMap();
      }
    }, 100);
  };

// Authentication check - add this before your existing return statement
if (!isAuthenticated) {
  if (authView === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  } else {
    return (
      <Register 
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }
}

// Your existing return statement stays the same after this
return (
  <div className="main-container" style={{
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
 {/* Header */}
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
    
    {/* User info and logout */}
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
  </div>
</div>

{/* History Button */}
<button
  onClick={() => setShowHistory(true)}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    zIndex: 100
  }}
>
  <Clock size={24} />
</button>

{/* History Modal */}
{showHistory && (
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
)}

        {!analysisResult ? (
          <div className="content-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Upload Form */}
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
              

{/* Image Upload */}
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
{isCameraMode ? (
  <div style={{ 
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <video
      ref={cameraRef}
      autoPlay
      playsInline
      style={{
        width: '100%',
        height: '80%',
        backgroundColor: '#000'
      }}
    />

    {/* Add this right after the <video> element */}
<div style={{
  position: 'absolute',
  top: '20px',
  right: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  zIndex: 1001
}}>
  <button
    onClick={() => handleZoom(0.5)}
    style={{
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '18px',
      cursor: 'pointer',
      backdropFilter: 'blur(5px)'
    }}
  >
    +
  </button>
  <button
    onClick={() => handleZoom(-0.5)}
    style={{
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      fontSize: '18px',
      cursor: 'pointer',
      backdropFilter: 'blur(5px)'
    }}
  >
    -
  </button>

  {/* Add this with the other camera controls */}
<button
  onClick={toggleFlash}
  style={{
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '18px',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
    position: 'absolute',
    top: '140px',
    right: '20px'
  }}
>
  ⚡
</button>

  {/* Add this right after the zoom controls div */}
<button
  onClick={() => setShowGrid(!showGrid)}
  style={{
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '18px',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
    position: 'absolute',
    top: '80px',
    right: '20px'
  }}
>
  ▦
</button>

{/* Add this right before the </div> closing tag of the camera mode */}
{showGrid && (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '20%',
    pointerEvents: 'none',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    border: '1px solid rgba(255,255,255,0.3)'
  }}>
    {[...Array(4)].map((_, i) => (
      <div key={i} style={{
        borderRight: '1px solid rgba(255,255,255,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.3)'
      }} />
    ))}
  </div>
)}
</div>
    <canvas ref={canvasRef} style={{ display: 'none' }} />
    <div style={{
      position: 'absolute',
      bottom: '40px',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      padding: '16px'
    }}>
      <button
        type="button"
        onClick={stopCamera}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}
      >
        ✕
      </button>
      <button
        type="button"
        onClick={capturePhoto}
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        📷
      </button>
      <div style={{ width: '60px' }}></div> {/* Spacer */}
    </div>
  </div>
) : imagePreview ? (
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


              {/* Form Fields */}
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

            {/* Map Selection */}
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
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <MapPin size={20} />
                Localisation
              </h2>
              
              {/* Map Controls */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <button
                  onClick={getCurrentLocation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Navigation size={16} />
                  Ma position
                </button>
              </div>
              
              {/* Map Container */}
              <div
  ref={mapRef}
  className="map-container"
  style={{
    width: '100%',
    height: '300px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '16px'
  }}
/>
              
              {/* Location Display */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <Globe size={16} color="#10b981" />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    Position sélectionnée
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#374151' }}>{location.city}, {location.country}</strong>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    Région: {location.region}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    Coordonnées: {location.lat}°, {location.lng}°
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    wordBreak: 'break-all'
                  }}>
                    {location.address}
                  </div>
                </div>
              </div>
              
              <p style={{
                fontSize: '12px',
                color: '#94a3b8',
                margin: '12px 0 0 0',
                textAlign: 'center'
              }}>
                Cliquez sur la carte pour sélectionner une position précise
              </p>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Summary Card */}
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
              
              {/* Image Display */}
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

            {/* Environmental Conditions */}
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

            {/* Recommendations */}
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
                {analysisResult.recommendations.map((rec, index) => (
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

            {/* Analysis Info */}
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
        )}

        {/* Loading Overlay */}
        {isAnalyzing && (
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
        )}
      </div>
      
      <style>{`
      @keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.leaflet-container {
  height: 100% !important;
  border-radius: 12px;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px;
}

.leaflet-popup-content {
  margin: 12px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
}

.leaflet-control-zoom {
  border-radius: 8px !important;
  border: none !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
}

.leaflet-control-zoom a {
  background-color: white !important;
  color: #374151 !important;
  border: none !important;
  font-weight: 600 !important;
}

.leaflet-control-zoom a:hover {
  background-color: #f8fafc !important;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .main-container {
    padding: 12px !important;
    gap: 16px !important;
  }
  
  .header-card {
    padding: 16px !important;
  }
  
  .header-content {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 16px !important;
  }
  
  .user-section {
    width: 100% !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
  }
  
  .user-info {
    text-align: left !important;
  }
  
  .content-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
  
  .form-card, .map-card, .results-card {
    padding: 16px !important;
  }
  
  .form-row {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  
  .summary-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
  
  .environmental-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 12px !important;
  }
  
  .info-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  
  .map-container {
    height: 250px !important;
  }
  
  .app-title {
    font-size: 24px !important;
  }
  
  .section-title {
    font-size: 18px !important;
  }
  
  .card-title {
    font-size: 16px !important;
  }
  
  .upload-area {
    padding: 24px 16px !important;
  }
  
  .env-card {
    padding: 12px !important;
  }
  
  .env-value {
    font-size: 20px !important;
  }
  
  .recommendation-item {
    padding: 10px !important;
  }
  
  .loading-modal {
    margin: 16px !important;
    padding: 24px !important;
  }
}

@media (max-width: 480px) {
  .environmental-grid {
    grid-template-columns: 1fr !important;
  }
  
  .app-title {
    font-size: 20px !important;
  }
  
  .header-card {
    padding: 12px !important;
  }
  
  .form-card, .map-card, .results-card {
    padding: 12px !important;
  }
  
  .upload-area {
    padding: 20px 12px !important;
  }
  
  .map-container {
    height: 200px !important;
  }
}
      `}</style>
    </div>
  );
};

export default DronIA;