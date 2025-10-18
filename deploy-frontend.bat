@echo off
echo Deploying Crop2Door Frontend to GitHub Pages...
cd frontend
npm run build
npm run deploy
echo Crop2Door Frontend deployed!
pause