import mssql from 'mssql'
import { dbConfig } from '../background'
import axios from 'axios'
import path from 'path'
import fs from 'fs'

export async function findInvoiceInDatabase(
  vendorId,
  invoiceNumber,
  invoiceDate
) {
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

export async function insertInvoiceToDatabase(
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
      .input('invoice_total', mssql.Money, invoiceTotal).query(`
          INSERT INTO LOCDATAMART.dbo.SHAREPOINT_INVOICES 
            (vendor_id, invoice_number, invoice_date, sharepoint_url, original_path, uploaded, store, invoice_total, F253) 
          VALUES 
            (@vendor_id, @invoice_number, @invoice_date, @sharepoint_url, @original_path, 0, @store, @invoice_total, GETDATE())
        `)

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

export async function getASNsByVendorId(
  storeId: string,
  vendorId: string,
  date: Date
) {
  try {
    const pool = await mssql.connect(dbConfig)
    const result = await pool
      .request()
      .input('store_id', mssql.VarChar(4), storeId)
      .input('vendor_id', mssql.VarChar(14), vendorId)
      .input('date', mssql.Date, date)
      .query(
        'select * from LOCDATAMART.dbo.RECV_SUMMARY where F1056=@store_id AND F254=@date AND F27=@vendor_id'
      )
    return result.recordset
  } catch (error) {
    console.error('Error getting ASNs by vendor id:', error)
  }
}

const config = {
  tenantId: process.env.SHAREPOINT_TENANT_ID,
  clientId: process.env.SHAREPOINT_CLIENT_ID,
  clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
  siteName: process.env.SHAREPOINT_SITE_NAME,
  siteDomain: process.env.SHAREPOINT_SITE_DOMAIN,
  libraryName: 'Documents'
}
// const config = {
//   tenantId: process.env.SHAREPOINT_TENANT_ID,
//   clientId: process.env.SHAREPOINT_CLIENT_ID,
//   clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
//   siteName: process.env.SHAREPOINT_SITE_NAME,
//   siteDomain: process.env.SHAREPOINT_SITE_DOMAIN,
//   libraryName: 'Documents'
// }

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
export async function uploadToSharePoint(localFilePath: string) {
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
