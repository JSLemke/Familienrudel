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

        return weatherIcons[code] || 'public/globe-connected.ico';
    };

    return (
        <div className="p-8 bg-blue-100 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-2">Wetter</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weather ? (
                <div>
                    <div className="text-5xl">{getWeatherIcon(weather.weathercode)}</div>
                    <p className="text-3xl">{weather.temperature}°C</p>
                </div>
            ) : (
                <p>Lade Wetterdaten...</p>
            )}
        </div>
    );
}
