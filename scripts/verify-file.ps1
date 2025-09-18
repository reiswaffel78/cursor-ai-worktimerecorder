# File Verification Script
param(
    [string]$Operation,
    [string]$FilePath,
    [string]$ExpectedContent = "",
    [int]$MinSize = 0
)

Write-Host "=== FILE VERIFICATION ===" -ForegroundColor Yellow
Write-Host "Operation: $Operation" -ForegroundColor Cyan
Write-Host "File: $FilePath" -ForegroundColor Cyan

$FullPath = Join-Path (Get-Location) $FilePath
$Exists = Test-Path $FullPath

if ($Operation -eq "created" -or $Operation -eq "modified") {
    if ($Exists) {
        $FileInfo = Get-Item $FullPath
        $Size = $FileInfo.Length
        $LastWrite = $FileInfo.LastWriteTime
        
        Write-Host "✅ FILE EXISTS" -ForegroundColor Green
        Write-Host "   Size: $Size bytes" -ForegroundColor Green
        Write-Host "   Last Modified: $LastWrite" -ForegroundColor Green
        
        if ($MinSize -gt 0 -and $Size -lt $MinSize) {
            Write-Host "❌ FILE TOO SMALL" -ForegroundColor Red
            exit 1
        }
        
        if ($ExpectedContent -and $ExpectedContent.Length -gt 0) {
            $Content = Get-Content $FullPath -Raw
            if ($Content -like "*$ExpectedContent*") {
                Write-Host "✅ CONTENT VERIFIED" -ForegroundColor Green
            } else {
                Write-Host "❌ CONTENT MISMATCH" -ForegroundColor Red
                exit 1
            }
        }
        
        Write-Host "✅ VERIFICATION PASSED" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "❌ FILE NOT FOUND: $FullPath" -ForegroundColor Red
        exit 1
    }
}
