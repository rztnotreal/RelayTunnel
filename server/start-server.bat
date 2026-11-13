@echo off
title RelayTunnel Backend Server
cd /d "%~dp0"
echo ==========================================================
echo   RELAYTUNNEL BACKEND SERVER (Zero-Knowledge VLESS)
echo ==========================================================
echo.
node server.js
pause
