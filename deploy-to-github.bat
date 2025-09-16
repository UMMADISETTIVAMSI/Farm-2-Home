@echo off
echo Farm2Home GitHub Deployment Script
echo ===================================

echo.
echo Step 1: Create GitHub Repository
echo Go to https://github.com and create a new repository named 'farm2home'
echo (Don't initialize with README)
echo.

set /p username="Enter your GitHub username: "
set /p continue="Press Enter after creating the repository..."

echo.
echo Step 2: Connecting to GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/%username%/farm2home.git
git branch -M main

echo.
echo Step 3: Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Successfully pushed to GitHub!
echo Repository URL: https://github.com/%username%/farm2home
echo.
echo Next steps:
echo 1. Deploy frontend to Vercel/Netlify
echo 2. Deploy backend to Railway/Render
echo 3. Update environment variables
echo.
pause