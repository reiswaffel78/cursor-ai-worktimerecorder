# Wireframes Overview

Diese Übersicht dokumentiert Zweck, Haupt-UI-Komponenten und User-Flows der drei vorhandenen MVP-Screens.

---

## Dashboard-Panel

### 1. Zweck / Ziel  
Primärer Hub der Extension: zeigt aktuelle Fokuszeit, Fortschritt zum Tagesziel und 7-Tage-Übersicht. Bietet Schnellzugriff auf Pause, Export und Einstellungen.

### 2. Haupt-Komponenten
- **Header** – Titel "Time Tracking" & ⚙️-Icon (öffnet Settings-Modal)  
- **Timer Section** – Tages-Timer (hh:mm) & Fortschritts-Ring (%)  
- **Chart Section** – 7-Tage-Balkendiagramm (Mo–So)  
- **Action Buttons** – ⏸ / ▶ Pause-Toggle, 📊 Export-Button

### 3. User-Flow (Einstieg → Aktionen → Ausstieg)
1. Sidebar-Icon "Time Tracking" klicken → Dashboard öffnet sich.  
2. Echtzeit-Metriken beobachten.  
3. Optionale Aktionen: Pause/Resume • Export → Export-Dialog • ⚙️ Settings → Settings-Modal.  
4. Panel bleibt offen oder wird über Sidebar geschlossen.

---

## Settings-Modal

### 1. Zweck / Ziel  
Ermöglicht Konfiguration von Idle-Timeout, Tagesziel und Theme für personalisierte Nutzung.

### 2. Haupt-Komponenten
- Modal-Header (Titel, ✖)  
- **Idle-Timeout** – Slider 30–300 s + Hint  
- **Tagesziel** – Zahleneingabe 1–12 h + Vorschau  
- **Theme** – Dropdown Hell | Dunkel | Auto  
- **Reset** – Standardwerte wiederherstellen  
- Footer – Cancel & Save

### 3. User-Flow  
⚙️ im Dashboard → Modal öffnet sich → Werte anpassen / Reset → Save → Modal schließt → Dashboard übernimmt neue Werte/Theme.

---

## Export-Dialog

### 1. Zweck / Ziel  
Exportiert Session-Daten als CSV oder JSON für ausgewählten Zeitraum.

### 2. Haupt-Komponenten
- Dialog-Header (Titel, ✖)  
- **Format** – Radio CSV | JSON  
- **Zeitraum** – Von/Bis mit Date-Picker  
- **Speicherort** – Pfad + "Durchsuchen"  
- **Vorschau** – Anzahl Sessions & Gesamtdauer  
- Footer – Cancel & Export

### 3. User-Flow  
📊 Export-Button im Dashboard → Dialog öffnet sich → Format & Zeitraum wählen → Speicherort festlegen → "Exportieren" → Datei wird gespeichert → Dialog schließt.

---

*(Auto-Save aktiviert)*
