import React, { useState, useRef, useEffect } from 'react';
import { Camera, Clock } from 'lucide-react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/UI/Header';
import AnalysisForm from './components/Analysis/AnalysisForm';
import LocationMap from './components/Map/LocationMap';
import AnalysisResults from './components/Analysis/AnalysisResults';
import EnvironmentalData from './components/Analysis/EnvironmentalData';
import Recommendations from './components/Analysis/Recommendations';
import AnalysisHistory from './components/History/AnalysisHistory';
import DroneConnectionModal from './components/Camera/DroneConnectionModal';
import CameraControls from './components/Camera/CameraControls';
import LoadingOverlay from './components/UI/LoadingOverlay';
import DiseaseInsectReference from './components/Analysis/DiseaseInsectReference';

const App = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null); 
  const [authView, setAuthView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Image and analysis state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Location state
  const [location, setLocation] = useState({ 
    lat: 36.843087, 
    lng: 10.205569, 
    address: 'Tunis, Tunisie',
    city: 'Tunis',
    country: 'Tunisie',
    region: 'Occitanie'
  });
  const [mapLoaded, setMapLoaded] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    observateur: '',
    date: new Date().toISOString().split('T')[0],
    commune: '',
    lieuDit: '',
    milieu: 'culture',
    certitude: 'certain',
    suspectedDisease: ''
  });

  // Camera and drone state
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [stream, setStream] = useState(null);
  const [droneStream, setDroneStream] = useState(null);
  const [showDroneConnectModal, setShowDroneConnectModal] = useState(false);
  const [droneConnectionStatus, setDroneConnectionStatus] = useState('disconnected');
  const [droneInfo, setDroneInfo] = useState({
    brand: '',
    model: '',
    serialNumber: ''
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGrid, setShowGrid] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);

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
    localStorage.setItem('dronia_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleRegister = (user) => {
    localStorage.setItem('dronia_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dronia_current_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    resetForm();
  };

  // Load analysis history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('dronia_analysis_history');
    if (savedHistory) {
      setAnalysisHistory(JSON.parse(savedHistory));
    }
  }, []);


  // Camera functions
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (droneStream) {
        droneStream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      setStream(mediaStream);
      setIsCameraMode(true);
      
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.srcObject = mediaStream;
          cameraRef.current.play().catch(e => console.error('Error playing video:', e));
        }
      }, 100);
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
    
    if (video && canvas && video.readyState === 4) {
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

  const handleZoom = (delta) => {
    setZoomLevel(prev => {
      const newZoom = Math.max(0.5, Math.min(3, prev + delta));
      if (cameraRef.current) {
        cameraRef.current.style.transform = `scale(${newZoom})`;
      }
      return newZoom;
    });
  };

  // Drone functions
  const startDroneCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (droneStream) {
        droneStream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      setDroneStream(mediaStream);
      setIsCameraMode(true);
      
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.srcObject = mediaStream;
          cameraRef.current.play().catch(e => console.error('Error playing video:', e));
        }
      }, 100);
    } catch (error) {
      console.error('Erreur de connexion à la caméra du drone:', error);
      alert('Impossible de se connecter à la caméra du drone');
      setDroneConnectionStatus('disconnected');
    }
  };

  const disconnectDrone = () => {
    if (droneStream) {
      droneStream.getTracks().forEach(track => track.stop());
      setDroneStream(null);
    }
    setDroneConnectionStatus('disconnected');
    setDroneInfo({
      brand: '',
      model: '',
      serialNumber: ''
    });
  };

  // Image handling
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Analysis functions
  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const diseases = ['Botrytis'];
    const plantTypes = ['Tomate', 'Tomate', 'Tomate', 'Tomate', 'Tomate', 'Tomate'];
    const hasDisease = Math.random() > 0.4;
    const detectedDisease = hasDisease ? diseases[Math.floor(Math.random() * diseases.length)] : null;
    const plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
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

    // Add to history
    const newAnalysis = {
      id: Date.now(),
      date: new Date().toISOString(),
      image: imagePreview,
      location,
      formData,
      result
    };
    
    const updatedHistory = [newAnalysis, ...analysisHistory];
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('dronia_analysis_history', JSON.stringify(updatedHistory));
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
      certitude: 'certain',
      suspectedDisease: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportAnalysis = () => {
    if (!analysisResult) return;
    
    const data = {
      metadata: {
        date: formData.date,
        observer: formData.observateur,
        location: location,
        environmentalData: analysisResult.environmental
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

  // Authentication check
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
    } else {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />;
    }
  }

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
        <Header 
          currentUser={currentUser} 
          handleLogout={handleLogout}
          droneConnectionStatus={droneConnectionStatus}
          setShowDroneConnectModal={setShowDroneConnectModal}
          disconnectDrone={disconnectDrone}
          droneInfo={droneInfo}
        />

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

        {/* Analysis History Modal */}
        <AnalysisHistory 
          showHistory={showHistory} 
          setShowHistory={setShowHistory} 
          analysisHistory={analysisHistory} 
        />

        {/* Drone Connection Modal */}
        <DroneConnectionModal
          showDroneConnectModal={showDroneConnectModal}
          setShowDroneConnectModal={setShowDroneConnectModal}
          droneInfo={droneInfo}
          setDroneInfo={setDroneInfo}
          droneConnectionStatus={droneConnectionStatus}
          setDroneConnectionStatus={setDroneConnectionStatus}
          startDroneCamera={startDroneCamera}
        />

        {/* Camera Mode */}
        {isCameraMode && (
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
              muted
              style={{
                width: '100%',
                height: '80%',
                backgroundColor: '#000',
                transform: `scale(${zoomLevel})`
              }}
            />
            
            <CameraControls
              isCameraMode={isCameraMode}
              stopCamera={stopCamera}
              capturePhoto={capturePhoto}
              toggleFlash={toggleFlash}
              setShowGrid={setShowGrid}
              showGrid={showGrid}
              handleZoom={handleZoom}
              droneConnectionStatus={droneConnectionStatus}
              droneInfo={droneInfo}
            />

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
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}

        {!analysisResult ? (
          <div className="content-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            <AnalysisForm 
              formData={formData}
              setFormData={setFormData}
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              isAnalyzing={isAnalyzing}
              handleSubmit={handleSubmit}
              handleImageUpload={handleImageUpload}
              startCamera={startCamera}
              fileInputRef={fileInputRef}
              isCameraMode={isCameraMode}
            />



          <LocationMap 
            location={location}
            setLocation={setLocation}
            formData={formData}
            setFormData={setFormData}
          />
                       {/* Disease and Insect Reference Section - Below Form and Map */}
        <DiseaseInsectReference />
          </div>

 
        ) : (
          <>
            <AnalysisResults 
              analysisResult={analysisResult}
              resetForm={resetForm}
              exportAnalysis={exportAnalysis}
              imagePreview={imagePreview}
              formData={formData}
              location={location}
            />
            
            <EnvironmentalData analysisResult={analysisResult} />
            
            <Recommendations recommendations={analysisResult.recommendations} />
          </>
        )}

        <LoadingOverlay isAnalyzing={isAnalyzing} />
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
          
          .map-container {
            height: 250px !important;
          }
        }

        @media (max-width: 480px) {
          .environmental-grid {
            grid-template-columns: 1fr !important;
          }
          
          .header-card {
            padding: 12px !important;
          }
          
          .map-container {
            height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;