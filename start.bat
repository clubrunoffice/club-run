@echo off
echo Starting Club Run...
cd backend
start cmd /k "npm run dev"
timeout /t 3
cd ../frontend
start cmd /k "npm run dev"
echo Servers starting... Open http://localhost:3006 in 10 seconds
pause
