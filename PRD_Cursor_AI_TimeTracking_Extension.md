# Product Requirements Document  
## Cursor AI Extension „Local Time Tracking"

---

### 1  Ziel & Vision  
Die Erweiterung misst automatisch die aktive Nutzungs- bzw. Fokuszeit im Cursor-Editor, speichert alle Daten ausschließlich lokal und zeigt sie in einem intuitiven Dashboard an. Entwickler:innen erhalten damit Klarheit über ihr Arbeits- und Pausenverhalten, können Produktivität steigern und Burn-out vorbeugen – ohne jegliche Datenweitergabe an Dritte.

**Vision 2025+:** Entwicklung zur vollständigen KI-gestützten Produktivitäts-Suite mit Gesundheits-Monitoring und Team-Collaboration-Features.

---

### 2  Stakeholder  
| Rolle | Motivation | Einfluss |
|-------|-----------|----------|
| Entwickler:innen (End-User) | Überblick über eigene Fokuszeit, Datenschutz | hoch |
| Team-Leads / PM | (Optional) aggregierte Berichte für Kapazitätsplanung | mittel |
| Security / Compliance | Lokale Daten, DSGVO-Konformität | hoch |
| Cursor-Core-Team | API-Kompatibilität, Performance | mittel |

---

### 3  Personas & Kern-User-Stories  

**Persona 1 – „Lena, Indie-Dev"**  
„Ich möchte wissen, wie viel echte Coding-Zeit ich heute hatte, damit ich Pausen planen kann."

*US-1 (MVP)*  
Als Benutzer:in möchte ich die reine Editier-/Fokuszeit pro Tag sehen, um mein Arbeitsverhalten zu verstehen.

**Persona 2 – „Alex, Team-Lead"**  
„Ich will, dass mein Team seine Zeit freiwillig analysieren kann, um realistische Deadlines zu setzen."

*US-2 (Advanced)*  
Als Team-Lead möchte ich Wochenberichte exportieren können, um Trends im Team zu erkennen.

**Persona 3 – „Dr. Sarah, Burnout-Prävention"**  
„Ich brauche KI-gestützte Warnsysteme, die mich vor Überarbeitung schützen."

*US-3 (V3.0)*  
Als gesundheitsbewusste Entwicklerin möchte ich Burnout-Früherkennung und Smart Break-Empfehlungen.

---

### 4  Funktionale Anforderungen  

#### 4.1  MVP (Version 1.0) - 12 Kernfunktionen
**Session-Management**
1. Automatische Session-Erfassung bei Editor-Aktivität (Idle-Timeout konfigurierbar, Default = 90 s).  
2. Auto-Pause Session - Idle-Timeout Detection
3. Manual Pause/Resume - UI-Button + Shortcut
4. Session End Detection - Editor wird geschlossen

**Datenerfassung & Speicherung**
5. Lokale Datenspeicherung (SQLite).  
6. Session-Metadaten - Timestamp, Datei, Projekt
7. Konfigurable Settings - Idle-Timeout, Tagesziel-Zeit

**Dashboard & Visualisierung**
8. Tages-Timer - Heutige Fokuszeit (hh:mm)
9. 7-Tage Balkendiagramm - Wochenübersicht
10. Fortschritts-Ring - Tagesziel vs. Ist-Zeit

**Export & Konfiguration**
11. Datenexport (CSV & JSON).  
12. Einstellungs-Dialog (Idle-Timeout, Tagesziel-Zeit, Theme).

#### 4.2  Erweiterte Features (Version 2.0+) - 15 Zusatzfunktionen
**Projekt-Management**
13. Git-Branch Detection - Automatisches Projekt-Tagging
14. Manuelles Tagging - Benutzerdefinierte Labels
15. Projekt-Filter - Sessions nach Projekt filtern

**Produktivitäts-Metriken**
16. Deep-Work-Quote (Sessions ≥ 25 min ohne Unterbrechung)  
17. Kontextwechsel-Rate (Datei-/Projektwechsel pro Stunde)  
18. Fokus-Trends - Wöchentliche/Monatliche Analyse

**Pomodoro-Integration**
19. Pomodoro-Timer - 25 Min Fokus-Sessions
20. Break-Reminder - Automatische Pausenerinnerung
21. Pomodoro-Statistiken - Completed Cycles Tracking

**Reporting & Analytics**
22. Wochen-/Monats-Reports inkl. Trends, Empfehlungen & optionaler Team-Export.  
23. Monats-Reports - Langzeit-Trends
24. Produktivitäts-Empfehlungen - KI-basierte Tipps
25. Team-Export - Aggregierte Berichte (Opt-in)

**Sync & Backup**
26. Verschlüsselter Export - AES-256 Backup
27. Cloud-Sync (Opt-in, z. B. iCloud, Dropbox).

