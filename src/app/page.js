// src/app/page.js
'use client';

import Login from './login/components/Login';  // Korrekt: Import der Login-Komponente

export default function Home() {
    return <Login />;  // Login-Komponente wird auf der Home-Seite gerendert
}
