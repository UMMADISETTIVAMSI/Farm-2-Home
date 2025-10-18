@echo off
echo Starting Crop2Door deployment...
echo.

echo Step 1: Adding files to git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Git add failed
    pause
    exit /b 1
)

echo Step 2: Committing changes...
git commit -m "crop2door update"
if %errorlevel% neq 0 (
    echo No changes to commit or commit failed
)

echo Step 3: Pushing to GitHub...
git push
if %errorlevel% neq 0 (
    echo ERROR: Git push failed
    pause
    exit /b 1
)

echo Step 4: Deploying frontend...
cd frontend
if not exist package.json (
    echo ERROR: Frontend directory not found
    pause
    exit /b 1
)

npm run deploy
if %errorlevel% neq 0 (
    echo ERROR: Frontend deployment failed
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo SUCCESS: Crop2Door deployed successfully!
echo Backend: Auto-deployed to Render
echo Frontend: Deployed to GitHub Pages
pause