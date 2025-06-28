import path from 'path'
import * as fs from 'fs'
import mssql from 'mssql'
import * as http from 'http'
import serve from 'electron-serve'
import { spawn } from 'child_process'
import { createWindow } from './helpers'
import {
  app,
  ipcMain,
  dialog,
  screen,
  BrowserWindow,
  nativeImage
} from 'electron'
import { autoUpdater } from 'electron-updater'
import { StoreId } from '@/hooks/use-store'
import { TabType } from '@/components/bill-manager'
import {
  getBillsDirectorCandidates,
  getNonInvoiceDirectorCandidates,
  getScansDirectorCandidates
} from './helpers/directories'

export const dbConfig: mssql.config = {
  user: 'digitalsigns',
  password: '84ndzah',
  server: '10.1.210.100',
  database: 'STORESQL',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    requestTimeout: 120000 // Timeout for queries (e.g., 90 seconds)
  },
  pool: {
    max: 100, // Allow up to 100 connections
    min: 1, // Always keep at least 1 connections ready
    idleTimeoutMillis: 30000, // Close unused connections after 30s
    acquireTimeoutMillis: 30000 // Wait up to 30s to get a free connection
  },
  requestTimeout: 120000
}

// Define message type for TypeScript
interface ServerMessage {
  type: string
  port?: number
  [key: string]: any
}

// const isProd = process.env.NODE_ENV === 'production'
const isProd = app.isPackaged

// Store all server processes to ensure they can be cleaned up
let serverProcesses: ReturnType<typeof spawn>[] = []

// Configure auto-updater
if (isProd) {
  autoUpdater.logger = require('electron-log')
  autoUpdater.logger.info('Auto-updater initialized')
  autoUpdater.autoDownload = true // Automatically download updates
  autoUpdater.autoInstallOnAppQuit = true // Install when app quits

  // Disable signature verification for internal company apps
  // ✅ This is the recommended approach for internal-only applications

  // Allow updates without signature verification
  autoUpdater.allowDowngrade = false
  autoUpdater.allowPrerelease = false

  // Code signing is now enabled - signature verification will work properly
  console.log('✅ Auto-updater configured with code signing enabled')

  // Add better error handling
  autoUpdater.on('error', error => {
    autoUpdater.logger.error(`Auto-updater error: ${error.message}`)
    console.error('Auto-updater error:', error)
  })

  autoUpdater.on('update-available', info => {
    autoUpdater.logger.info(`Update available: ${info.version}`)
  })

  autoUpdater.on('update-not-available', info => {
    autoUpdater.logger.info(
      `No update available. Current version: ${info.version}`
    )
  })
}

// Store reference to main window for auto-updater events
let mainWindowRef: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null
let isInStartupSequence = false

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

// Settings management
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json')

function getExistingDirectories(storeId: StoreId, date: Date) {
  console.log('getting existing directories for', storeId)
  return {
    scans: getExistingDirectory(storeId, 'scans', date),
    bills: getExistingDirectory(storeId, 'bills', date),
    'non-invoice': getExistingDirectory(storeId, 'non-invoice', date)
  }
}

function getExistingDirectory(storeId: StoreId, type: TabType, date: Date) {
  let candidates: string[] = []
  if (type === 'scans') {
    candidates = getScansDirectorCandidates(storeId)
  } else if (type === 'bills') {
    candidates = getBillsDirectorCandidates(storeId, date)
  } else if (type === 'non-invoice') {
    candidates = getNonInvoiceDirectorCandidates(storeId, date)
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  return null
}

// Get settings with defaults
function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const settingsData = fs.readFileSync(SETTINGS_FILE, 'utf8')
      return JSON.parse(settingsData)
    }
  } catch (err) {
    console.error('Error reading settings file:', err)
  }

  // Default settings with empty default directory
  return {
    defaultDirectory: '',
    serverPort: 5000 // Default port
  }
}

// fetch vendors from database
async function fetchVendors() {
  const pool = await mssql.connect(dbConfig)
  const result = await pool
    .request()
    .query('select F27 as id, F334 as name from STORESQL.dbo.VENDOR_TAB')
  return result.recordset
}

