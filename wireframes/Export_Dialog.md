flowchart TD
    subgraph ExportDialog["Export Dialog"]
        DialogHeader["Dialog Header"]
        Title["📊 Daten exportieren"]
        CloseButton["❌"]
        
        DialogContent["Dialog Content"]
        
        FormatSection["Format-Auswahl"]
        FormatLabel["Exportformat:"]
        CSVRadio["○ CSV"]
        JSONRadio["● JSON"]
        
        DateRangeSection["Zeitraum-Auswahl"]
        DateRangeLabel["Zeitraum:"]
        DateFrom["Von: 01.07.2025"]
        DateTo["Bis: 06.07.2025"]
        DatePicker["📅 Auswählen"]
        
        LocationSection["Speicherort"]
        LocationLabel["Speicherort:"]
        LocationPath["C:/Users/Downloads/time-tracking-export.json"]
        BrowseButton["📁 Durchsuchen"]
        
        PreviewSection["Daten-Vorschau"]
        PreviewLabel["Vorschau: 35 Sessions, 24:15 Stunden"]
        PreviewTable["Datum | Projekt | Dauer<br>01.07. | Project A | 5:20<br>02.07. | Project B | 4:45<br>..."]
        
        DialogFooter["Dialog Footer"]
        CancelButton["Abbrechen"]
        ExportButton["Exportieren"]
    end
    
    DialogHeader --> Title
    DialogHeader --> CloseButton
    
    DialogContent --> FormatSection
    DialogContent --> DateRangeSection
    DialogContent --> LocationSection
    DialogContent --> PreviewSection
    
    FormatSection --> FormatLabel
    FormatSection --> CSVRadio
    FormatSection --> JSONRadio
    
    DateRangeSection --> DateRangeLabel
    DateRangeSection --> DateFrom
    DateRangeSection --> DateTo
    DateRangeSection --> DatePicker
    
    LocationSection --> LocationLabel
    LocationSection --> LocationPath
    LocationSection --> BrowseButton
    
    PreviewSection --> PreviewLabel
    PreviewSection --> PreviewTable
    
    DialogFooter --> CancelButton
    DialogFooter --> ExportButton
    
    %% Styling
    classDef header fill:#4672b4,color:white,stroke:#333,stroke-width:1px
    classDef content fill:white,color:black,stroke:#333,stroke-width:1px
    classDef section fill:#f5f5f5,color:black,stroke:#ddd,stroke-width:1px
    classDef button fill:#47956f,color:white,stroke:#333,stroke-width:1px
    classDef cancelButton fill:#8b251e,color:white,stroke:#333,stroke-width:1px
    
    class DialogHeader,Title,CloseButton header
    class DialogContent content
    class FormatSection,DateRangeSection,LocationSection,PreviewSection section
    class ExportButton,BrowseButton,DatePicker button
    class CancelButton cancelButton
