import React from 'react';

function ResetButton() {
    const handleReset = () => {
        // Entfernen der benutzerdefinierten CSS-Variablen
        document.documentElement.style.removeProperty('--primary-text-color');
        document.documentElement.style.removeProperty('--background-color');
        
        // Entfernen der gespeicherten Werte aus localStorage
        localStorage.removeItem('primaryTextColor');
        localStorage.removeItem('backgroundColor');
        
        // Optional: Seite neu laden, um die Änderungen sofort zu sehen
        window.location.reload();
    };

    return (
        <button onClick={handleReset} className="reset-button">
            Design zurücksetzen
        </button>
    );
}

export default ResetButton;
