@echo off
cd /d "%~dp0"

echo ============================================
echo   NeoShell - Git Push Helper
echo ============================================
echo.

:: Check if there are changes
git status --short
if errorlevel 1 (
    echo ERROR: Not a git repository
    pause
    exit /b 1
)

echo.
echo Current changes:
git status --short
echo.

:: Prompt for commit message
set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Update NeoShell
)

echo.
echo [1/3] Adding files...
git add .

echo [2/3] Committing...
git commit -m "%commit_msg%"

echo [3/3] Pushing to GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ============================================
    echo   PUSH FAILED!
    echo ============================================
    echo.
    echo Try:
    echo   git pull origin main
    echo   Then run this script again
) else (
    echo.
    echo ============================================
    echo   PUSH SUCCESSFUL!
    echo ============================================
    echo.
    echo Repository: https://github.com/adriyansyah-mf/NeoShell
)

echo.
pause

