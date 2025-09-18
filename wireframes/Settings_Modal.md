flowchart TD
    subgraph SettingsModal["Settings Modal"]
        ModalHeader["Modal Header"]
        Title["⚙️ Einstellungen"]
        CloseButton["❌"]
        
        ModalContent["Modal Content"]
        
        IdleSection["Idle-Timeout Section"]
        IdleLabel["Idle-Timeout: 90 Sekunden"]
        IdleSlider["Slider: 30s ───O─── 300s"]
        IdleHint["Zeit ohne Aktivität, nach der eine Session pausiert wird"]
        
        GoalSection["Tagesziel Section"]
        GoalLabel["Tagesziel: 8 Stunden"]
        GoalInput["Eingabefeld: 8"]
        GoalHint["Tägliches Arbeitsziel für den Fortschritts-Ring"]
        
        ThemeSection["Theme Section"]
        ThemeLabel["Theme:"]
        ThemeDropdown["Dropdown: Auto ▼"]
        ThemeOptions["Hell | Dunkel | Auto"]
        
        ResetSection["Reset Section"]
        ResetButton["↺ Standardwerte wiederherstellen"]
        
        ModalFooter["Modal Footer"]
        CancelButton["Abbrechen"]
        SaveButton["Speichern"]
    end
    
    ModalHeader --> Title
    ModalHeader --> CloseButton
    
    ModalContent --> IdleSection
    ModalContent --> GoalSection
    ModalContent --> ThemeSection
    ModalContent --> ResetSection
    
    IdleSection --> IdleLabel
    IdleSection --> IdleSlider
    IdleSection --> IdleHint
    
    GoalSection --> GoalLabel
    GoalSection --> GoalInput
    GoalSection --> GoalHint
    
    ThemeSection --> ThemeLabel
    ThemeSection --> ThemeDropdown
    ThemeDropdown --> ThemeOptions
    
    ResetSection --> ResetButton
    
    ModalFooter --> CancelButton
    ModalFooter --> SaveButton
    
    %% Styling
    classDef header fill:#4672b4,color:white,stroke:#333,stroke-width:1px
    classDef content fill:white,color:black,stroke:#333,stroke-width:1px
    classDef section fill:#f5f5f5,color:black,stroke:#ddd,stroke-width:1px
    classDef button fill:#47956f,color:white,stroke:#333,stroke-width:1px
    classDef cancelButton fill:#8b251e,color:white,stroke:#333,stroke-width:1px
    
    class ModalHeader,Title,CloseButton header
    class ModalContent content
    class IdleSection,GoalSection,ThemeSection,ResetSection section
    class SaveButton button
    class CancelButton,ResetButton cancelButton
