@echo off
git add .
git commit -m "crop2door update"
git push
cd frontend
npm run deploy
cd ..
echo Done!
pause