// Save settings to file
function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8')
    return true
  } catch (err) {
    console.error('Error saving settings file:', err)
    return false
  }
}

// Update a specific setting
function updateSetting(key, value) {
  const settings = getSettings()
  settings[key] = value
  return saveSettings(settings)
}

// Create default settings file if it doesn't exist
function ensureSettingsFile() {
  if (!fs.existsSync(SETTINGS_FILE)) {
    saveSettings(getSettings())
  }
}

// Create splash window
function createSplashWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const iconPath = path.join(__dirname, '..', 'resources', 'icon.png')
  splashWindow = new BrowserWindow({
    width: 400,
    height: 350, // Slightly taller for new content
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      nodeIntegration: true, // Allow node integration for IPC
      contextIsolation: false // Disable context isolation for splash
    },
    x: Math.floor((width - 400) / 2),
    y: Math.floor((height - 350) / 2),
    show: false
  })

  // Create enhanced HTML content for the splash screen with status updates
  const splashHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #6bcf8d 0%, #1e8c7a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: white;
          border-radius: 12px;
          overflow: hidden;
        }
        .logo {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .version {
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 30px;
        }
        .status {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 20px;
          min-height: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .progress-container {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          width: 0%;
          transition: width 0.3s ease;
        }
        .loading {
          display: flex;
          gap: 4px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: loading 1.4s infinite both;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes loading {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="logo">📄</div>
      <div class="title">Bills Utility</div>
      <div class="version" id="version">v${app.getVersion()}</div>
      <div class="status" id="status">Initializing application...</div>
      <div class="progress-container">
        <div class="progress-bar" id="progress"></div>
      </div>
      <div class="loading">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      
      <script>
        const { ipcRenderer } = require('electron');
        
        // Listen for status updates from main process
        ipcRenderer.on('splash-status', (event, data) => {
          const statusEl = document.getElementById('status');
          const progressEl = document.getElementById('progress');
          
          if (data.message) {
            statusEl.textContent = data.message;
            statusEl.classList.add('fade-in');
            setTimeout(() => statusEl.classList.remove('fade-in'), 300);
          }
          
          if (data.progress !== undefined) {
            progressEl.style.width = data.progress + '%';
          }
        });
      </script>
    </body>
    </html>
  `

  splashWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(splashHtml)}`
  )

  splashWindow.once('ready-to-show', () => {
    console.log('Splash window ready, showing splash...')
    splashWindow?.show()
  })

  return splashWindow
}

// Function to update splash screen status
function updateSplashStatus(message: string, progress?: number) {
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.send('splash-status', { message, progress })
    console.log(
      `Splash status: ${message}${progress !== undefined ? ` (${progress}%)` : ''}`
    )
  }
}

// Enhanced startup sequence with status updates
async function performStartupSequence(mainWindow: BrowserWindow) {
  isInStartupSequence = true
  updateSplashStatus('Starting application...', 10)

  // Start server
  updateSplashStatus('Starting server...', 20)
  const serverResult = startServer(mainWindow)
  await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause

  updateSplashStatus('Loading application...', 40)

  // Load main window content
  if (isProd) {
    await mainWindow.loadURL('app://./')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/`)
  }

  updateSplashStatus('Checking for updates...', 60)

  // Check for updates if in production (automatic silent updates)
  if (isProd) {
    try {
      // Set up progress tracking before checking for updates
      let updateDownloaded = false
      let updateAvailable = false

      autoUpdater.once('update-available', info => {
        updateAvailable = true
        updateSplashStatus(`Update available: v${info.version}`, 70)
        updateSplashStatus(`Downloading v${info.version}...`, 75)
      })

      autoUpdater.on('download-progress', progressObj => {
        const progress = Math.round(75 + progressObj.percent * 0.15) // 75-90%
        updateSplashStatus(
          `Downloading ${progressObj.percent.toFixed(1)}%...`,
          progress
        )
      })

      autoUpdater.once('update-downloaded', info => {
        updateDownloaded = true
        console.log(
          `Update v${info.version} downloaded successfully - main handler will restart app`
        )
      })

      // Check for updates (will automatically download if available)
      const updateResult = await autoUpdater.checkForUpdates()

      // Wait for download to complete if an update was found
      if (updateAvailable) {
        // Wait for download to complete (max 5 minutes for updates)
        let waitTime = 0
        while (!updateDownloaded && waitTime < 300000) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          waitTime += 1000
        }

        if (updateDownloaded) {
          // Update downloaded, app will restart automatically
          // Don't proceed to show main window - let the restart happen
          updateSplashStatus('Restarting to install update...', 98)
          await new Promise(resolve => setTimeout(resolve, 2000))
          console.log(
            'Update downloaded during splash - app will restart shortly'
          )
          isInStartupSequence = false
          return null // Exit early, don't show main window
        } else {
          updateSplashStatus(
            'Update download taking longer - continuing...',
            85
          )
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
      } else {
        updateSplashStatus('App is up to date', 80)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
      autoUpdater.logger.error(`Update check failed: ${error.message}`)

      // Check if it's a 404 error (likely private repository)
      if (error.message && error.message.includes('404')) {
        updateSplashStatus(
          'Repository access issue - check if repo is public',
          80
        )
        console.log(
          '💡 Tip: Make sure your GitHub repository is public for auto-updates to work'
        )
      } else {
        updateSplashStatus('Update check failed, continuing...', 80)
      }
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  } else {
    updateSplashStatus('Development mode - skipping updates', 80)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  updateSplashStatus('Finalizing...', 95)
  await new Promise(resolve => setTimeout(resolve, 500))

  updateSplashStatus('Ready!', 100)
  await new Promise(resolve => setTimeout(resolve, 800))

  isInStartupSequence = false
  return serverResult
}

// Auto-updater event handlers
function setupAutoUpdaterEvents() {
  if (!isProd) return

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
    if (mainWindowRef) {
      mainWindowRef.webContents.send('update-status', {
        type: 'checking-for-update',
        message: 'Checking for updates...'
      })
    }
  })

  autoUpdater.on('update-available', info => {
    console.log('Update available:', info)
    if (mainWindowRef) {
      mainWindowRef.webContents.send('update-status', {
        type: 'update-available',
        message: 'A new update is available!',
        version: info.version,
        releaseNotes: info.releaseNotes
      })
    }
  })

  autoUpdater.on('update-not-available', info => {
    console.log('Update not available:', info)
    if (mainWindowRef) {
      mainWindowRef.webContents.send('update-status', {
        type: 'update-not-available',
        message: 'You are running the latest version.'
      })
    }
    // No automatic dialog - only show when manually triggered from menu
  })

  autoUpdater.on('error', err => {
    console.error('Update error:', err)
    if (mainWindowRef) {
      mainWindowRef.webContents.send('update-status', {
        type: 'error',
        message: 'Error checking for updates: ' + err.message
      })
    }
  })

  autoUpdater.on('download-progress', progressObj => {
    const logMessage = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`
    console.log(logMessage)
    if (mainWindowRef) {
      mainWindowRef.webContents.send('update-status', {
        type: 'download-progress',
        message: 'Downloading update...',
        progress: progressObj
      })
    }
  })

  autoUpdater.on('update-downloaded', info => {
    console.log('Update downloaded:', info)

    if (mainWindowRef) {
      mainWindowRef.webContents.send('update-status', {
        type: 'update-downloaded',
        message: `Update v${info.version} downloaded. Restarting to install...`,
        version: info.version
      })
    }

    // Update splash if still showing
    if (isInStartupSequence && splashWindow && !splashWindow.isDestroyed()) {
      updateSplashStatus(
        `Update v${info.version} downloaded! Restarting...`,
        95
      )
    }

    // Automatically restart and install the update immediately
    console.log('🔄 Auto-restarting to install update...')
    const delay = isInStartupSequence ? 3000 : 2000 // Give more time during startup
    setTimeout(() => {
      autoUpdater.quitAndInstall(false, true) // Install immediately, restart app
    }, delay)
  })
}

