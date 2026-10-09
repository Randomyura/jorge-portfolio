@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
  set "DEMO_NODE=node"
) else (
  set "DEMO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Primero instala las dependencias con npm install en esta carpeta.
  pause
  exit /b 1
)
echo En este ordenador abre http://127.0.0.1:5173
echo En el movil abre http://IP-DE-ESTE-ORDENADOR:5173 estando en la misma Wi-Fi.
echo Manten esta ventana abierta. Para detener la demo, pulsa Ctrl+C.
"%DEMO_NODE%" node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173 --strictPort
pause
