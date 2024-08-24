'use client';

import React, { useEffect, useState } from 'react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            setError('Geolocation wird von diesem Browser nicht unterstützt oder ist serverseitig nicht verfügbar.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lon: longitude });
            },
            (err) => {
                setError('Geolocation nicht verfügbar oder abgelehnt.');
                console.error('Error fetching location:', err);
            }
        );
    }, []);

    useEffect(() => {
        if (location) {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`)
                .then(res => res.json())
                .then(data => {
                    setWeather(data.current_weather);
                })
                .catch(error => console.error('Error fetching weather data:', error));
        }
    }, [location]);

    const getWeatherIcon = (code) => {
        const weatherIcons = {
            1: '☀️',
            2: '🌤️',
            3: '🌥️',
            45: '🌫️',
            48: '🌫️',
            51: '🌧️',
            61: '🌧️',
            80: '🌦️',
            95: '⛈️',
            96: '⛈️',
        };

        return weatherIcons[code] || '❓';
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-2">Wetter</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weather ? (
                <div>
                    <div className="text-5xl">{getWeatherIcon(weather.weathercode)}</div>
                    <p className="text-lg font-semibold">{location ? `${location.lat}, ${location.lon}` : 'Standort unbekannt'}</p>
                    <p className="text-3xl">{weather.temperature}°C</p>
                </div>
            ) : (
                <p>Lade Wetterdaten...</p>
            )}
        </div>
    );
}
