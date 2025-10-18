@echo off
echo Deploying Crop2Door Frontend to GitHub Pages...
cd frontend
echo Building project...
npm run build
if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)
echo Deploying to GitHub Pages...
npm run deploy
if errorlevel 1 (
    echo Deploy failed!
    pause
    exit /b 1
)
echo Crop2Door Frontend deployed!
pause