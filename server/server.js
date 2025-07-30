// Import path first so we can use it for dotenv config
const path = require('path')

// Load environment variables with explicit path
require('dotenv').config({ path: path.join(__dirname, '.env') })

const express = require('express')
const fs = require('fs')
const cors = require('cors')
const net = require('net')
const axios = require('axios')
const mssql = require('mssql')
let PORT = 5000

// Debug: Log environment variables (remove this after debugging)
console.log('Environment variables loaded:')
console.log('DB_USER:', process.env.DB_USER ? '***SET***' : 'NOT SET')
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***SET***' : 'NOT SET')
console.log('DB_SERVER:', process.env.DB_SERVER ? '***SET***' : 'NOT SET')
console.log('DB_NAME:', process.env.DB_NAME ? '***SET***' : 'NOT SET')
console.log('Current working directory:', process.cwd())
console.log('Script directory (__dirname):', __dirname)

if (
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_SERVER ||
  !process.env.DB_NAME
) {
  console.error('Missing environment variables. Please check your .env file.')
  console.error('Expected .env file location:', path.join(__dirname, '.env'))
  throw new Error('Missing one or more required environment variables')
}

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    },
    requestTimeout: 120000 // Timeout for queries (e.g., 90 seconds)
  },
  pool: {
    max: 300, // Allow up to 100 connections
    min: 1, // Always keep at least 1 connections ready
    idleTimeoutMillis: 30000, // Close unused connections after 30s
    acquireTimeoutMillis: 30000 // Wait up to 30s to get a free connection
  },
  requestTimeout: 120000
}

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer()

    server.once('error', () => {
      resolve(false)
    })

    server.once('listening', () => {
      server.close()
      resolve(true)
    })

    server.listen(port, '127.0.0.1')
  })
}

// Find an available port starting from the default
async function findAvailablePort(startPort) {
  let port = startPort
  while (!(await isPortAvailable(port))) {
    console.log(`Port ${port} is not available, trying next port...`)
    port++
    if (port > startPort + 100) {
      throw new Error('Could not find an available port after 100 attempts')
    }
  }
  return port
}

// Setup logging
function setupLogging() {
  const logDir = path.join(__dirname, 'logs')

  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir)
    } catch (err) {
      console.error(`Failed to create logs directory: ${err.message}`)
      // Continue without file logging if we can't create the directory
    }
  }

  // Create log file streams if the directory exists
  if (fs.existsSync(logDir)) {
    const logFile = path.join(
      logDir,
      `server-${new Date().toISOString().split('T')[0]}.log`
    )

    // Create a write stream for the log file
    const logStream = fs.createWriteStream(logFile, { flags: 'a' })

    // Redirect console.log
    const originalConsoleLog = console.log
    console.log = function () {
      const args = Array.from(arguments)
      const timestamp = new Date().toISOString()
      const logMessage = `${timestamp} - ${args.join(' ')}`

      // Write to console
      originalConsoleLog.apply(console, [logMessage])

      // Write to file
      logStream.write(logMessage + '\n')
    }

    // Redirect console.error
    const originalConsoleError = console.error
    console.error = function () {
      const args = Array.from(arguments)
      const timestamp = new Date().toISOString()
      const logMessage = `${timestamp} - ERROR - ${args.join(' ')}`

      // Write to console
      originalConsoleError.apply(console, [logMessage])

      // Write to file
      logStream.write(logMessage + '\n')
    }
  }
}

// const config = {
//   tenantId: '',
//   clientId: '',
//   clientSecret: '',
//   siteName: '',
//   siteDomain: '',
//   libraryName: ''
// }
const config = {
  tenantId: process.env.SHAREPOINT_TENANT_ID,
  clientId: process.env.SHAREPOINT_CLIENT_ID,
  clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
  siteName: process.env.SHAREPOINT_SITE_NAME,
  siteDomain: process.env.SHAREPOINT_SITE_DOMAIN,
  libraryName: 'Documents'
}

