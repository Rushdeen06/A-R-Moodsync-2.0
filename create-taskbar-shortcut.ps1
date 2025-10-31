# Mood Sync - Taskbar Integration Script
# Creates desktop shortcut and guides user to pin to taskbar

param(
    [string]$GitHubUsername = ""
)

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "   MOOD SYNC - TASKBAR INTEGRATION" -ForegroundColor Cyan  
Write-Host "=====================================" -ForegroundColor Cyan

if (-not $GitHubUsername) {
    $GitHubUsername = Read-Host "`nEnter your GitHub username"
}

$AppUrl = "https://$GitHubUsername.github.io/MoodTrackingApp/"
$ShortcutPath = "$env:USERPROFILE\Desktop\Mood Sync.lnk"

Write-Host "`nCreating desktop shortcut for: $AppUrl" -ForegroundColor Green

try {
    # Create shortcut
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = $AppUrl
    $Shortcut.Description = "Mood Sync - Team Mood Tracking App"
    $Shortcut.Save()

    Write-Host "✅ Desktop shortcut created successfully!" -ForegroundColor Green
    
    Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Right-click the 'Mood Sync' shortcut on your desktop" -ForegroundColor White
    Write-Host "2. Select 'Pin to taskbar'" -ForegroundColor White
    Write-Host "3. Your app will be available in the taskbar for quick access!" -ForegroundColor White
    
    Write-Host "`nYour app URL: $AppUrl" -ForegroundColor Cyan
    
    # Offer to open the app
    $OpenApp = Read-Host "`nWould you like to open the app now? (y/n)"
    if ($OpenApp -eq 'y' -or $OpenApp -eq 'Y') {
        Start-Process $AppUrl
    }
    
} catch {
    Write-Host "❌ Error creating shortcut: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")