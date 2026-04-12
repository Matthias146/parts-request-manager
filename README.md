# Ersatzteil-Anfragen-Tool

Internes Bestellanfragen-System fuer Lager-Mitarbeiter.

Mit diesem Tool koennen Mitarbeiter schnell Ersatzteil-Anfragen erfassen. Sachbearbeiter behalten alle offenen Anfragen im Blick, bearbeiten sie strukturiert und setzen den Bearbeitungsstatus bis zum Abschluss.

## Ziel des Projekts

Das System digitalisiert den typischen Anfrageprozess im Lager:

- Mitarbeiter erfassen Anfragen mit:
  - Teilbezeichnung
  - Fahrzeug
  - Prioritaet
  - Menge
- Sachbearbeiter sehen alle offenen Anfragen in einer Tabelle.
- Anfragen koennen gefiltert und durchsucht werden.
- Der Status wird entlang eines klaren Workflows gepflegt.

### Admin-Konfiguration

Die Admin-Zugangsdaten werden lokal konfiguriert und nicht versioniert.

1. Beispieldatei kopieren:

cp src/app/features/auth/models/.env_user.example.ts src/app/features/auth/models/.env_user.ts

2. `.env_user.ts` mit eigenen Zugangsdaten befüllen.

### Mitarbeiter

- Neue Anfrage erstellen
- Pflichtfelder: Teil, Fahrzeug, Prioritaet, Menge

### Sachbearbeiter

- Uebersicht aller offenen und laufenden Anfragen
- Statuswechsel pro Anfrage
- Suchen und Filtern (z. B. nach Fahrzeug, Teil, Prioritaet, Status)

## Status-Workflow

Eine Anfrage durchlaeuft folgende Stati:

1. Offen
2. In Pruefung
3. Bestellt
4. Erledigt

## Tech-Stack

- Angular 21
- TypeScript
- SCSS
- RxJS
- Angular Router

## Lokale Entwicklung

### Voraussetzungen

- Node.js (empfohlen: aktuelle LTS-Version)
- npm

### Installation

```bash
npm install
```

### Entwicklungsserver starten

```bash
npm start
```

Die Anwendung ist anschliessend standardmaessig unter `http://localhost:4200` erreichbar.

## Verfuegbare Skripte

- `npm start` startet den Dev-Server
- `npm run build` erzeugt ein Production-Build
- `npm run watch` baut im Watch-Modus
- `npm test` startet die Tests

## Projektstruktur (Auszug)

```text
spare_parts/
	src/
		app/
		core/
    features/
    shared/
```

## Aktueller Stand

Das Repository enthaelt aktuell ein frisches Angular-Grundgeruest. Die fachlichen Funktionen fuer das Ersatzteil-Anfragen-Tool werden darauf aufbauend implementiert.

## Geplante naechste Schritte

- Anfrage-Formular fuer Mitarbeiter erstellen
- Tabellenansicht fuer Sachbearbeiter aufbauen
- Statuswechsel inklusive Validierung implementieren
- Filter- und Suchlogik integrieren
- Optionale Persistenz (API oder lokale Mock-Daten) anbinden
