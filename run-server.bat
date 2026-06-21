@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"
set PORT=8000

echo.
echo ============================================================
echo  Bubu Dudu ki Duniya - Offline Test Server
echo ============================================================
echo.

where py >nul 2>&1
if %errorlevel%==0 (
  echo Starting server on http://localhost:%PORT%
  echo Press Ctrl+C to stop the server
  echo.
  py -3 -m http.server %PORT%
  goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
  echo Starting server on http://localhost:%PORT%
  echo Press Ctrl+C to stop the server
  echo.
  python -m http.server %PORT%
  goto :eof
)

echo ERROR: Python was not found on PATH.
echo.
echo To fix this:
echo   1. Install Python from https://www.python.org
echo   2. Make sure to check "Add Python to PATH" during installation
echo   3. Restart Command Prompt
echo   4. Run this script again
echo.
pause
