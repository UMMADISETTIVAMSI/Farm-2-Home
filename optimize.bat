@echo off
echo Installing performance optimizations...

cd backend
echo Installing compression middleware...
npm install compression@^1.7.4
echo Backend dependencies updated!

cd ../frontend
echo Checking frontend dependencies...
npm list react-scripts > nul 2>&1
if %errorlevel% neq 0 (
    echo Installing missing frontend dependencies...
    npm install
)

echo.
echo Performance optimizations installed successfully!
echo.
echo Key improvements:
echo - Added database indexes for faster queries
echo - Implemented pagination (12 products per page)
echo - Added compression middleware
echo - Optimized MongoDB connection settings
echo - Added debounced search (300ms delay)
echo - Reduced image upload limit to 10MB
echo.
echo Run 'npm run dev' in backend and 'npm start' in frontend to test!
pause