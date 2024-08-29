import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';

function Settings() {
    const [primaryTextColor, setPrimaryTextColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');

    useEffect(() => {
        const savedPrimaryTextColor = localStorage.getItem('primaryTextColor');
        const savedBackgroundColor = localStorage.getItem('backgroundColor');

        if (savedPrimaryTextColor) {
            setPrimaryTextColor(savedPrimaryTextColor);
            document.documentElement.style.setProperty('--primary-text-color', savedPrimaryTextColor);
        }

        if (savedBackgroundColor) {
            setBackgroundColor(savedBackgroundColor);
            document.documentElement.style.setProperty('--background-color', savedBackgroundColor);
        }
    }, []);

    const handleTextColorChange = (e) => {
        const color = e.target.value;
        setPrimaryTextColor(color);
        document.documentElement.style.setProperty('--primary-text-color', color);
    };

    const handleBackgroundColorChange = (e) => {
        const color = e.target.value;
        setBackgroundColor(color);
        document.documentElement.style.setProperty('--background-color', color);
    };

    const handleSave = () => {
        localStorage.setItem('primaryTextColor', primaryTextColor);
        localStorage.setItem('backgroundColor', backgroundColor);
        alert('Einstellungen gespeichert!');
    };

    const handleReset = () => {
        setPrimaryTextColor('#000000');
        setBackgroundColor('#ffffff');
        document.documentElement.style.setProperty('--primary-text-color', '#000000');
        document.documentElement.style.setProperty('--background-color', '#ffffff');
        localStorage.removeItem('primaryTextColor');
        localStorage.removeItem('backgroundColor');
        alert('Einstellungen zurückgesetzt!');
    };

    return (
        <div className={styles.settingsContainer}>
            <h2 className={styles.settingsTitle}>Dashboard-Einstellungen</h2>

            <div className={styles.settingsGrid}>
                <div className={styles.settingOption}>
                    <label htmlFor="text-color">Schriftfarbe wählen:</label>
                    <input type="color" id="text-color" value={primaryTextColor} onChange={handleTextColorChange} className={`${styles.colorInput} ${styles.specificClass}`}/>
                 </div>

                <div className={styles.settingOption}>
                    <label htmlFor="background-color">Hintergrundfarbe wählen:</label>
                    <input 
                        type="color" 
                        id="background-color" 
                        value={backgroundColor} 
                        onChange={handleBackgroundColorChange} 
                        className={styles.colorInput}
                    />
                </div>

                <div className={styles.settingButtons}>
                    <button className={styles.saveButton} onClick={handleSave}>Speichern</button>
                    <button className={styles.resetButton} onClick={handleReset}>Zurücksetzen</button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
