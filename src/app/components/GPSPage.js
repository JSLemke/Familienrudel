'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import createClientInstance from 'src/utils/supabase/client.js';

// Dynamischer Import von Leaflet
const LeafletMap = dynamic(() => import('leaflet'), { ssr: false });

export default function GPSPage() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mapRef.current) return;

      const L = require('leaflet');

      // Hier die Icon-Konfiguration einfügen
      const DefaultIcon = L.icon({
          iconUrl: '/geolocation icon.webp',  // Pfad zur Icon-Datei
          iconSize: [25, 41], // Größe des Icons
          iconAnchor: [12, 41], // Punkt des Icons, der mit der Location koordiniert
          popupAnchor: [1, -34], // Punkt, von dem aus das Popup erscheinen soll, relativ zum IconAnchor
          shadowSize: [41, 41] // Größe des Schattens
      });

      L.Marker.prototype.options.icon = DefaultIcon;

      // Karte initialisieren
      mapRef.current = L.map('gpsmap').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      const fetchUserData = async () => {
        const supabase = createClientInstance();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Fehler beim Abrufen des Benutzers', userError.message);
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Fehler beim Abrufen des Benutzernamens', error.message);
          return;
        }

        const username = data.nickname || 'Unbekannter Benutzer';

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            L.marker([latitude, longitude])
              .addTo(mapRef.current)
              .bindPopup(username)
              .openPopup();
            mapRef.current.setView([latitude, longitude], 13);
          },
          (error) => {
            console.error('Fehler beim Abrufen des Standorts', error);
          }
        );
      };

      fetchUserData();
    }
  }, []);

  return (
    <div
      id="gpsmap"
      style={{
        height: '700px',
        width: '100%',
        position: 'relative', // Sicherstellen, dass der z-index korrekt angewendet wird
        zIndex: 1, // Setzt den z-index niedriger als die Sidebar
        borderRadius: '8px', // Optional: Styling für abgerundete Ecken
        overflow: 'hidden', // Optional: Sicherstellen, dass nichts überläuft
      }}
    />
  );
}
