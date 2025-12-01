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
if exist dist\SSH-Client-Setup-2.0.0.exe (
    echo.
    echo ============================================
    echo   BUILD SUCCESSFUL!
    echo ============================================
    echo.
    echo Output files in 'dist' folder:
    dir dist\*.exe /b
    echo.
    echo Installer: dist\SSH-Client-Setup-2.0.0.exe
    echo Portable:  dist\SSH-Client-Portable-2.0.0.exe
    echo.
    echo Ready to distribute!
    echo.
) else (
    echo.
    echo ============================================
    echo   BUILD FAILED!
    echo ============================================
    echo.
    echo Please check error messages above.
    echo.
)

pause

