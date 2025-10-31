@echo off
title Mood Sync - Create Taskbar Shortcut

echo.
echo =====================================
echo    MOOD SYNC - TASKBAR INTEGRATION
echo =====================================
echo.

set /p username="Enter your GitHub username: "
set url=https://%username%.github.io/MoodTrackingApp/

echo.
echo Creating desktop shortcut for: %url%
echo.

:: Create VBS script to create shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%temp%\CreateShortcut.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\Mood Sync.lnk" >> "%temp%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%temp%\CreateShortcut.vbs"
echo oLink.TargetPath = "%url%" >> "%temp%\CreateShortcut.vbs"
echo oLink.Description = "Mood Sync - Team Mood Tracking App" >> "%temp%\CreateShortcut.vbs"
echo oLink.Save >> "%temp%\CreateShortcut.vbs"

:: Run the VBS script
cscript "%temp%\CreateShortcut.vbs" >nul

:: Clean up
del "%temp%\CreateShortcut.vbs"

echo ✅ Desktop shortcut created: "Mood Sync.lnk"
echo.
echo NEXT STEPS:
echo 1. Right-click the "Mood Sync" shortcut on your desktop
echo 2. Select "Pin to taskbar"
echo 3. Your app will be available in the taskbar for quick access!
echo.
echo Your app URL: %url%
echo.
pause