function startServer(mainWindow: BrowserWindow) {
  // Enhanced logging
  const logFilePath = path.join(app.getPath('userData'), 'server-startup.log')
  const logStream = fs.createWriteStream(logFilePath, { flags: 'a' })

  const log = (message: string) => {
    const timestamp = new Date().toISOString()
    const logMessage = `${timestamp} - ${message}`
    console.log(logMessage)
    logStream.write(logMessage + '\n')

    if (mainWindow && !mainWindow.isDestroyed()) {
      // Send log message to renderer process via IPC instead of executeJavaScript
      try {
        mainWindow.webContents.send('log-message', logMessage)
      } catch (err) {
        console.error('Failed to send log to renderer:', err)
      }
    }
  }

  // In development, use the server directory
  let serverPath = path.join(__dirname, '../server/server.js')

  // In production, the server will be in the resources directory
  if (app.isPackaged) {
    serverPath = path.join(process.resourcesPath, 'server/server.js')
  }

  // Check if the server file exists
  try {
    fs.accessSync(serverPath, fs.constants.F_OK)
    log(`Server file exists at: ${serverPath}`)
  } catch (err) {
    log(`ERROR: Server file not found at ${serverPath}`)
    mainWindow.webContents.send('server-status', {
      status: 'error',
      message: `Server file not found: ${serverPath}`
    })
    return null
  }

  // Check for executable Node.js
  let nodePath = 'node'

  if (app.isPackaged) {
    // Use bundled Node in production if available
    const bundledNodePath = path.join(process.resourcesPath, 'node/node.exe')
    try {
      fs.accessSync(bundledNodePath, fs.constants.X_OK)
      nodePath = bundledNodePath
      log(`Using bundled Node.js: ${bundledNodePath}`)
    } catch (err) {
      log(`Bundled Node.js not found, using system Node: ${err.message}`)
    }
  }

  log(`Starting server from: ${serverPath} using Node: ${nodePath}`)

  // Check for required modules
  const requiredModules = ['express', 'cors']
  const modulesDir = path.join(path.dirname(serverPath), 'node_modules')

  for (const module of requiredModules) {
    try {
      const modulePath = path.join(modulesDir, module)
      fs.accessSync(modulePath, fs.constants.F_OK)
      log(`Module ${module} found at: ${modulePath}`)
    } catch (err) {
      log(`WARNING: Module ${module} not found in ${modulesDir}`)
    }
  }

  let serverProcess: ReturnType<typeof spawn> | null = null

  try {
    serverProcess = spawn(nodePath, [serverPath], {
      stdio: 'pipe',
      // Use shell on Windows to ensure proper path resolution
      shell: process.platform === 'win32'
    })

    // Add to the tracked processes for cleanup
    if (serverProcess) {
      serverProcesses.push(serverProcess)
      log(`Added server process with PID ${serverProcess.pid} to tracking list`)
    }

    let serverReady = false
    let serverPort = 5000 // Default port
    let startupTimeout: NodeJS.Timeout | null = null

    serverProcess.on('error', err => {
      log(`ERROR: Failed to start server process: ${err.message}`)
      mainWindow.webContents.send('server-status', {
        status: 'error',
        message: `Failed to start server process: ${err.message}`
      })
    })

    // Set a timeout for server startup
    startupTimeout = setTimeout(() => {
      if (!serverReady) {
        log(
          'ERROR: Server startup timeout - could not connect to server after 30 seconds'
        )
        mainWindow.webContents.send('server-status', {
          status: 'error',
          message: 'Server startup timeout'
        })
      }
    }, 30000)

    // Handle server process stdout safely
    serverProcess.stdout?.on('data', data => {
      const output = data.toString()
      log(`Server stdout: ${output}`)

      // Check if the server has started and extract the port if available
      if (output.includes('Server is running at http://localhost:')) {
        const portMatch = output.match(/localhost:(\d+)/)
        if (portMatch && portMatch[1]) {
          serverPort = parseInt(portMatch[1], 10)
          log(`Server running on port ${serverPort}`)
          serverReady = true

          // Save the port to settings
          updateSetting('serverPort', serverPort)

          if (startupTimeout) {
            clearTimeout(startupTimeout)
            startupTimeout = null
          }

          // Notify the renderer process that the server is ready
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('server-status', {
              status: 'ready',
              port: serverPort
            })
          }
        }
      }
    })

    // Handle server process stderr safely
    serverProcess.stderr?.on('data', data => {
      const errorOutput = data.toString()
      log(`Server stderr: ${errorOutput}`)

      // If we get a critical error on startup, notify the renderer
      if (!serverReady && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('server-status', {
          status: 'error',
          message: errorOutput
        })
      }
    })

    // Handle server process exit safely
    serverProcess.on('exit', (code, signal) => {
      log(`Server process exited with code ${code} and signal ${signal}`)

      // Remove from tracked processes
      const index = serverProcesses.findIndex(p => p === serverProcess)
      if (index !== -1) {
        serverProcesses.splice(index, 1)
        log(
          `Removed server process from tracking list, ${serverProcesses.length} remaining`
        )
      }

      if (serverReady && mainWindow && !mainWindow.isDestroyed()) {
        // If server was running but exited unexpectedly
        mainWindow.webContents.send('server-status', {
          status: 'stopped',
          message: `Server stopped with code ${code}`
        })
      }
    })

    // Check if the server is running periodically
    // const checkServerHealth = () => {
    //   if (!serverReady) return

    //   // log('Performing server health check')
    //   const healthCheckReq = http.request(
    //     {
    //       host: 'localhost',
    //       port: serverPort,
    //       path: '/health',
    //       method: 'GET',
    //       timeout: 5000
    //     },
    //     res => {
    //       let data = ''
    //       res.on('data', chunk => {
    //         data += chunk
    //       })
    //       res.on('end', () => {
    //         // log(`Server health check successful: ${data}`)
    //       })
    //     }
    //   )

    //   healthCheckReq.on('error', error => {
    //     log(`Server health check failed: ${error.message}`)
    //     // Try to restart the server if it's not responding
    //     if (serverReady) {
    //       serverReady = false
    //       mainWindow.webContents.send('server-status', {
    //         status: 'restarting',
    //         message: `Restarting server: ${error.message}`
    //       })

    //       // Attempt to gracefully shutdown
    //       serverProcess.kill()

    //       // Wait a moment then restart
    //       setTimeout(() => {
    //         startServer(mainWindow)
    //       }, 3000)
    //     }
    //   })

    //   healthCheckReq.on('timeout', () => {
    //     log('Server health check timed out')
    //     healthCheckReq.destroy()
    //   })

    //   healthCheckReq.end()
    // }

    // Check server health every 30 seconds
    // const healthCheckInterval = setInterval(checkServerHealth, 30000)

    // Return both the server port and process
    return { serverPort, serverProcess }
  } catch (err) {
    log(`ERROR: Failed to start server process: ${err.message}`)
    mainWindow.webContents.send('server-status', {
      status: 'error',
      message: `Failed to start server process: ${err.message}`
    })
    return null
  }
}

