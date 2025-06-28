# Automatic Updates Setup Guide

This guide explains how to set up and use the automatic update system for the Bills Utility application.

## ✅ What's Already Configured

The following components have been set up for you:

1. **electron-updater** - Added as a dependency for handling automatic updates
2. **Auto-updater logic** - Integrated into the main Electron process
3. **Update UI components** - Ready-to-use React component for update notifications
4. **IPC handlers** - Communication between main and renderer processes
5. **Build scripts** - Scripts for publishing updates
6. **electron-builder configuration** - Configured for GitHub releases

## 🚀 Quick Start

### 1. Update GitHub Repository Information

Edit `electron-builder.yml` and replace the placeholder values:

```yaml
publish:
  provider: github
  owner: your-actual-github-username  # Change this!
  repo: bills-utility                 # Change if different
```

### 2. Set Up GitHub Token

For publishing updates, you need a GitHub Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Set the environment variable:
   ```bash
   # Windows (PowerShell)
   $env:GH_TOKEN="your_github_token_here"
   
   # Windows (Command Prompt)
   set GH_TOKEN=your_github_token_here
   
   # macOS/Linux
   export GH_TOKEN=your_github_token_here
   ```

### 3. Add Update Component to Your App

Add the update notification component to your main application:

```tsx
import { UpdateNotification } from '@/components/update-notification'

// Add this component to your main layout or settings page
<UpdateNotification />
```

## 📦 Publishing Updates

### For Development/Testing
```bash
npm run electron:draft
```
This builds the app but doesn't publish it.

### For Production Updates
```bash
# Publish for Windows 64-bit
npm run electron:publish-win64

# Publish for all configured platforms
npm run electron:publish
```

### Publishing Process
1. The build creates installer files and update files
2. Files are automatically uploaded to GitHub Releases
3. A new release is created with version from `package.json`
4. Users with the app installed will be notified of the update

## 🔄 How Updates Work

### User Experience
1. App automatically checks for updates on startup (production only)
2. If an update is available, user sees a notification
3. User can click "Download" to download the update
4. Once downloaded, user can click "Install & Restart"
5. App restarts with the new version

### Manual Update Check
Users can also manually check for updates using the update component UI.

## ⚙️ Configuration Options

### Auto-updater Settings (in background.ts)
```typescript
// Configure update behavior
autoUpdater.autoDownload = false // Manual download for better UX
autoUpdater.autoInstallOnAppQuit = true // Install when app closes
```

### Update Check Frequency
By default, updates are checked on app startup. You can add periodic checks:

```typescript
// Check for updates every 4 hours
setInterval(() => {
  if (isProd) {
    autoUpdater.checkForUpdatesAndNotify()
  }
}, 4 * 60 * 60 * 1000)
```

## 🔐 Code Signing (Recommended)

For production apps, code signing is highly recommended:

### Windows Code Signing
1. Get a code signing certificate
2. Add to `electron-builder.yml`:
```yaml
win:
  certificateFile: path/to/certificate.p12
  certificatePassword: password
```

### macOS Code Signing
1. Get Apple Developer certificate
2. Add to `electron-builder.yml`:
```yaml
mac:
  identity: "Developer ID Application: Your Name"
```

## 🐛 Troubleshooting

### Common Issues

**Updates not working in development:**
- Updates only work in production builds
- Use `npm run electron:build-current` to test

**GitHub publishing fails:**
- Check your GitHub token has correct permissions
- Verify repository owner/name in `electron-builder.yml`
- Ensure you're authenticated with GitHub

**Users not getting update notifications:**
- Check that the published release is marked as "Latest release"
- Verify the app is checking for updates (check console logs)
- Ensure users are running a properly signed version

### Debug Logs
Update events are logged to the console. In production, check the logs at:
- Windows: `%APPDATA%/bills-utility/logs/`
- macOS: `~/Library/Logs/bills-utility/`
- Linux: `~/.local/share/bills-utility/logs/`

## 📝 Version Management

### Updating Version
1. Update version in `package.json`
2. Commit changes
3. Tag the release: `git tag v1.2.1`
4. Push: `git push --tags`
5. Publish: `npm run electron:publish-win64`

### Semantic Versioning
Follow semantic versioning:
- `1.0.0` → `1.0.1` (patch: bug fixes)
- `1.0.0` → `1.1.0` (minor: new features)
- `1.0.0` → `2.0.0` (major: breaking changes)

## 🔒 Security Considerations

1. **Always use HTTPS** for update servers (GitHub uses HTTPS by default)
2. **Sign your builds** to prevent tampering
3. **Validate update integrity** (electron-updater does this automatically)
4. **Test updates thoroughly** before publishing

## 📚 Additional Resources

- [electron-updater documentation](https://www.electron.build/auto-update)
- [electron-builder publishing](https://www.electron.build/configuration/publish)
- [GitHub Releases API](https://docs.github.com/en/rest/releases)

## 🎯 Next Steps

1. Update the GitHub repository information in `electron-builder.yml`
2. Set up your GitHub token
3. Add the UpdateNotification component to your app
4. Test the update process with a version bump
5. Set up code signing for production
6. Create your first release! 