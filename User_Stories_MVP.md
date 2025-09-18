# User Stories & Akzeptanzkriterien (MVP)
## Cursor AI Extension - Local Time Tracking

---

## Story Map: MVP Features (1-12)

### Epic 1: Session Management
- US-001: Automatische Session-Erfassung
- US-002: Auto-Pause bei Inaktivität
- US-003: Manuelles Pause/Resume
- US-004: Session-Ende-Erkennung

### Epic 2: Datenmanagement
- US-005: Lokale Datenspeicherung
- US-006: Session-Metadaten erfassen
- US-007: Konfigurierbare Einstellungen

### Epic 3: Dashboard & Visualisierung
- US-008: Tages-Timer anzeigen
- US-009: 7-Tage-Übersicht
- US-010: Fortschritts-Ring

### Epic 4: Export & Konfiguration
- US-011: Datenexport
- US-012: Einstellungs-Dialog

---

## US-001: Automatische Session-Erfassung

**Als** Entwickler:in  
**möchte ich**, dass meine Arbeitszeit automatisch erfasst wird, wenn ich im Editor aktiv bin  
**damit** ich nicht manuell tracken muss und eine präzise Zeiterfassung erhalte.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Automatische Session-Erfassung
  Als Entwickler möchte ich automatische Zeiterfassung
  Um meine Arbeitszeit ohne manuellen Aufwand zu tracken

  Scenario: Session startet bei Editor-Aktivität
    Given ich habe Cursor geöffnet
    And die Extension ist aktiviert
    When ich anfange zu tippen oder eine Datei öffne
    Then sollte eine neue Session gestartet werden
    And der Timer sollte laufen
    And der Status sollte "aktiv" sein

  Scenario: Session läuft während Editor-Aktivität
    Given eine Session ist bereits aktiv
    When ich weiterhin im Editor arbeite
    Then sollte die Session-Zeit weiterlaufen
    And die Dauer sollte sekündlich aktualisiert werden

  Scenario: Erste Session des Tages
    Given heute wurde noch keine Session gestartet
    When ich den Editor öffne und zu arbeiten beginne
    Then sollte eine neue Session mit heutigem Datum erstellt werden
    And der Tages-Timer sollte bei 00:00 starten
`

### Definition of Done:
- [ ] Session startet automatisch bei Editor-Aktivität
- [ ] Timer läuft in Echtzeit
- [ ] Session-Daten werden in DB gespeichert
- [ ] Status wird korrekt angezeigt
- [ ] Unit-Tests für SessionTracker vorhanden

---

## US-002: Auto-Pause bei Inaktivität

**Als** Entwickler:in  
**möchte ich**, dass Sessions automatisch pausiert werden, wenn ich inaktiv bin  
**damit** nur echte Arbeitszeit gemessen wird.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Auto-Pause bei Inaktivität
  Als Entwickler möchte ich automatische Pausen
  Um nur echte Arbeitszeit zu messen

  Scenario: Session pausiert nach Idle-Timeout
    Given eine Session ist aktiv
    And der Idle-Timeout ist auf 90 Sekunden gesetzt
    When ich 90 Sekunden lang keine Aktivität im Editor habe
    Then sollte die Session automatisch pausiert werden
    And der Status sollte "pausiert" sein
    And die Idle-Zeit sollte nicht zur Arbeitszeit zählen

  Scenario: Session wird nach Aktivität fortgesetzt
    Given eine Session ist durch Inaktivität pausiert
    When ich wieder im Editor aktiv werde
    Then sollte die Session automatisch fortgesetzt werden
    And der Timer sollte weiterlaufen
    And der Status sollte wieder "aktiv" sein

  Scenario: Konfigurierbarer Idle-Timeout
    Given ich habe den Idle-Timeout auf 120 Sekunden gesetzt
    When ich 119 Sekunden inaktiv bin
    Then sollte die Session noch aktiv sein
    When ich 120 Sekunden inaktiv bin
    Then sollte die Session pausiert werden
`

### Definition of Done:
- [ ] Idle-Detection funktioniert zuverlässig
- [ ] Konfigurierbare Timeout-Werte
- [ ] Automatisches Resume bei Aktivität
- [ ] Idle-Unterbrechungen werden gezählt
- [ ] Keine Idle-Zeit in Arbeitszeit-Berechnung

---

## US-003: Manuelles Pause/Resume

