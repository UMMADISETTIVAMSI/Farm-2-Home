@echo off
echo Crop2Door Quick Deploy...
echo Pushing to Git...
git add .
git commit -m "crop2door update"
git push
if errorlevel 1 (
    echo Git push failed!
    pause
    exit /b 1
)
echo Deploying frontend...
cd frontend
npm run deploy
if errorlevel 1 (
    echo Frontend deploy failed!
    pause
    exit /b 1
)
echo Crop2Door deployed!
pause