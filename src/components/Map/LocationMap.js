import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Globe } from 'lucide-react';

const LocationMap = ({ 
  location, 
  setLocation, 
  formData, 
  setFormData
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }

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
      setFormData(prev => ({
        ...prev,
        commune: newLocation.city
      }));

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
          
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 13);
            markerRef.current.setLatLng([latitude, longitude]);
          }
          
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

  const initializeMap = () => {
    if (typeof window.L === 'undefined') {
      // Leaflet not loaded yet, try again shortly
      setTimeout(initializeMap, 100);
      return;
    }

    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([location.lat, location.lng], 10);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      markerRef.current = window.L.marker([location.lat, location.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${location.address}</b><br>Cliquez pour changer la position`);

      mapInstanceRef.current.on('click', handleMapClick);
      setMapInitialized(true);
    }
  };

  useEffect(() => {
    // Load Leaflet CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS if not already loaded
    if (typeof window.L === 'undefined' && !document.querySelector('script[src*="leaflet"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else if (typeof window.L !== 'undefined') {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInitialized && mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([location.lat, location.lng]);
      markerRef.current.setLatLng([location.lat, location.lng])
        .bindPopup(`<b>${location.city}, ${location.country}</b><br>${location.address}`)
        .openPopup();
    }
  }, [location, mapInitialized]);

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
        margin: '0 0 16px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <MapPin size={20} />
        Localisation
      </h2>
      
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
  );
};

export default LocationMap;