#### 4.3  Advanced Features (Version 3.0+) - 18 Premium-Funktionen
**KI-Integration & Smart Analytics**
28. KI-basierte Produktivitäts-Analyse - Erkennung von Produktivitäts-Mustern
29. Smart Break-Prediction - KI schlägt optimale Pausenzeiten vor
30. Code-Complexity-Tracking - Schwierigkeitsgrad der Arbeit messen
31. Burnout-Früherkennung - Warnsystem basierend auf Arbeitsmustern
32. Personalisierte Empfehlungen - KI lernt individuelle Präferenzen

**Team & Collaboration**
33. Team-Dashboard - Anonymisierte Team-Produktivität
34. Pair-Programming-Modus - Gemeinsame Sessions erfassen
35. Team-Challenges - Gamification für Teams
36. Sprint-Integration - Scrum/Kanban-Board-Verknüpfung
37. Code-Review-Zeit-Tracking - Separate Erfassung für Reviews

**Gesundheit & Wellbeing**
38. Eye-Strain-Monitor - Blinzel-Erinnerungen basierend auf Screentime
39. Posture-Reminder - Ergonomie-Tipps nach längeren Sessions
40. Stress-Level-Indicator - Anhand von Typing-Patterns
41. Mindfulness-Integration - Meditation-Pausen vorschlagen
42. Sleep-Quality-Correlation - Produktivität vs. Schlafqualität

**Tool-Integration & Automation**
43. Jira/Trello-Integration - Automatisches Task-Tagging
44. Slack/Teams-Status - Automatische "Fokuszeit"-Status
45. Calendar-Integration - Meeting-freie Blöcke für Deep-Work

---

#### 4.3.1  Innovative & Unique Advanced Features (V3.0+)

**KI-Spezial-Features**  
- **Smart Distraction Detection** – Erkennt automatisch, wann User abgelenkt sind und schlägt gezielt Interventionen vor.
- **Optimal Work-Time Prediction** – Die KI lernt und empfiehlt individuelle, produktivitätsstarke Arbeitszeiten basierend auf Nutzerverhalten.
- **Code-Quality-Impact** – Korrelation zwischen Fokuszeit und Codequalität, um die Auswirkungen von Arbeitsstil auf das Ergebnis sichtbar zu machen.

**Unique Wellbeing & Productivity Features**  
- **Mood-Tracking** – Kurzes Befinden-Check-in vor/nach Sessions, z. B. per Emoji oder Skala.
- **Energy-Level-Mapping** – Visualisiert, wann der User am produktivsten ist (z. B. Heatmap über den Tag).
- **Focus-Music-Integration** – Verknüpfung mit Spotify/Apple Music, um während Fokusphasen gezielt Musik für Deep Work zu spielen.

**Research & Experiment-Features**  
- **Productivity-Research-Opt-in** – Möglichkeit, anonymisierte Daten der Forschung zur Verfügung zu stellen (Opt-in).
- **A/B-Testing-Framework** – Testumgebung für verschiedene Arbeits- und Pausenmethoden, um individuell passende Workflows zu finden.
- **Biometric-Integration** – Anbindung an Wearables (Herzfrequenz, Stress-Level), um physiologische Daten mit Produktivität zu korrelieren.

**Gesamt: 45 Funktionen über alle Versionen hinweg.**

---

### 5  Nicht-funktionale Anforderungen  
| Kategorie | Zielwerte |
|-----------|-----------|
| Performance | CPU-Overhead < 1 %, RAM < 50 MB, DB < 5 MB/Monat |
| Sicherheit | Keine externen Requests ohne Opt-in; AES-256 bei Export/Sicherungen |
| Usability | ≤ 3 Klicks zur Kerninfo; dunkles/helles Theme folgt Cursor-Einstellung |
| Zuverlässigkeit | Crash-freie Sessions ≥ 99 % |
| Erweiterbarkeit | Modul-Architektur, API-Layer, ≥ 80 % Testabdeckung |
| KI-Performance | ML-Modelle < 10 MB, Inference < 100ms |

---

### 6  Datenhaltung & Datenschutz  
- Speicherort: ~/.cursor/time-tracking.db (Einzel-User-Scope).  
- Tabellenstruktur:  
  session(id, start_ts, end_ts, project, file, tags, interrupted, complexity_score, stress_level)  
- Backups & Export als verschlüsselte ZIP-Datei (AES-256, passwortgeschützt).  
- DSGVO: Keine personenbezogenen Daten außer lokalem Username; Standard-Opt-out für jeglichen Sync.
- KI-Daten: Lokale ML-Modelle, keine Datenübertragung an externe KI-Services.

---

### 7  UI/UX-Konzept  
1. Sidebar-Icon → Panel „Time Tracking".  
2. Header-Widget: heutige Fokuszeit + Fortschritts-Ring vs. Tagesziel.  
3. Diagramm-Sektion:  
   • Balken = Tage | Linie = Deep-Work-Quote.  
