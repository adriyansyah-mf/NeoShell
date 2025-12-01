@echo off
echo ============================================
echo   SSH Client - Fix and Build
echo ============================================
echo.

echo [1/5] Cleaning npm cache...
call npm cache clean --force
echo.

echo [2/5] Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules removed
) else (
    echo No node_modules found
)
echo.

echo [3/5] Reinstalling dependencies...
call npm install
echo.

echo [4/5] Verifying scripts...
call npm run
echo.

echo [5/5] Building...
call npm run build

echo.
echo ============================================
if exist dist\SSH-Client-Setup-2.0.0.exe (
    echo   BUILD SUCCESSFUL!
    echo ============================================
    echo.
    echo Output files:
    dir dist\*.exe /b
) else (
    echo   BUILD FAILED!
    echo ============================================
    echo Check errors above
)
echo.

pause

