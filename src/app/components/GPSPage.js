'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import supabase from '../../utils/supabaseClient';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function GPSPage() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mapRef.current) return;

      mapRef.current = L.map('gpsmap').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      const fetchUserData = async () => {
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

  return <div id="gpsmap" style={{ height: '400px', width: '100%' }} />;
}
