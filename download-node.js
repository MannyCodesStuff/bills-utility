const https = require('https')
const fs = require('fs')
const path = require('path')
const extract = require('extract-zip')

// Create directories if they don't exist
const nodeDir = path.join(__dirname, 'resources', 'node')
if (!fs.existsSync(nodeDir)) {
  fs.mkdirSync(nodeDir, { recursive: true })
}

// Node.js version to download
const version = '18.17.1'
const nodeUrl = `https://nodejs.org/dist/v${version}/node-v${version}-win-x64.zip`
const zipPath = path.join(nodeDir, 'node.zip')

console.log(`Downloading Node.js v${version}...`)

// Download Node.js
const file = fs.createWriteStream(zipPath)
https
  .get(nodeUrl, function (response) {
    response.pipe(file)
    file.on('finish', function () {
      file.close(() => {
        console.log('Download completed, extracting...')
        extractNodeJs()
      })
    })
  })
  .on('error', err => {
    fs.unlink(zipPath, () => {})
    console.error(`Error downloading Node.js: ${err.message}`)
  })

// Extract Node.js and copy node.exe to resources/node
async function extractNodeJs() {
  try {
    await extract(zipPath, { dir: nodeDir })

    // Copy node.exe to resources/node
    const nodeBinPath = path.join(
      nodeDir,
      `node-v${version}-win-x64`,
      'node.exe'
    )
    const nodeDestPath = path.join(nodeDir, 'node.exe')

    fs.copyFileSync(nodeBinPath, nodeDestPath)
    console.log(`Node.js executable copied to ${nodeDestPath}`)

    // Clean up
    fs.unlinkSync(zipPath)
    fs.rmSync(path.join(nodeDir, `node-v${version}-win-x64`), {
      recursive: true,
      force: true
    })

    console.log('Node.js setup completed successfully')
  } catch (err) {
    console.error(`Error extracting Node.js: ${err.message}`)
  }
}
