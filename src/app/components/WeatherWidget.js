'use client';

import React, { useEffect, useState } from 'react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
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
        } else {
            setError('Geolocation wird von diesem Browser nicht unterstützt.');
        }
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
            1: '☀️', // Clear sky
            2: '🌤️', // Few clouds
            3: '🌥️', // Scattered clouds
            45: '🌫️', // Fog
            48: '🌫️', // Fog
            51: '🌧️', // Drizzle
            61: '🌧️', // Rain
            80: '🌦️', // Showers
            95: '⛈️', // Thunderstorm
            96: '⛈️', // Thunderstorm with hail
            // Add more mappings based on weather codes
        };

        return weatherIcons[code] || '🌦️'; // Default neutral weather icon
    };

    return (
        <div className="p-12 bg-gradient-to-r from-blue-700 to-indigo-900 rounded-xl shadow-xl shadow-white/25 backdrop-blur-xl bg-opacity-40 backdrop-filter blur-(3px, 2, 3, 0.4) text-center max-w-xl transform transition-transform mx-center">
            <h2 className="text-5xl font-extrabold mb-8 text-white">Wetter</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weather ? (
                <div>
                    <div className="text-9xl mb-4">{getWeatherIcon(weather.weathercode)}</div>
                    <p className="text-7xl font-semibold text-white">{weather.temperature}°C</p>
                </div>
            ) : (
                <p className="text-3xl text-white">Lade Wetterdaten...</p>
            )}
        </div>
    );
}
