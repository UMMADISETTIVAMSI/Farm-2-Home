@echo off
echo Quick Deploy...
git add . && git commit -m "update" && git push
cd frontend && npm run deploy
echo Done!
pause