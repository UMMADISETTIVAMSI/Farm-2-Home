@echo off
echo Quick Deploy - Using default commit message...

REM Change to project directory
cd /d "C:\farm2home"

git add .
git commit -m "Quick update"
git push

echo Deploying frontend...
cd frontend
call npm run deploy
cd ..

echo ✅ Quick deployment complete!
pause