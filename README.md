# Photo App 📸

Eine einfache und moderne mobile Anwendung zur Aufnahme, Verwaltung und Bearbeitung von Fotos, entwickelt mit Ionic, Vue.js und Capacitor.

## ✨ Features

* **Fotogalerie:** Zeigt alle aufgenommenen Fotos in einer übersichtlichen Rasteransicht an.
* **Datums-Gruppierung:** Fotos werden automatisch nach Aufnahmedatum gruppiert (z. B. "Heute", "Gestern", ältere Daten).
* **Native Kamera:** Nutzen Sie die Gerätekamera, um neue Fotos aufzunehmen.
* **Detailansicht:** Betrachten Sie Fotos im Vollbildmodus mit Zoom- und Wisch-Funktionalität.
* **Bildbearbeitung:** Bearbeiten Sie Ihre Fotos direkt in der App mit nativen Bearbeitungswerkzeugen.
* **Löschen:** Entfernen Sie nicht mehr benötigte Fotos.
* **Lokale Speicherung:** Alle Fotos und Daten werden sicher auf Ihrem Gerät gespeichert.

## 🛠️ Tech Stack

Das Projekt wurde mit den folgenden Technologien erstellt:

* **Framework**: [Ionic](https://ionicframework.com/) mit [Vue.js 3](https://vuejs.org/)
* **Sprache**: [TypeScript](https://www.typescriptlang.org/)
* **Build-Tool**: [Vite](https://vitejs.dev/)
* **Native Plattform**: [Capacitor](https://capacitorjs.com/)
* **Routing**: `@ionic/vue-router`
* **Testing**:
    * Unit-Tests: [Vitest](https://vitest.dev/)
    * E2E-Tests: [Cypress](https://www.cypress.io/)
* **Code-Qualität**: [ESLint](https://eslint.org/) mit TypeScript-Konfiguration

### Capacitor Plugins

* `@capacitor/camera`: Für den Zugriff auf die native Kamera.
* `@capacitor/filesystem`: Zum Speichern und Verwalten von Bilddateien.
* `@capawesome/capacitor-photo-editor`: Zum Bearbeiten von Fotos.
* Weitere Core-Plugins wie `@capacitor/app`, `@capacitor/device` und `@capacitor/status-bar`.



## 🚀 Erste Schritte

### Voraussetzungen

* Node.js (LTS-Version empfohlen)
* npm
* Android Studio (für die Android-Entwicklung)

### Installation

1.  **Klonen Sie das Repository:**
    ```bash
    git clone <repository-url>
    cd photo-app
    ```

2.  **Installieren Sie die Abhängigkeiten:**
    ```bash
    npm install
    ```

## 📜 Verfügbare Skripte

Im Projektverzeichnis können Sie die folgenden Befehle ausführen:

### `npm run dev`

Startet die App im Entwicklungsmodus mit Hot-Reload. Öffnen Sie [http://localhost:5173](http://localhost:5173), um sie im Browser anzuzeigen.

### `npm run build`

Kompiliert und bündelt die App für die Produktion im `dist`-Verzeichnis.

### `npm run test:unit`

Führt die Unit-Tests mit Vitest aus.

### `npm run test:e2e`

Führt die End-to-End-Tests mit Cypress aus.

### `npm run lint`

Überprüft den Code auf Linting-Fehler gemäß den ESLint-Regeln.



## 📱 Build für Android

Um einen nativen Android-Build zu erstellen, führen Sie die folgenden Schritte aus:

1.  **Web-Assets bauen:**
    ```bash
    npm run build
    ```

2.  **Capacitor synchronisieren:**
    Dieser Befehl kopiert die Web-Assets in das native Android-Projekt und aktualisiert die Plugins.
    ```bash
    npx cap sync android
    ```

3.  **Android Studio öffnen:**
    Öffnen Sie das Android-Projekt in Android Studio, um es zu kompilieren, auszuführen und zu debuggen.
    ```bash
    npx cap open android
    ```

In Android Studio können Sie die App dann auf einem Emulator oder einem physischen Gerät ausführen.

## 📁 Projektstruktur

```
.
├── android/             # Natives Android-Projekt
├── public/              # Statische Assets
├── src/
│   ├── router/          # Vue-Router-Konfiguration
│   ├── theme/           # CSS-Variablen für das Theming
│   ├── views/           # Hauptansichten/Seiten der App
│   ├── App.vue          # Haupt-Vue-Komponente
│   └── main.ts          # Einstiegspunkt der Anwendung
├── tests/
│   └── e2e/            # E2E-Tests (Cypress)
│   └── unit/            # Unit-Tests (Vitest)
├── capacitor.config.ts  # Capacitor-Konfiguration
├── ionic.config.json    # Ionic-Projektkonfiguration
├── package.json         # Projekt-Abhängigkeiten und Skripte
└── vite.config.ts       # Vite-Konfiguration
```