**Als** Entwickler:in  
**möchte ich** Sessions manuell pausieren und fortsetzen können  
**damit** ich bewusste Pausen machen kann, ohne dass sie als Arbeitszeit zählen.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Manuelles Pause/Resume
  Als Entwickler möchte ich Sessions manuell steuern
  Um bewusste Pausen zu machen

  Scenario: Session manuell pausieren
    Given eine Session ist aktiv
    When ich den Pause-Button klicke
    Then sollte die Session pausiert werden
    And der Button sollte zu "Resume" wechseln
    And der Timer sollte stoppen

  Scenario: Session mit Shortcut pausieren
    Given eine Session ist aktiv
    When ich das Keyboard-Shortcut Ctrl+Shift+P drücke
    Then sollte die Session pausiert werden

  Scenario: Pausierte Session fortsetzen
    Given eine Session ist manuell pausiert
    When ich den Resume-Button klicke
    Then sollte die Session fortgesetzt werden
    And der Timer sollte weiterlaufen
    And der Button sollte zu "Pause" wechseln

  Scenario: Pause-Grund erfassen
    Given ich pausiere eine Session manuell
    Then sollte der Grund als "manuell" gespeichert werden
    And unterscheidbar von automatischen Pausen sein
`

### Definition of Done:
- [ ] UI-Button für Pause/Resume
- [ ] Keyboard-Shortcut funktioniert
- [ ] Visuelle Feedback (Button-State)
- [ ] Pause-Grund wird gespeichert
- [ ] Session kann beliebig oft pausiert/fortgesetzt werden

---

## US-004: Session-Ende-Erkennung

**Als** Entwickler:in  
**möchte ich**, dass Sessions automatisch beendet werden, wenn ich den Editor schließe  
**damit** meine Arbeitszeit korrekt erfasst wird.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Session-Ende-Erkennung
  Als Entwickler möchte ich automatische Session-Beendigung
  Um korrekte Arbeitszeit-Erfassung zu haben

  Scenario: Session endet beim Editor schließen
    Given eine Session ist aktiv
    When ich Cursor schließe
    Then sollte die aktuelle Session beendet werden
    And die End-Zeit sollte gesetzt werden
    And der Status sollte "abgeschlossen" sein

  Scenario: Session endet bei System-Shutdown
    Given eine Session ist aktiv
    When das System heruntergefahren wird
    Then sollte die Session vor dem Shutdown beendet werden
    And die Daten sollten gespeichert werden

  Scenario: Session-Dauer berechnen
    Given eine Session wurde beendet
    Then sollte die Gesamtdauer korrekt berechnet werden
    And Pausen-Zeiten sollten abgezogen werden
    And das Ergebnis sollte in der Datenbank gespeichert werden
`

### Definition of Done:
- [ ] Session endet automatisch beim Editor schließen
- [ ] Graceful shutdown bei System-Events
- [ ] Dauer wird korrekt berechnet
- [ ] Daten werden persistent gespeichert
- [ ] Unvollständige Sessions werden behandelt

---

## US-005: Lokale Datenspeicherung

**Als** Entwickler:in  
**möchte ich**, dass alle Daten lokal gespeichert werden  
**damit** meine Privatsphäre geschützt ist und ich keine Internetverbindung benötige.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Lokale Datenspeicherung
  Als Entwickler möchte ich lokale Datenspeicherung
  Um meine Privatsphäre zu schützen

  Scenario: Datenbank wird erstellt
    Given die Extension wird zum ersten Mal gestartet
    When die Initialisierung läuft
    Then sollte eine SQLite-Datenbank erstellt werden
    And sie sollte im lokalen Cursor-Verzeichnis liegen
    And die Tabellen sollten korrekt angelegt werden

  Scenario: Session-Daten werden gespeichert
    Given eine Session ist aktiv
    When Session-Events auftreten
    Then sollten die Daten sofort in der lokalen DB gespeichert werden
    And keine Daten sollten extern übertragen werden

  Scenario: Datenbankfehler behandeln
    Given ein Datenbankfehler tritt auf
    Then sollte ein Fallback-Mechanismus greifen
    And der Benutzer sollte informiert werden
    And die Extension sollte weiterhin funktionieren

  Scenario: Datenmigration bei Updates
    Given eine ältere Version der Datenbank existiert
    When die Extension aktualisiert wird
    Then sollten die Daten automatisch migriert werden
    And keine Daten sollten verloren gehen
