@echo off
cd /d "%~dp0"
git add .
git commit -m "Add popular manga section with filtering tabs"
git push origin main
pause