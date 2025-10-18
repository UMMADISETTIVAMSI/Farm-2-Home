Write-Host "Crop2Door Deploy..." -ForegroundColor Green
git add .
git commit -m "crop2door update"
git push
Set-Location frontend
npm run deploy
Set-Location ..
Write-Host "Done!" -ForegroundColor Green
Read-Host "Press Enter to exit"