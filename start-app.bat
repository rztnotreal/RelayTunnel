@echo off
title RelayTunnel - AI Shield
cd /d "%~dp0"
echo ===================================================
echo   RELAYTUNNEL - AI Tunnel & Claude Kill Switch
echo ===================================================
echo.
echo Starting RelayTunnel local server...
start "" "http://localhost:5173"
call powershell -ExecutionPolicy Bypass -Command "npm run dev"
pause