`

### Definition of Done:
- [ ] SQLite-Datenbank wird korrekt erstellt
- [ ] Speicherort: ~/.cursor/time-tracking.db
- [ ] Automatische Datenmigration
- [ ] Fehlerbehandlung bei DB-Operationen
- [ ] Keine externen Datenübertragungen

---

## US-006: Session-Metadaten erfassen

**Als** Entwickler:in  
**möchte ich**, dass zusätzliche Kontext-Informationen zu meinen Sessions gespeichert werden  
**damit** ich später analysieren kann, woran ich gearbeitet habe.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Session-Metadaten erfassen
  Als Entwickler möchte ich Kontext-Informationen
  Um meine Arbeit später analysieren zu können

  Scenario: Aktuelle Datei erfassen
    Given ich arbeite in einer Datei
    When eine Session läuft
    Then sollte der Dateipfad gespeichert werden
    And bei Dateiwechsel sollte der neue Pfad aktualisiert werden

  Scenario: Projekt-Erkennung
    Given ich arbeite in einem Git-Repository
    When eine Session gestartet wird
    Then sollte der Projektname automatisch erkannt werden
    And als Metadaten gespeichert werden

  Scenario: Zeitstempel erfassen
    Given eine Session wird gestartet
    Then sollten Start-Zeit und End-Zeit präzise erfasst werden
    And in UTC-Format gespeichert werden
    And zur lokalen Zeitzone konvertierbar sein

  Scenario: Unterbrechungen zählen
    Given eine Session läuft
    When Idle-Timeouts auftreten
    Then sollte die Anzahl der Unterbrechungen gezählt werden
    And als Metadaten gespeichert werden
`

### Definition of Done:
- [ ] Dateipfad wird erfasst und aktualisiert
- [ ] Automatische Projekt-Erkennung
- [ ] Präzise Zeitstempel (UTC)
- [ ] Unterbrechungen werden gezählt
- [ ] Metadaten sind später abrufbar

---

## US-007: Konfigurierbare Einstellungen

**Als** Entwickler:in  
**möchte ich** die Extension nach meinen Bedürfnissen konfigurieren können  
**damit** sie optimal zu meinem Arbeitsablauf passt.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Konfigurierbare Einstellungen
  Als Entwickler möchte ich Einstellungen anpassen
  Um die Extension zu personalisieren

  Scenario: Idle-Timeout konfigurieren
    Given ich öffne die Einstellungen
    When ich den Idle-Timeout auf 120 Sekunden setze
    Then sollte die Änderung gespeichert werden
    And sofort wirksam sein
    And bei nächstem Start erhalten bleiben

  Scenario: Tagesziel definieren
    Given ich öffne die Einstellungen
    When ich mein Tagesziel auf 6 Stunden setze
    Then sollte der Fortschritts-Ring entsprechend kalibriert werden
    And das Ziel sollte im Dashboard angezeigt werden

  Scenario: Theme-Einstellung
    Given ich öffne die Einstellungen
    When ich das Theme auf "dunkel" setze
    Then sollte das UI entsprechend angepasst werden
    And die Einstellung sollte persistent sein

  Scenario: Standardwerte wiederherstellen
    Given ich habe Einstellungen geändert
    When ich "Standardwerte wiederherstellen" wähle
    Then sollten alle Einstellungen zurückgesetzt werden
    And die Defaults sollten aktiv sein
`

### Definition of Done:
- [ ] Einstellungen-Dialog vorhanden
- [ ] Idle-Timeout konfigurierbar (30-300 Sekunden)
- [ ] Tagesziel einstellbar (1-12 Stunden)
- [ ] Theme-Auswahl (hell/dunkel/auto)
- [ ] Einstellungen werden persistent gespeichert
- [ ] Reset-Funktion vorhanden

---

## US-008: Tages-Timer anzeigen

**Als** Entwickler:in  
**möchte ich** meine heutige Arbeitszeit auf einen Blick sehen  
**damit** ich meinen Fortschritt verfolgen kann.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Tages-Timer anzeigen
  Als Entwickler möchte ich meine heutige Arbeitszeit sehen
  Um meinen Fortschritt zu verfolgen

  Scenario: Heutige Arbeitszeit anzeigen
    Given ich habe heute 2 Stunden und 30 Minuten gearbeitet
    When ich das Dashboard öffne
    Then sollte "2:30" prominent angezeigt werden
    And das Format sollte hh:mm sein

  Scenario: Echtzeit-Updates
    Given eine Session ist aktiv
    When Zeit vergeht
    Then sollte der Timer sekündlich aktualisiert werden
    And flüssig laufen ohne Sprünge

  Scenario: Neuer Tag startet
    Given es ist 00:00 Uhr
    When ein neuer Tag beginnt
    Then sollte der Tages-Timer bei 00:00 starten
    And nicht die gestrige Zeit anzeigen

  Scenario: Mehrere Sessions am Tag
    Given ich habe mehrere Sessions heute
    When ich das Dashboard öffne
    Then sollte die Summe aller Sessions angezeigt werden
    And Pausen sollten nicht mitgezählt werden
`

