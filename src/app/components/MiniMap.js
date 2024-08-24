'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function MiniMap() {
  const mapRef = useRef(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      // Dynamic import of Leaflet to avoid SSR issues
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (mapRef.current === null) {
        const map = L.map('minimap').setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 13);

              L.marker([latitude, longitude]).addTo(map)
                .bindPopup('Du bist hier!')
                .openPopup();
            },
            (error) => {
              setLocationError('Fehler beim Abrufen des Standorts: ' + error.message);
              console.error('Fehler beim Abrufen des Standorts', error);
            }
          );
        } else {
          setLocationError('Geolocation wird von diesem Browser nicht unterstützt.');
        }

        mapRef.current = map;
      }
    };

    if (typeof window !== 'undefined') {
      loadLeaflet();  // Load Leaflet only in the browser
    }
  }, []);

  return (
    <div>
      {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
      <div id="minimap" style={{ height: '500px', width: '100%' }} />
    </div>
  );
}
