@echo off
echo Deploying Both Backend and Frontend...
echo.
echo 1. Committing and pushing to Git (Backend)...
git add .
git commit -m "update"
git push
echo.
echo 2. Deploying Frontend to GitHub Pages...
cd frontend
npm run build
npm run deploy
cd ..
echo.
echo All deployments complete!
pause