4. Detail-Tab: Session-Tabelle mit Filter, Suche, Tagging.  
5. Settings-Modal: Timeout-Slider, Ziele, Ex-/Import, Theme.
6. Health-Dashboard: Stress-Level, Break-Recommendations, Wellbeing-Score.
7. Team-Tab: Anonymisierte Team-Metriken (Opt-in).

*(Mockups werden separat in Figma bereitgestellt.)*

---

### 8  Technische Architektur  
- Frontend: React-WebView (Cursor Extension) + Recharts + TensorFlow.js.  
- Backend: Node-Sidecar, DB-Zugriff via better-sqlite3.  
- Event-Listener: onDidChangeTextDocument, onDidChangeActiveTextEditor.  
- Haupt-Services:  
  - SessionTracker (Start/Stop/Idle-Check)  
  - DataStore (CRUD, Migration)  
  - AnalyticsService (Metrik-Berechnung)  
  - AIService (ML-Modelle, Predictions)
  - HealthService (Stress-Detection, Break-Recommendations)
- IPC: WebView ↔ Node über vscode.postMessage.
- ML-Stack: TensorFlow.js für lokale KI-Inferenz.

---

### 9  KPIs / Erfolgskriterien  
| KPI | MVP | V2.0 | V3.0 |
|-----|-----|------|------|
| Installationen (Monat 1) | ≥ 1 000 | ≥ 5 000 | ≥ 15 000 |
| Crash-freie Nutzung | ≥ 99 % | ≥ 99.5 % | ≥ 99.9 % |
| Ø Benutzerzufriedenheit | ≥ 4.5 / 5 | ≥ 4.7 / 5 | ≥ 4.8 / 5 |
| Opt-in-Sync-Rate | ≥ 20 % | ≥ 30 % | ≥ 40 % |
| Premium-Conversion | - | ≥ 10 % | ≥ 15 % |

---

### 10  Roadmap  
| Phase | Dauer | Deliverables | Funktionen |
|-------|-------|--------------|------------|
| 0 Konzept | 1 Woche | PRD, Mockups | - |
| 1 MVP | 3 Wochen | Tracking, Dashboard, Export | 12 Funktionen |
| 2 Beta | 2 Wochen | Nutzer-Feedback, Bugfixes | - |
| 3 Release V1 | 1 Woche | Store-Listing, Marketing | - |
| 4 V2.0 | 4 Wochen | Tagging, Pomodoro, Analytics | 15 Funktionen |
| 5 V3.0 | 6-8 Wochen | KI-Features, Health-Monitoring, Advanced & Research-Features | 18+ Features |

**Gesamt-Entwicklungszeit: 17-18 Wochen | 45 Funktionen**

---

### 11  Risiken & Gegenmaßnahmen  
| Risiko | Auswirkung | Mitigation |
|--------|------------|------------|
| Cursor-API-Änderungen | Tracking funktioniert nicht | Abstraktions-Layer, E2E-Tests |
| Performance-Einbußen | Schlechte UX → Uninstall | Profiling, Lazy-Load Charts |
| Datenschutz-Bedenken | Niedrige Adoption | Transparente Kommunikation, Open-Source Schema |
| KI-Modell-Accuracy | Schlechte Empfehlungen | A/B-Testing, Nutzer-Feedback-Loop |
| Komplexität V3.0 | Überforderung | Stufenweise Einführung, Feature-Flags |

---

### 12  Monetarisierung  
- **MVP (V1.0)**: Kostenlos (Freemium-Modell)
- **V2.0**: Premium - 5€/Monat (Pomodoro, Analytics, Export)
- **V3.0**: Professional - 15€/Monat (KI-Features, Health-Monitoring, Team- und Advanced Features, Forschung & Biometrie)
- **Enterprise**: 50€/Monat (Team-Dashboards, SAML-SSO, Compliance-Features)
- **Hinweis:** Forschungsteilnahme, Biometrie und Cloud-Sync immer Opt-in & datenschutzkonform.

---

### 13  Glossar  
- **Idle-Timeout** – Zeitraum ohne Tastatur/Maus-Input, nach dem eine Session pausiert.  
- **Deep-Work-Quote** – Anteil der Gesamtzeit, der aus Sessions ≥ 25 min besteht.  
- **Kontextwechsel-Rate** – Anzahl Editor-/Projektwechsel pro Zeiteinheit.
- **Stress-Level-Indicator** – KI-basierte Analyse von Tipp-Mustern zur Stress-Erkennung.
- **Burnout-Score** – Risiko-Bewertung basierend auf Arbeitsmustern und Pausenverhalten.

---

_Lizenz: MIT_  
_Letzte Aktualisierung: 06.07.2025_
