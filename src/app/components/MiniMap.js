'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function MiniMap() {
  const mapRef = useRef(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      // Dynamisches Laden von Leaflet, um SSR-Probleme zu vermeiden
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Anpassung des Markers
      const customIcon = L.icon({
        iconUrl: '/path/to/custom-marker-icon.png', // Ersetze durch den Pfad zu deinem benutzerdefinierten Icon
        iconSize: [38, 38], // Größe des Icons
        iconAnchor: [22, 38], // Punkt des Icons, der der Position des Markers entspricht
        popupAnchor: [-3, -38] // Punkt, von dem aus das Popup relativ zum iconAnchor geöffnet werden soll
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
      loadLeaflet();  // Leaflet nur im Browser laden
    }
  }, []);

  return (
    <div className="p-4 bg-gradient-to-r from-cfcfcf to-e5e5e5 rounded-lg shadow-md max-w-xl mx-left ">
      {locationError && <p className="text-red-500 text-center">{locationError}</p>}
      <div
        id="minimap"
        style={{
          height: '400px',
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          zIndex: 1, // Z-index niedriger als die Sidebar setzen
          position: 'right',
          boxShadow: '0 8px 16px rgba(242, 238, 238, 0.4)', // Korrigiertes boxShadow
        }}
      />
    </div>
  );
}