### Definition of Done:
- [ ] Timer zeigt heutige Arbeitszeit an
- [ ] Format: hh:mm
- [ ] Echtzeit-Updates (1 Sekunde)
- [ ] Korrekte Berechnung bei mehreren Sessions
- [ ] Pausen werden nicht mitgezählt

---

## US-009: 7-Tage-Übersicht

**Als** Entwickler:in  
**möchte ich** meine Arbeitszeit der letzten 7 Tage visualisiert sehen  
**damit** ich Trends und Muster erkennen kann.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: 7-Tage-Übersicht
  Als Entwickler möchte ich eine Wochenübersicht
  Um Trends zu erkennen

  Scenario: Balkendiagramm anzeigen
    Given ich habe in den letzten 7 Tagen gearbeitet
    When ich das Dashboard öffne
    Then sollte ein Balkendiagramm mit 7 Balken angezeigt werden
    And jeder Balken sollte einen Tag repräsentieren
    And die Höhe sollte der Arbeitszeit entsprechen

  Scenario: Tage beschriften
    Given das 7-Tage-Diagramm wird angezeigt
    Then sollten die Tage mit Mo, Di, Mi, Do, Fr, Sa, So beschriftet sein
    And der heutige Tag sollte hervorgehoben werden

  Scenario: Arbeitszeit-Werte anzeigen
    Given ich hovere über einen Balken
    Then sollte die exakte Arbeitszeit angezeigt werden
    And das Format sollte "X Std Y Min" sein

  Scenario: Leere Tage darstellen
    Given ich habe an einem Tag nicht gearbeitet
    Then sollte der entsprechende Balken leer/minimal sein
    And trotzdem als Tag erkennbar sein
`

### Definition of Done:
- [ ] Balkendiagramm mit 7 Tagen
- [ ] Tages-Beschriftung (Mo-So)
- [ ] Hover-Tooltips mit exakten Zeiten
- [ ] Heutiger Tag hervorgehoben
- [ ] Responsive Design

---

## US-010: Fortschritts-Ring

**Als** Entwickler:in  
**möchte ich** meinen Fortschritt zum Tagesziel visualisiert sehen  
**damit** ich motiviert bleibe und weiß, wie viel ich noch arbeiten möchte.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Fortschritts-Ring
  Als Entwickler möchte ich meinen Fortschritt sehen
  Um motiviert zu bleiben

  Scenario: Fortschritt anzeigen
    Given mein Tagesziel ist 8 Stunden
    And ich habe heute 4 Stunden gearbeitet
    When ich das Dashboard öffne
    Then sollte der Fortschritts-Ring zu 50% gefüllt sein
    And "50%" sollte in der Mitte angezeigt werden

  Scenario: Ziel erreicht
    Given mein Tagesziel ist 6 Stunden
    And ich habe heute 6 Stunden gearbeitet
    When ich das Dashboard öffne
    Then sollte der Ring zu 100% gefüllt sein
    And grün eingefärbt sein
    And "Ziel erreicht!" sollte angezeigt werden

  Scenario: Ziel überschritten
    Given mein Tagesziel ist 8 Stunden
    And ich habe heute 10 Stunden gearbeitet
    When ich das Dashboard öffne
    Then sollte der Ring komplett gefüllt sein
    And "125%" sollte angezeigt werden
    And orange eingefärbt sein (Warnung)

  Scenario: Ring aktualisiert sich
    Given der Ring zeigt 70% an
    When ich weiterarbeite
    Then sollte sich der Ring in Echtzeit aktualisieren
    And flüssig animiert werden
`

### Definition of Done:
- [ ] Kreisförmiger Fortschritts-Ring
- [ ] Prozent-Anzeige in der Mitte
- [ ] Farbkodierung (grau/blau/grün/orange)
- [ ] Echtzeit-Updates
- [ ] Smooth-Animation bei Änderungen

---

## US-011: Datenexport

