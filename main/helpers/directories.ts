type StoreId =
  | '4179'
  | '4180'
  | '4181'
  | '4182'
  | '4183'
  | '4184'
  | '4185'
  | '4186'
  | '4187'
  | '4188'
  | '4189'

export const storeNameMap: Record<StoreId, string> = {
  '4179': 'Pelham',
  '4180': 'Ardsley',
  '4181': 'Brewster',
  '4182': 'Harrison',
  '4183': 'Armonk',
  '4184': 'Larchmont',
  '4185': 'Millwood',
  '4186': 'Somers',
  '4187': 'Eastchester',
  '4188': 'Bedford',
  '4189': 'Sleepy Hollow'
}

const defaultScansPathTemplates = [
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\Scans',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\Scanner',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Bills\\Scans',
  'Z:\\{storeInfo}\\{storeName} Bills\\Scans',
  'Z:\\{storeInfo}\\{storeName} Bills\\Scanner',
  'Z:\\{storeInfo}\\Bills\\Scans'
]

const defaultBillsPathTemplates = [
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\{year}\\{month} - {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\{year}\\{month}- {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\{year}\\{month}-{monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Bills\\{year}\\{month} - {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Bills\\{year}\\{month}- {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Bills\\{year}\\{month}-{monthName}\\{day}',
  'Z:\\{storeInfo}\\{storeName} Bills\\{year}\\{month} - {monthName}\\{day}',
  'Z:\\{storeInfo}\\{storeName} Bills\\{year}\\{month}- {monthName}\\{day}',
  'Z:\\{storeInfo}\\{storeName} Bills\\{year}\\{month}-{monthName}\\{day}',
  'Z:\\{storeInfo}\\Bills\\{year}\\{month} - {monthName}\\{day}',
  'Z:\\{storeInfo}\\Bills\\{year}\\{month}- {monthName}\\{day}'
]

const defaultNonInvoicePathTemplates = [
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\Non Invoice Docs\\{year}\\{month} - {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\Non Invoice Docs\\{year}\\{month}- {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Bills\\Non Invoice Docs\\{year}\\{month} - {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Bills\\Non Invoice Docs\\{year}\\{month}- {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Bills\\Non Invoice Docs\\{year}\\{month}-{monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\Non Invoice Docs\\{year}\\{month}-{monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Non Invoice\\{month}-{monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Non Invoice\\{month} - {monthName}\\{day}',
  '\\\\10.1.10.20\\Files\\{storeInfo}\\Non Invoice\\{month}- {monthName}\\{day}',
  'Z:\\{storeInfo}\\{storeName} Bills\\Non Invoice Docs\\{year}\\{month} - {monthName}\\{day}',
  'Z:\\{storeInfo}\\{storeName} Bills\\Non Invoice Docs\\{year}\\{month}- {monthName}\\{day}',
  'Z:\\{storeInfo}\\Bills\\Non Invoice Docs\\{year}\\{month} - {monthName}\\{day}',
  'Z:\\{storeInfo}\\Bills\\Non Invoice Docs\\{year}\\{month}- {monthName}\\{day}',
  'Z:\\{storeInfo}\\{storeName} Bills\\Non Invoice Docs\\{year}\\{month}-{monthName}\\{day}',
  'Z:\\{storeInfo}\\Non Invoice\\{month}-{monthName}\\{day}',
  'Z:\\{storeInfo}\\Non Invoice\\{month} - {monthName}\\{day}',
  'Z:\\{storeInfo}\\Non Invoice\\{month}- {monthName}\\{day}'
]

const defaultBillsPathTemplate =
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\{year}\\{month} - {monthName}\\{day}'
const defaultScansPathTemplate =
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\Scans'
const defaultNonInvoicePathTemplate =
  '\\\\10.1.10.20\\Files\\{storeInfo}\\{storeName} Bills\\Non Invoice Docs\\{year}\\{month} - {monthName}\\{day}'

export function getBillsDirectory(storeId: StoreId, date: Date) {
  const year = date.getFullYear()
  // if month is signle digit, add a 0 in front of it
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthName = date.toLocaleString('default', { month: 'long' })
  // store id without the first character in the id
  const storeInfo = `${storeId.slice(1)} ${storeNameMap[storeId]}`
  return defaultBillsPathTemplate
    .replace('{storeInfo}', storeInfo)
    .replace('{storeName}', storeNameMap[storeId])
    .replace('{year}', year.toString())
    .replace('{month}', month.toString().padStart(2, '0'))
    .replace('{monthName}', monthName)
    .replace('{day}', day.toString())
}

export function getScansDirectory(storeId: StoreId) {
  // store id without the first character in the id
  const storeInfo = `${storeId.slice(1)} ${storeNameMap[storeId]}`
  return defaultScansPathTemplate
    .replace('{storeInfo}', storeInfo)
    .replace('{storeName}', storeNameMap[storeId])
}

export function getNonInvoiceDirectory(storeId: StoreId, date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthName = date.toLocaleString('default', { month: 'long' })
  const storeInfo = `${storeId.slice(1)} ${storeNameMap[storeId]}`
  return defaultNonInvoicePathTemplate
    .replace('{storeInfo}', storeInfo)
    .replace('{storeName}', storeNameMap[storeId])
    .replace('{year}', year.toString())
    .replace('{month}', month.toString().padStart(2, '0'))
    .replace('{monthName}', monthName)
    .replace('{day}', day.toString())
}

export function getScansDirectorCandidates(storeId: StoreId) {
  // store id without the first character in the id
  const storeInfo = `${storeId.slice(1)} ${storeNameMap[storeId]}`
  return defaultScansPathTemplates.map(template =>
    template
      .replace('{storeInfo}', storeInfo)
      .replace('{storeName}', storeNameMap[storeId])
  )
}

export function getBillsDirectorCandidates(storeId: StoreId, date: Date) {
  const year = date.getFullYear()
  // if month is signle digit, add a 0 in front of it
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthName = date.toLocaleString('default', { month: 'long' })
  // store id without the first character in the id
  const storeInfo = `${storeId.slice(1)} ${storeNameMap[storeId]}`
  return defaultBillsPathTemplates.map(template =>
    template
      .replace('{storeInfo}', storeInfo)
      .replace('{storeName}', storeNameMap[storeId])
      .replace('{year}', year.toString())
      .replace('{month}', month.toString().padStart(2, '0'))
      .replace('{monthName}', monthName)
      .replace('{day}', day.toString())
  )
}

export function getNonInvoiceDirectorCandidates(storeId: StoreId, date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthName = date.toLocaleString('default', { month: 'long' })
  const storeInfo = `${storeId.slice(1)} ${storeNameMap[storeId]}`
  return defaultNonInvoicePathTemplates.map(template =>
    template
      .replace('{storeInfo}', storeInfo)
      .replace('{storeName}', storeNameMap[storeId])
      .replace('{year}', year.toString())
      .replace('{month}', month.toString().padStart(2, '0'))
      .replace('{monthName}', monthName)
      .replace('{day}', day.toString())
  )
}
