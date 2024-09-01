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

      // Custom marker icon
      const customIcon = L.icon({
        iconUrl: '/path/to/custom-marker-icon.png', // Replace with the path to your custom icon
        iconSize: [38, 38], // size of the icon
        iconAnchor: [22, 38], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      });

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

              L.marker([latitude, longitude], { icon: customIcon }).addTo(map)
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
    <div className="p-4 bg-gradient-to-r from-cfcfcf to-e5e5e5 rounded-lg shadow-md">
      {locationError && <p className="text-red-500 text-center">{locationError}</p>}
      <div id="minimap" style={{ height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }} />
    </div>

  );
}
