# My Supabase Auth Server

## Projektübersicht
Dies ist ein Node.js-basiertes Projekt, das Express.js und Supabase verwendet, um ein Authentifizierungssystem zu implementieren. Der Server läuft auf `http://localhost:3001` und verbindet sich mit Supabase zur Verwaltung von Benutzern und Familiengruppen.

## Voraussetzungen
- Node.js (Empfohlene Version: 18.x)
- npm (Installiert mit Node.js)
- Git

## Einrichtung

### 1. Repository klonen

git clone <dein-repo-url>
cd my-supabase-auth-server

2. Abhängigkeiten installieren
Stelle sicher, dass du dich im richtigen Verzeichnis befindest und führe dann den folgenden Befehl aus:

npm install

3. Umgebungsvariablen einrichten
Erstelle eine .env-Datei im Verzeichnis my-supabase-auth-server und füge die folgenden Zeilen hinzu:

SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

4. Server starten
Starte den Server mit dem folgenden Befehl:

npm start

Der Server sollte auf http://localhost:3001 laufen.

### Verwendung
## Endpunkte
POST /createInviteCode: Erzeugt einen Einladungscode für eine Familie.
POST /joinFamily: Ermöglicht es einem Benutzer, einer Familie über einen Einladungscode beizutreten.
## Versionskontrolle
Änderungen committen
Verwende Git, um alle Änderungen zu committen und zu einem Remote-Repository zu pushen:

```
git add .
git commit -m "Deine Nachricht"
git push origin main
```
### Tagging
Erstelle Tags, um stabile Versionen zu markieren:

```
git tag -a v1.0.0 -m "Stable version"
git push origin v1.0.0
```
### Sicherung und Wiederherstellung
### Regelmäßige Backups
Projektordner sichern: Erstelle regelmäßige Backups des Projektordners.
Sichere .env-Dateien an einem sicheren Ort (z.B. verschlüsselter USB-Stick).
Wiederherstellung
Wenn du das Projekt neu einrichten musst, klone das Repository und folge den Einrichtungsschritten.

### Stabile Entwicklungsumgebung
### Node.js Version
Verwende eine stabile Node.js-Version (z.B. 18.x). Wechsle mit nvm zur empfohlenen Version:

'''
nvm install 18
nvm use 18

'''

Caching und Abhängigkeiten
Cache leeren: Falls notwendig, lösche Node.js- und Build-Caches:

npm cache clean --force
rm -rf node_modules
npm install

Warnungen und Deprecations
Deprecation Warnungen
Falls du eine Warnung wie punycode erhältst, ist dies ein Hinweis darauf, dass das Modul veraltet ist. Aktualisiere deine Abhängigkeiten regelmäßig.

npm update


Falls eine bestimmte Abhängigkeit das Problem verursacht, suche nach einer aktualisierten Version oder einer Alternative.

### Docker (Optional)
Für eine wiederholbare Entwicklungsumgebung kannst du Docker verwenden. Erstelle eine Dockerfile und eine docker-compose.yml, um deine Umgebung in Containern zu isolieren.

### Fehlerbehebung
### Bekannte Probleme
Fehler: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.
Stelle sicher, dass die .env-Datei korrekt geladen wird und die Umgebungsvariablen gesetzt sind.
### Nützliche Befehle
Server starten: npm start
Abhängigkeiten installieren: npm install
Versionen verwalten: nvm use 18
Kontakt und Support
Falls du Fragen hast oder auf Probleme stößt, kannst du dich jederzeit an das Projektteam wenden oder ein Issue im Repository eröffnen.