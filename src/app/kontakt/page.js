'use client';

import ContactList from '../components/ContactList';

export default function KontaktPage() {
    const familyCode = "s-DFWCIX"; // Beispiel für einen Familiencode

    return (
        <div>
            <h1>Kontaktliste</h1>
            <ContactList familyCode={familyCode} />
        </div>
    );
}
