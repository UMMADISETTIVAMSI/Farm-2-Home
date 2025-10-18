@echo off
echo Deploying Crop2Door Backend and Frontend...
echo.
echo 1. Committing and pushing to Git (Backend)...
git add .
if errorlevel 1 (
    echo Error: Git add failed
    pause
    exit /b 1
)
git commit -m "crop2door update"
if errorlevel 1 (
    echo Warning: Nothing to commit or commit failed
)
git push
if errorlevel 1 (
    echo Error: Git push failed
    pause
    exit /b 1
)
echo.
echo 2. Deploying Crop2Door Frontend to GitHub Pages...
cd frontend
if not exist package.json (
    echo Error: package.json not found in frontend directory
    pause
    exit /b 1
)
npm run deploy
if errorlevel 1 (
    echo Error: Frontend deployment failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo.
echo Crop2Door deployments complete!
pause