**Als** Entwickler:in  
**möchte ich** meine Zeiterfassungs-Daten exportieren können  
**damit** ich sie in anderen Tools analysieren oder sichern kann.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Datenexport
  Als Entwickler möchte ich meine Daten exportieren
  Um sie extern zu analysieren

  Scenario: CSV-Export
    Given ich habe Session-Daten
    When ich "Export als CSV" wähle
    Then sollte eine CSV-Datei erstellt werden
    And alle Sessions sollten enthalten sein
    And die Spalten sollten korrekt beschriftet sein

  Scenario: JSON-Export
    Given ich habe Session-Daten
    When ich "Export als JSON" wähle
    Then sollte eine JSON-Datei erstellt werden
    And alle Metadaten sollten erhalten bleiben
    And die Struktur sollte gut lesbar sein

  Scenario: Zeitraum auswählen
    Given ich möchte nur bestimmte Daten exportieren
    When ich einen Datumsbereich auswähle
    Then sollten nur Sessions aus diesem Zeitraum exportiert werden
    And die Datei sollte entsprechend benannt werden

  Scenario: Export-Speicherort
    Given ich starte einen Export
    When der Export fertig ist
    Then sollte ein Datei-Dialog geöffnet werden
    And ich sollte den Speicherort wählen können
    And eine Bestätigung sollte angezeigt werden
`

### Definition of Done:
- [ ] CSV-Export funktioniert
- [ ] JSON-Export funktioniert
- [ ] Zeitraum-Auswahl möglich
- [ ] Datei-Dialog für Speicherort
- [ ] Export-Bestätigung
- [ ] Alle Session-Daten enthalten

---

## US-012: Einstellungs-Dialog

**Als** Entwickler:in  
**möchte ich** einen benutzerfreundlichen Einstellungs-Dialog haben  
**damit** ich die Extension einfach konfigurieren kann.

### Akzeptanzkriterien (Gherkin):

`gherkin
Feature: Einstellungs-Dialog
  Als Entwickler möchte ich einen Einstellungs-Dialog
  Um die Extension zu konfigurieren

  Scenario: Dialog öffnen
    Given ich bin im Dashboard
    When ich auf das Einstellungs-Icon klicke
    Then sollte der Einstellungs-Dialog geöffnet werden
    And alle aktuellen Einstellungen sollten angezeigt werden

  Scenario: Idle-Timeout einstellen
    Given der Einstellungs-Dialog ist offen
    When ich den Slider für Idle-Timeout bewege
    Then sollte der Wert in Echtzeit angezeigt werden
    And zwischen 30-300 Sekunden einstellbar sein

  Scenario: Tagesziel einstellen
    Given der Einstellungs-Dialog ist offen
    When ich das Tagesziel auf 7 Stunden setze
    Then sollte eine Vorschau des Fortschritts-Rings angezeigt werden
    And die Änderung sollte sofort wirksam werden

  Scenario: Theme auswählen
    Given der Einstellungs-Dialog ist offen
    When ich das Theme ändere
    Then sollte das UI sofort aktualisiert werden
    And die Vorschau sollte das neue Theme zeigen

  Scenario: Einstellungen speichern
    Given ich habe Einstellungen geändert
    When ich "Speichern" klicke
    Then sollten alle Änderungen persistent gespeichert werden
    And der Dialog sollte geschlossen werden
    And eine Bestätigung sollte angezeigt werden
`

### Definition of Done:
- [ ] Modal-Dialog mit gutem UX
- [ ] Slider für Idle-Timeout (30-300s)
- [ ] Tagesziel-Eingabe (1-12h)
- [ ] Theme-Auswahl (hell/dunkel/auto)
- [ ] Echtzeit-Vorschau
- [ ] Speichern/Abbrechen-Buttons
- [ ] Bestätigung nach Speichern

---

## Definition of Done (Gesamt-MVP)

### Funktional:
- [ ] Alle 12 User Stories implementiert
- [ ] Alle Akzeptanzkriterien erfüllt
- [ ] Manuelle Tests durchgeführt
- [ ] Edge Cases abgedeckt

### Technisch:
- [ ] Unit Tests ≥ 80% Coverage
- [ ] Integration Tests für kritische Pfade
- [ ] Performance Requirements erfüllt
- [ ] Error Handling implementiert

### UX:
- [ ] UI responsive und intuitiv
- [ ] Keyboard Navigation möglich
- [ ] Accessibility Guidelines erfüllt
- [ ] Theme-Integration funktioniert

### Qualität:
- [ ] Code Review durchgeführt
- [ ] Security Review abgeschlossen
- [ ] Dokumentation aktualisiert
- [ ] Release Notes erstellt

---

**Estimation:** 120 Story Points | 3-4 Wochen Entwicklungszeit
