@echo off
echo -----------------------------------------------------
echo          Rebuilding Bills Utility App
echo -----------------------------------------------------

echo Please ensure the Bills Utility application is closed before continuing.
pause

echo Forcefully killing any running instances...
taskkill /F /IM "Bills Utility.exe" 2>nul

echo Cleaning up previous builds...
if exist dist (
  echo Removing dist directory...
  rmdir /s /q dist
)
if exist app (
  echo Removing app directory...
  rmdir /s /q app
)

echo Waiting for resources to be released...
timeout /t 3 /nobreak >nul

echo Building the application...
call npm run electron:build-current

echo Build complete! 
echo.
echo The executable is located in:
echo dist\win-unpacked\Bills Utility.exe
echo.
echo You can distribute the entire win-unpacked folder
echo or create an installer with:
echo npm run electron:build-win64
echo ----------------------------------------------------- 