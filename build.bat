@echo off
:: Change to script directory
cd /d "%~dp0"

echo ============================================
echo   SSH Client - Build Script
echo ============================================
echo.
echo Working directory: %CD%
echo.

:: Check if package.json exists
if not exist package.json (
    echo ERROR: package.json not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

:: Check if electron-builder is installed
echo [1/4] Checking electron-builder...
call npm list electron-builder >nul 2>&1
if %errorlevel% neq 0 (
    echo electron-builder not found. Installing...
    call npm install --save-dev electron-builder
) else (
    echo electron-builder already installed!
)
echo.

:: Clean old build
echo [2/4] Cleaning old build...
if exist dist (
    rmdir /s /q dist
    echo Old build removed
) else (
    echo No old build found
)
echo.

:: Build
echo [3/4] Building application...
echo This may take 5-10 minutes...
echo.
call npm run build

:: Check result
echo.
echo [4/4] Checking build result...
echo.

:: Check for current version files
if exist dist\NeoShell-Setup-2.1.0.exe (
    echo ============================================
    echo   BUILD SUCCESSFUL!
    echo ============================================
    echo.
    echo ✓ Installer created successfully
    
    if exist dist\NeoShell-Portable-2.1.0.exe (
        echo ✓ Portable created successfully
    ) else (
        echo ⚠ Portable build may have issues
    )
    
    echo.
    echo Output files:
    dir dist\*.exe /b
    echo.
    echo Full paths:
    echo Installer: %CD%\dist\NeoShell-Setup-2.1.0.exe
    
    if exist dist\NeoShell-Portable-2.1.0.exe (
        echo Portable:  %CD%\dist\NeoShell-Portable-2.1.0.exe
    )
    
    echo.
    echo File sizes:
    dir dist\*.exe | findstr ".exe"
    echo.
) else (
    echo ============================================
    echo   Checking build output...
    echo ============================================
    echo.
    
    if exist dist (
        echo Dist folder exists. Files created:
        dir dist /b
        echo.
        
        if exist dist\win-unpacked (
            echo ✓ App packaged successfully
            echo   Location: dist\win-unpacked\NeoShell.exe
            echo.
            echo Installer creation may have failed.
            echo Try: npm run build:win
        )
    ) else (
        echo ✗ No dist folder created
        echo Build failed at packaging stage
    )
    
    echo.
    echo Troubleshooting:
    echo 1. Run as Administrator
    echo 2. Disable antivirus temporarily
    echo 3. Free up disk space (need 500MB+)
    echo 4. Try: build-simple.bat
    echo.
)

pause