// Get Microsoft Graph access token
async function getAccessToken() {
  try {
    const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: 'https://graph.microsoft.com/.default'
    })

    console.log('Requesting access token from Microsoft...')
    const response = await axios.post(url, params)
    console.log('Access token received successfully')
    return response.data.access_token
  } catch (error) {
    console.error(
      'Error getting access token:',
      error.response?.data || error.message
    )
    throw new Error(`Authentication failed: ${error.message}`)
  }
}

// Upload file to SharePoint
async function uploadToSharePoint(localFilePath) {
  try {
    console.log('Getting access token...')
    const accessToken = await getAccessToken()

    const fileName = path.basename(localFilePath)
    console.log(`Uploading file: ${fileName}`)

    // Read file as buffer
    const fileBuffer = fs.readFileSync(localFilePath)
    console.log(`File size: ${fileBuffer.length} bytes`)

    // Step 1: Get site ID
    console.log(`Getting site ID for ${config.siteName}...`)
    const siteRes = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${config.siteDomain}:/sites/${config.siteName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }
    )

    if (!siteRes.data || !siteRes.data.id) {
      throw new Error('Could not retrieve site ID')
    }

    const siteId = siteRes.data.id
    console.log(`Site ID: ${siteId}`)

    // Step 2: Get the drive ID
    console.log(
      `Getting drive ID for document library "${config.libraryName}"...`
    )
    const drivesRes = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }
    )

    if (
      !drivesRes.data ||
      !drivesRes.data.value ||
      !drivesRes.data.value.length
    ) {
      throw new Error('No drives found for this site')
    }

    // Find the drive with the name matching libraryName
    const drive = drivesRes.data.value.find(d => d.name === config.libraryName)
    if (!drive) {
      console.log(
        'Available drives:',
        drivesRes.data.value.map(d => d.name).join(', ')
      )
      throw new Error(`Drive "${config.libraryName}" not found`)
    }

    const driveId = drive.id
    console.log(`Drive ID: ${driveId}`)

    // Step 3: Upload to document library
    console.log('Uploading file to SharePoint...')
    const uploadRes = await axios.put(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${fileName}:/content`,
      fileBuffer,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/pdf'
        }
      }
    )

    console.log('File uploaded successfully')

    // Simply return the webUrl from the upload response
    // No need to set individual permissions when library permissions are configured
    return uploadRes.data.webUrl
  } catch (error) {
    console.error(
      'Upload error details:',
      error.response?.data || error.message
    )
    if (error.response) {
      console.error('Error status:', error.response.status)
      console.error('Error headers:', error.response.headers)
      console.error('Error data:', JSON.stringify(error.response.data, null, 2))
    }
    throw error
  }
}

// Main async function to start server
async function startServer() {
  setupLogging()

  // Find an available port
  try {
    PORT = await findAvailablePort(PORT)
    console.log(`Using port: ${PORT}`)
  } catch (err) {
    console.error(`Failed to find available port: ${err.message}`)
    process.exit(1)
  }

  const app = express()

  // CORS middleware must be before other middleware and route handlers
  // Update CORS configuration to allow Electron app:// protocol
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Electron 'file://' protocol)
        if (!origin) {
          return callback(null, true)
        }

        // Allow localhost and Electron's app:// protocol
        if (/localhost|127\.0\.0\.1|^app:\/\/\./.test(origin)) {
          return callback(null, true)
        }

        callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  // Pre-flight OPTIONS response for CORS
  app.options('*', cors())

  // Middleware to parse JSON body
  app.use(express.json())

  // Log requests
  app.use((req, res, next) => {
    console.log(
      `${req.method} ${req.url} - Origin: ${req.headers.origin || 'No origin'}`
    )
    next()
  })

  // Security: Only allow local connections
  const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running at http://localhost:${PORT}`)
    console.log(`Server started at: ${new Date().toISOString()}`)

    // We'll rely on stdout parsing in the parent process instead of IPC
  })

  // Map to store dynamic static directories
  // const servedDirectories = new Set()

  // API to get PDF files in a directory
  // app.post('/list-pdfs', (req, res) => {
  //   const { directory } = req.body
  //   console.log('Listing PDFs for directory:', directory)

  //   if (!directory) {
  //     console.log('Error: No directory provided')
  //     return res.status(400).json({
  //       error: 'Directory path is required',
  //       message: 'Directory path is required',
  //       folderExists: false
  //     })
  //   }

  //   const absoluteDirectory = path.resolve(directory)

  //   // Check if the directory exists
  //   if (
  //     !fs.existsSync(absoluteDirectory) ||
  //     !fs.lstatSync(absoluteDirectory).isDirectory()
  //   ) {
  //     console.log(`Error: Invalid directory path - ${absoluteDirectory}`)
  //     return res.status(400).json({
  //       error: 'Invalid directory path',
  //       message: 'Invalid directory path',
  //       folderExists: false
  //     })
  //   }

  //   // Read PDF files
  //   fs.readdir(absoluteDirectory, (err, files) => {
  //     if (err) {
  //       console.log(`Error reading directory: ${err.message}`)
  //       return res.status(500).json({
  //         error: 'Unable to read directory',
  //         message: 'Unable to read directory',
  //         folderExists: false
  //       })
  //     }

  //     const pdfFiles = files.filter(
  //       file => file.toLowerCase().endsWith('.pdf') && !file.startsWith('~$')
  //     )

  //     // Remove old static routes for this directory if they exist
  //     if (servedDirectories.has(absoluteDirectory)) {
  //       console.log(`Directory already served: ${absoluteDirectory}`)
  //     } else {
  //       // Serve the directory if not already
  //       const encodedPath = encodeURIComponent(absoluteDirectory)
  //       app.use(`/static/${encodedPath}`, express.static(absoluteDirectory))
  //       servedDirectories.add(absoluteDirectory)
  //       console.log(
  //         `Now serving directory: ${absoluteDirectory} at /static/${encodedPath}`
  //       )
  //     }

  //     const result = pdfFiles.map(file => {
  //       const originalPath = path.join(absoluteDirectory, file)
  //       const httpPath = `http://localhost:${PORT}/static/${encodeURIComponent(absoluteDirectory)}/${encodeURIComponent(file)}`

  //       return { originalPath, httpPath }
  //     })

  //     console.log('Result:', result)

  //     res.json({ data: result, folderExists: true })
  //   })
  // })

  const allowedDuplicateTypes = [
    'deposit-slip',
    'coversheets',
    'delivery-pick-tickets',
    'paid-out-receipts',
    'house-charge',
    'toast',
    'credit-memo',
    'inter-store-transfer'
  ]

  // Utility function to get a unique file path
  function getUniqueFilePath(basePath, ext) {
    const dir = path.dirname(basePath)
    const fileBase = path.basename(basePath)

    const filesInDir = fs.readdirSync(dir)
    let maxDuplicate = 1 // Start counting from 1 so we can return (2)

    const regex = new RegExp(
      `^${fileBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\((\\d+)\\))?${ext.replace('.', '\\.')}$`
    )

    for (const file of filesInDir) {
      const match = file.match(regex)
      if (match && match[2]) {
        const num = parseInt(match[2])
        if (num > maxDuplicate) {
          maxDuplicate = num
        }
      }
    }

    const nextNumber = maxDuplicate + 1
    const newPath = path.join(dir, `${fileBase}(${nextNumber})${ext}`)

    return newPath
  }

  app.post('/move-file-to-zdrive', (req, res) => {
    const { filePath, directoryPath, documentType } = req.body

    if (!filePath || !directoryPath) {
      console.log('Error: Missing required parameters for move')
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Missing required parameters'
      })
    }

    console.log(`Moving file: ${filePath} to directory: ${directoryPath}`)

    // Validate that the file exists
    if (!fs.existsSync(filePath)) {
      console.log(`Error: File does not exist - ${filePath}`)
      return res.status(400).json({
        error: 'File does not exist',
        message: 'File does not exist'
      })
    }

    // Validate that the directory exists
    if (!fs.existsSync(directoryPath)) {
      console.log(`Error: Directory does not exist - ${directoryPath}`)
      return res.status(400).json({
        error: 'Directory does not exist',
        message: 'Directory does not exist'
      })
    }

    try {
      // Extract the filename from the source path
      const fileName = path.basename(filePath)
      const ext = path.extname(fileName)
      const baseName = path.basename(fileName, ext)

      // Construct the destination path
      let destinationPath = path.join(directoryPath, fileName)

      if (fs.existsSync(destinationPath)) {
        if (allowedDuplicateTypes.includes(documentType)) {
          const basePath = path.join(directoryPath, baseName)
          destinationPath = getUniqueFilePath(basePath, ext)
        } else {
          console.log(
            `Error: File already exists at destination - ${destinationPath}`
          )
          return res.status(400).json({
            error: 'File already exists',
            message:
              'A file with the same name already exists in the destination directory'
          })
        }
      }

      // Move the file using fs.rename (works for both rename and move operations)
      fs.renameSync(filePath, destinationPath)

      // Return success response with the new file path
      res.json({
        success: true,
        message: 'File moved successfully',
        originalPath: filePath,
        newPath: destinationPath,
        fileName: path.basename(destinationPath)
      })
    } catch (error) {
      console.error('Error moving file:', error)
      res.status(500).json({
        error: 'Failed to move file',
        message: error.message
      })
    }
  })

  // API to rename invoice PDF files
  app.post('/rename-document', async (req, res) => {
    const {
      filePath,
      newFileName,
      documentType,
      vendorId,
      invoiceNumber,
      invoiceDate
    } = req.body

    if (!filePath || !newFileName) {
      console.log('Error: Missing required parameters for rename')
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Missing required parameters'
      })
    }

    if (documentType === 'invoice') {
      if (!vendorId || !invoiceNumber || !invoiceDate) {
        console.log('Error: Missing required parameters for invoice')
        return res.status(400).json({
          error: 'Missing required parameters',
          message:
            'Vendor ID, invoice number, and invoice date are required for invoice documents'
        })
      }
    }

    // Validate that the file exists and is a PDF
    if (!fs.existsSync(filePath) || !filePath.toLowerCase().endsWith('.pdf')) {
      console.log(`Error: Invalid PDF file path - ${filePath}`)
      return res.status(400).json({
        error: 'Invalid PDF file path',
        message: 'Invalid PDF file path'
      })
    }

    const directory = path.dirname(filePath)
    const ext = path.extname(newFileName)
    const baseName = path.basename(newFileName, ext)
    let newFilePath = path.join(directory, newFileName)

    // apply duplicate naming logic if allowed
    if (fs.existsSync(newFilePath)) {
      if (allowedDuplicateTypes.includes(documentType)) {
        const basePath = path.join(directory, baseName)
        newFilePath = getUniqueFilePath(basePath, ext)
      } else {
        return res.status(400).json({
          error: 'File already exists',
          message: `File already exists with name ${newFileName}`
        })
      }
    }

    // Check if the invoice already exists in the database
    if (documentType === 'invoice') {
      const ifExists = await findInvoiceInDatabase(
        vendorId,
        invoiceNumber,
        invoiceDate
      )
      // if the invoice already exists, return an error
      if (ifExists.ifExists) {
        return res.status(400).json({
          error: 'Invoice already exists',
          message: ifExists.message
        })
      }
      // there was an error finding the invoice in the database
      if (ifExists.success === false) {
        return res.status(500).json({
          error: 'Error finding invoice in database',
          message: ifExists.message
        })
      }
    }

    try {
      fs.renameSync(filePath, newFilePath)

      // Return the new file path
      const httpPath = `http://localhost:${PORT}/static/${encodeURIComponent(directory)}/${encodeURIComponent(newFileName)}`

      res.json({
        success: true,
        originalPath: filePath,
        newPath: newFilePath,
        httpPath
      })
    } catch (err) {
      console.log(`Error renaming file: ${err.message}`)
      res.status(500).json({
        error: 'Failed to rename file',
        message: err.message
      })
    }
  })

  app.delete('/delete-file', (req, res) => {
    const { filePath } = req.body

    if (!filePath) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'filePath is required'
      })
    }

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        error: 'File does not exist',
        message: 'File does not exist'
      })
    }

    const resolvedPath = path.resolve(filePath)

    fs.unlink(resolvedPath, err => {
      if (err) {
        console.error('Error deleting file:', err)
        return res
          .status(500)
          .json({ error: 'Failed to delete file', message: err.message })
      }
      res.status(200).json({
        message: 'File deleted successfully',
        path: resolvedPath
      })
    })
  })

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', port: PORT })
  })

  async function findInvoiceInDatabase(vendorId, invoiceNumber, invoiceDate) {
    try {
      const pool = await mssql.connect(dbConfig)

      // make sql query to see if the file already exists in the database
      const result = await pool
        .request()
        .input('vendor_id', mssql.VarChar(14), vendorId)
        .input('invoice_number', mssql.VarChar(50), invoiceNumber)
        .input('invoice_date', mssql.Date, invoiceDate)
        .query(
          'SELECT * FROM LOCDATAMART.dbo.SHAREPOINT_INVOICES WHERE vendor_id = @vendor_id AND invoice_number = @invoice_number AND invoice_date = @invoice_date'
        )

      if (result.recordset.length > 0) {
        console.log('File already exists in the database')
        return {
          success: false,
          ifExists: true,
          message: `Invoice already exists with vendor id ${vendorId} and invoice number ${invoiceNumber} and invoice date ${invoiceDate}`
        }
      }
      return {
        success: true,
        ifExists: false,
        message: 'Invoice not found in database'
      }
    } catch (error) {
      console.error('Error finding invoice in database:', error)
      return {
        success: false,
        ifExists: false,
        message: 'Error finding invoice in database'
      }
    }
  }

  async function insertInvoiceToDatabase(
    vendorId,
    invoiceNumber,
    invoiceDate,
    fileUrl,
    originalPath,
    store,
    invoiceTotal
  ) {
    try {
      const pool = await mssql.connect(dbConfig)
      const result = await pool
        .request()
        .input('vendor_id', mssql.VarChar(14), vendorId)
        .input('invoice_number', mssql.VarChar(50), invoiceNumber)
        .input('invoice_date', mssql.Date, invoiceDate)
        .input('sharepoint_url', mssql.VarChar(255), fileUrl)
        .input('original_path', mssql.VarChar(500), originalPath)
        .input('store', mssql.VarChar(4), store)
        .input('invoice_total', mssql.Money, invoiceTotal)
        .query(
          'INSERT INTO LOCDATAMART.dbo.SHAREPOINT_INVOICES (vendor_id, invoice_number, invoice_date, sharepoint_url, original_path, uploaded, store, invoice_total) VALUES (@vendor_id, @invoice_number, @invoice_date, @sharepoint_url, @original_path, 0, @store, @invoice_total)'
        )

      return { sucess: true, message: 'Invoice inserted into database' }
    } catch (error) {
      console.error('Error inserting invoice to database:', error)
      console.log('Parameters:', {
        vendorId,
        invoiceNumber,
        invoiceDate,
        fileUrl,
        originalPath
      })
      return { success: false, message: 'Error inserting invoice to database' }
    }
  }

  // API to upload PDF to SharePoint
  app.post('/upload-pdf', async (req, res) => {
    const {
      filePath,
      vendorId,
      invoiceNumber,
      invoiceDate,
      documentType,
      store,
      invoiceTotal
    } = req.body

    // Validate file path
    if (!documentType) {
      console.log('Error: No document type provided')
      return res.status(400).json({
        error: 'Document type is required',
        message: 'Document type is required'
      })
    }

    if (documentType === 'invoice') {
      if (
        !filePath ||
        !vendorId ||
        !invoiceNumber ||
        !invoiceDate ||
        !store ||
        !invoiceTotal
      ) {
        console.log('Error: No file path or required parameters provided')
        const missingParams = []
        if (!filePath) missingParams.push('filePath')
        if (!vendorId) missingParams.push('vendorId')
        if (!invoiceNumber) missingParams.push('invoiceNumber')
        if (!invoiceDate) missingParams.push('invoiceDate')
        if (!store) missingParams.push('store')
        console.log('Missing parameters:', missingParams)
        return res.status(400).json({
          error: 'Missing required parameters for invoice',
          message: `Missing: ${missingParams.join(', ')}`
        })
      }
    } else {
      if (!filePath || !invoiceDate || !store) {
        console.log('Error: No file path or required parameters provided')
        const missingParams = []
        if (!filePath) missingParams.push('filePath')
        if (!invoiceDate) missingParams.push('invoiceDate')
        if (!store) missingParams.push('store')
        console.log('Missing parameters:', missingParams)
        return res.status(400).json({
          error: 'Missing required parameters for invoice',
          message: `Missing: ${missingParams.join(', ')}`
        })
      }
    }

    // Check if file exists and is a PDF
    if (!fs.existsSync(filePath)) {
      console.log(`Error: File not found: ${filePath}`)
      return res.status(400).json({
        error: 'File not found',
        message: 'File not found'
      })
    }

    // Check if file is a PDF
    if (!filePath.toLowerCase().endsWith('.pdf')) {
      console.log(`Error: Not a PDF file: ${filePath}`)
      return res.status(400).json({
        error: 'File must be a PDF',
        message: 'File must be a PDF'
      })
    }

    try {
      // Get file stats for size check
      const stats = fs.statSync(filePath)
      console.log(`File size: ${stats.size} bytes`)

      // Check if file size is reasonable (less than 10MB)
      if (stats.size > 10 * 1024 * 1024) {
        console.log(`Error: File too large: ${stats.size} bytes`)
        return res.status(400).json({
          error: 'File too large (max 10MB)',
          message: 'File too large (max 10MB)'
        })
      }

      const fileUrl = await uploadToSharePoint(filePath)

      // make sql query to insert the file into the database
      const result = await insertInvoiceToDatabase(
        vendorId,
        invoiceNumber,
        invoiceDate,
        fileUrl,
        filePath,
        store,
        invoiceTotal
      )

      if (result.success === false) {
        return res.status(500).json({
          error: 'Error inserting invoice to database',
          message:
            'Uploaded invoice to SharePoint but failed to insert into database'
        })
      }

      return res.json({
        success: true,
        message: 'Upload successful',
        url: fileUrl
      })
    } catch (error) {
      console.error('Upload failed:', error.message)

      // Send appropriate error response based on error type
      if (error.message.includes('Authentication failed')) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: error.message
        })
      } else if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'Resource not found',
          message: error.message
        })
      } else {
        return res.status(500).json({
          error: 'Upload failed',
          message: error.message
        })
      }
    }
  })

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(`Server error: ${err.message}`)
    console.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
  })

  // Handle termination signals for clean shutdown
  async function gracefulShutdown() {
    console.log('Received termination signal, shutting down gracefully...')

    // await closePool()

    // Close the server
    server.close(() => {
      console.log('HTTP server closed')

      // Exit process
      process.exit(0)
    })

    // Force close after timeout
    setTimeout(() => {
      console.error(
        'Could not close connections in time, forcefully shutting down'
      )
      process.exit(1)
    }, 5000)
  }

  // Listen for termination signals
  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)

  // Handle uncaught exceptions
  process.on('uncaughtException', err => {
    console.error('Uncaught exception:', err)
    gracefulShutdown()
  })
}

// Start the server
startServer().catch(err => {
  console.error(`Failed to start server: ${err.message}`)
  process.exit(1)
})
