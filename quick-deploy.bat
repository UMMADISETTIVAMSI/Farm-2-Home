@echo off
echo Crop2Door Quick Deploy...
git add . && git commit -m "crop2door update" && git push
cd frontend && npm run deploy
echo Crop2Door deployed!
pause