;(async () => {
  await app.whenReady()

  // Add application menus
  const { Menu } = require('electron')
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Select Directory',
          accelerator: 'CmdOrCtrl+O',
          click: (menuItem, browserWindow) => {
            if (browserWindow) {
              ;(browserWindow as BrowserWindow).webContents.send(
                'menu-select-directory'
              )
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for Updates',
          click: async (menuItem, browserWindow) => {
            if (browserWindow && mainWindowRef) {
              // Trigger update check and show notification to user
              if (isProd) {
                try {
                  const updateResult = await autoUpdater.checkForUpdates()

                  // Check if an update was found
                  if (
                    updateResult &&
                    updateResult.updateInfo &&
                    updateResult.updateInfo.version !== app.getVersion()
                  ) {
                    dialog.showMessageBox(mainWindowRef, {
                      type: 'info',
                      title: 'Update Available',
                      message: `A new version (v${updateResult.updateInfo.version}) is available!`,
                      detail:
                        'The update will download automatically and install on next restart.',
                      buttons: ['OK']
                    })
                  } else {
                    dialog.showMessageBox(mainWindowRef, {
                      type: 'info',
                      title: 'No Updates Available',
                      message: `You are running the latest version (v${app.getVersion()}).`,
                      buttons: ['OK']
                    })
                  }
                } catch (error) {
                  let errorMessage = `Failed to check for updates: ${error.message}`

                  // Check if it's a 404 error (likely private repository)
                  if (error.message && error.message.includes('404')) {
                    errorMessage =
                      'Repository access error (404). Make sure your GitHub repository is public for auto-updates to work.\n\nError: ' +
                      error.message
                  }

                  dialog.showMessageBox(mainWindowRef, {
                    type: 'error',
                    title: 'Update Check Failed',
                    message: errorMessage,
                    buttons: ['OK']
                  })
                }
              } else {
                dialog.showMessageBox(mainWindowRef, {
                  type: 'info',
                  title: 'Development Mode',
                  message: 'Updates are only available in production builds.',
                  buttons: ['OK']
                })
              }
            }
          }
        },
        {
          label: 'About',
          click: () => {
            if (mainWindowRef) {
              dialog.showMessageBox(mainWindowRef, {
                type: 'info',
                title: 'About Bills Utility',
                message: `Bills Utility v${app.getVersion()}\n\nA utility application for managing bills and documents.\n\nDeveloped by DeCicco & Sons`,
                buttons: ['OK']
              })
            }
          }
        }
      ]
    },
    {
      label: 'Debug',
      submenu: [
        {
          label: 'Show Logs',
          click: () => {
            const logsPath = app.getPath('userData')
            dialog.showMessageBox({
              type: 'info',
              title: 'Logs Location',
              message: `Logs are stored at: ${logsPath}`,
              buttons: ['OK']
            })
          }
        },
        {
          label: 'Check Server Status',
          click: (menuItem, browserWindow) => {
            if (browserWindow) {
              ;(browserWindow as BrowserWindow).webContents.send(
                'request-server-status'
              )
            }
          }
        },
        {
          label: 'Open DevTools',
          accelerator: 'F12',
          click: (menuItem, browserWindow) => {
            if (browserWindow) {
              ;(browserWindow as BrowserWindow).webContents.openDevTools()
            }
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // Create and show splash window first
  createSplashWindow()

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  // Set up the app icon
  const iconPath = path.join(__dirname, '..', 'resources', 'icon.png')
  const mainWindow = createWindow('main', {
    width: width,
    height: height,
    show: false, // Don't show main window immediately
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Store reference to main window for auto-updater
  mainWindowRef = mainWindow

  // Show developer tools in development mode
  if (!isProd) {
    mainWindow.webContents.openDevTools()
  }

  // Set up auto-updater events
  setupAutoUpdaterEvents()

  // Add a global error handler
  process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error)

    const logPath = path.join(app.getPath('userData'), 'uncaught-errors.log')
    fs.appendFileSync(
      logPath,
      `${new Date().toISOString()} - ${error.stack || error}\n`
    )

    dialog.showErrorBox(
      'An error occurred',
      `An unexpected error occurred: ${error.message}\nCheck the logs at: ${logPath}`
    )
  })

  // Function to hide splash and show main window
  const showMainWindow = () => {
    console.log('Showing main window and hiding splash...')
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close()
      splashWindow = null
    }
    mainWindow.show()

    // Focus the main window
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.focus()
  }

  // Register all IPC handlers BEFORE starting the app sequence
  // Handle directory selection
  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })

    if (result.canceled) {
      return null
    }

    return result.filePaths[0]
  })

  // Handle getting server status
  ipcMain.handle('get-server-status', () => {
    return { isRunning: true }
  })

  // Handle getting default directory
  ipcMain.handle('get-default-directory', () => {
    return getSettings().defaultDirectory
  })

  // Handle setting default directory
  ipcMain.handle('set-default-directory', (_, directory) => {
    return updateSetting('defaultDirectory', directory)
  })

  // Handle getting server port
  ipcMain.handle('get-server-port', () => {
    return getSettings().serverPort
  })

  // Handle getting vendors
  ipcMain.handle('get-vendors', async () => {
    return await fetchVendors()
  })

  ipcMain.handle(
    'get-existing-directory',
    async (_, storeId: StoreId, type: TabType, date: Date) => {
      return getExistingDirectory(storeId, type, date)
    }
  )

  ipcMain.handle(
    'get-existing-directories',
    async (_, storeId: StoreId, date: Date) => {
      const result = getExistingDirectories(storeId, date)
      console.log('get-existing-directories')
      console.log(result)
      return result
    }
  )

  // Auto-updater IPC handlers
  ipcMain.handle('check-for-updates', async () => {
    if (!isProd) {
      return { message: 'Updates are only available in production' }
    }
    try {
      const result = await autoUpdater.checkForUpdatesAndNotify()
      return { success: true, result }
    } catch (error) {
      console.error('Error checking for updates:', error)

      // Provide specific error message for 404 errors
      let errorMessage = error.message
      if (error.message && error.message.includes('404')) {
        errorMessage =
          'Repository access error (404). Make sure your GitHub repository is public for auto-updates to work.'
      }

      return { success: false, error: errorMessage }
    }
  })

  ipcMain.handle('download-update', async () => {
    if (!isProd) {
      return { message: 'Updates are only available in production' }
    }
    try {
      await autoUpdater.downloadUpdate()
      return { success: true }
    } catch (error) {
      console.error('Error downloading update:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('install-update', () => {
    if (!isProd) {
      return { message: 'Updates are only available in production' }
    }
    try {
      autoUpdater.quitAndInstall()
      return { success: true }
    } catch (error) {
      console.error('Error installing update:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  // Start the enhanced startup sequence
  try {
    const startupResult = await performStartupSequence(mainWindow)

    // If startup sequence returned early (due to update), don't show main window
    if (startupResult === null) {
      console.log(
        'Startup sequence exited early - likely due to update restart'
      )
      return
    }

    // Wait for main window to be ready
    await new Promise<void>(resolve => {
      if (mainWindow.webContents.isLoading()) {
        mainWindow.webContents.once('did-finish-load', () => resolve())
      } else {
        resolve()
      }
    })

    showMainWindow()
  } catch (error) {
    console.error('Error during startup sequence:', error)
    updateSplashStatus('Error occurred, starting anyway...', 100)
    await new Promise(resolve => setTimeout(resolve, 1000))
    showMainWindow()
  }

  // Create settings file if it doesn't exist
  ensureSettingsFile()

  // Function to terminate server processes
  function terminateServerProcesses() {
    console.log(`Terminating ${serverProcesses.length} server processes`)

    for (const proc of serverProcesses) {
      if (proc && !proc.killed) {
        try {
          if (process.platform === 'win32') {
            // On Windows, we need to use taskkill to ensure child processes are terminated
            const { execSync } = require('child_process')
            try {
              execSync(`taskkill /pid ${proc.pid} /T /F`)
              console.log(
                `Successfully terminated server process ${proc.pid} and its children`
              )
            } catch (err) {
              console.error(`Error using taskkill: ${err.message}`)
              // Fall back to regular kill
              proc.kill('SIGTERM')
            }
          } else {
            // On Unix systems, send SIGTERM for graceful shutdown
            proc.kill('SIGTERM')
          }

          proc.removeAllListeners()
        } catch (err) {
          console.error(`Error terminating server process: ${err.message}`)
        }
      }
    }

    // Clear the array
    serverProcesses = []
  }

  // Handle additional termination scenarios
  app.on('before-quit', terminateServerProcesses)
  app.on('will-quit', terminateServerProcesses)

  // Handle unexpected termination
  process.on('SIGINT', () => {
    terminateServerProcesses()
    app.quit()
  })

  process.on('SIGTERM', () => {
    terminateServerProcesses()
    app.quit()
  })
})()

app.on('window-all-closed', () => {
  // Clean up splash window if it still exists
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close()
    splashWindow = null
  }
  app.quit()
})
