@echo off
echo Deploying Farm2Home...

REM Change to project directory
cd /d "C:\farm2home"

REM Add all changes
git add .

REM Commit with message (you can change this)
set /p message="Enter commit message (or press Enter for default): "
if "%message%"=="" set message=Update project

git commit -m "%message%"

REM Push to GitHub
echo Pushing to GitHub...
git push

REM Wait for Render to auto-deploy backend (optional)
echo Waiting 30 seconds for backend deployment...
timeout /t 30 /nobreak

REM Deploy frontend
echo Deploying frontend to GitHub Pages...
cd frontend
call npm run deploy
cd ..

echo.
echo ✅ Deployment complete!
echo Backend: https://farm2home-backend-gr1i.onrender.com
echo Frontend: https://UMMADISETTIVAMSI.github.io/Farm-2-Home
pause