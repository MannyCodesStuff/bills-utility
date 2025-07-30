@echo off
echo -----------------------------------------------------
echo             Building Bills Utility App
echo -----------------------------------------------------

echo Cleaning up previous builds...
if exist dist rmdir /s /q dist

echo Installing dependencies...
call npm install --legacy-peer-deps

echo Building the application...
call npm run electron:build-current

echo Build complete! 
echo.
echo The executable is located in:
echo dist\win-unpacked\Bills Utility.exe
echo.
echo Distribution Options:
echo 1. Distribute the entire win-unpacked folder (portable version)
echo 2. Create installer with: npm run electron:build-win64
echo 3. Publish to GitHub for auto-updates: npm run electron:publish-win64
echo.
echo For auto-updates to work:
echo - Make sure to update the GitHub repository info in electron-builder.yml
echo - Set up a GitHub token: set GH_TOKEN=your_github_token
echo - Create signed builds for production
echo ----------------------------------------------------- 