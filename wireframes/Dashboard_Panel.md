flowchart TD
    subgraph DashboardPanel["Dashboard Panel"]
        Header["Header"]
        HeaderTitle["Time Tracking"]
        SettingsIcon["⚙️ Settings"]
        
        MainContent["Main Content Area"]
        
        TimerSection["Timer Section"]
        DailyTimer["2:45<br>Heutige Fokuszeit"]
        ProgressRing["Progress Ring<br>68% vom Tagesziel"]
        
        ChartSection["Chart Section"]
        WeeklyChart["7-Tage Übersicht<br>Mo Di Mi Do Fr Sa So"]
        BarChart["Balkendiagramm"]
        
        ActionButtons["Action Buttons"]
        PauseButton["⏸️ Pause"]
        ExportButton["📊 Export"]
    end
    
    Header --> HeaderTitle
    Header --> SettingsIcon
    
    MainContent --> TimerSection
    MainContent --> ChartSection
    MainContent --> ActionButtons
    
    TimerSection --> DailyTimer
    TimerSection --> ProgressRing
    
    ChartSection --> WeeklyChart
    ChartSection --> BarChart
    
    ActionButtons --> PauseButton
    ActionButtons --> ExportButton
    
    %% Styling
    classDef header fill:#4672b4,color:white,stroke:#333,stroke-width:1px
    classDef content fill:white,color:black,stroke:#333,stroke-width:1px
    classDef timer fill:#47956f,color:white,stroke:#333,stroke-width:1px
    classDef chart fill:#de953e,color:white,stroke:#333,stroke-width:1px
    classDef button fill:#4672b4,color:white,stroke:#333,stroke-width:1px
    
    class Header,HeaderTitle,SettingsIcon header
    class MainContent content
    class TimerSection,DailyTimer,ProgressRing timer
    class ChartSection,WeeklyChart,BarChart chart
    class ActionButtons,PauseButton,ExportButton button
