import { StoreId } from '@/hooks/use-store'
import { TabType } from '@/components/bill-manager'

export interface IpcHandler {
  send: (channel: string, value: unknown) => void
  on: (channel: string, callback: (...args: unknown[]) => void) => () => void
  selectDirectory: () => Promise<string | null>
  getServerStatus: () => Promise<{ isRunning: boolean }>
  getDefaultDirectory: () => Promise<string>
  setDefaultDirectory: (directory: string) => Promise<boolean>
  getServerPort: () => Promise<number>
  getVendors: () => Promise<Array<{ id: string; name: string }>>
  getASNs: (
    storeId: string,
    vendorId: string,
    date: Date
  ) => Promise<
    | {
        success: boolean
        data?: Array<{
          F1056: string
          F91: string
          F27: string
          F254: Date
          F03: number
          F238: string
          Gross: string
          Net: string
        }>
      }
    | {
        success: false
        error: string
      }
  >

  getPdfFiles: (directoryPath: string) => Promise<{
    success: boolean
    files?: Array<{
      name: string
      path: string
      size: number
      modified: Date
      created: Date
    }>
    count?: number
    error?: string
    folderExists?: boolean
  }>
  readPdfFile: (filePath: string) => Promise<{
    success: boolean
    data?: string
    fileName?: string
    size?: number
    error?: string
  }>
  getExistingDirectory: (
    storeId: StoreId,
    type: TabType,
    date: Date
  ) => Promise<string>
  getExistingDirectories: (
    storeId: StoreId,
    date: Date
  ) => Promise<{
    scans: string
    bills: string
    'non-invoice': string
  }>
  onServerStatusChange: (callback: (status: any) => void) => () => void
  // Update-related APIs
  checkForUpdates: () => Promise<{
    success: boolean
    result?: any
    message?: string
    error?: string
  }>
  downloadUpdate: () => Promise<{
    success: boolean
    message?: string
    error?: string
  }>
  installUpdate: () => Promise<{
    success: boolean
    message?: string
    error?: string
  }>
  getAppVersion: () => Promise<string>
  onUpdateStatus: (callback: (status: any) => void) => () => void
  // onLogMessage: (callback: (message: string) => void) => () => void
  renameDocument: (data: {
    filePath: string
    newFileName: string
    documentType: string
    vendorId?: string
    invoiceNumber?: string
    invoiceDate?: string
  }) => Promise<
    | {
        success: true
        newFilePath?: string
        originalPath?: string
      }
    | {
        success: false
        error: string
      }
  >
  deleteFile: (filePath: string) => Promise<{
    success: boolean
    error?: string
  }>
  moveFileToZDrive: (data: {
    filePath: string
    directoryPath: string
    documentType: string
  }) => Promise<
    | {
        success: true
        message: string
        newPath: string
        originalPath: string
        fileName: string
      }
    | {
        success: false
        error: string
      }
  >
  uploadPdf: (data: {
    filePath: string
    vendorId: string
    invoiceNumber: string
    invoiceDate: string
    documentType: string
    store: StoreId
    invoiceTotal: number
  }) => Promise<
    | {
        success: true
        message: string
        url: string
      }
    | {
        success: false
        error: string
      }
  >
  // Certificate-related APIs
  checkCertificateInstalled: () => Promise<{
    installed: boolean
    message?: string
    error?: string
  }>
  installCertificate: () => Promise<{
    success: boolean
    message?: string
    error?: string
    details?: string
  }>
}

declare global {
  interface Window {
    ipc: IpcHandler
  }
}
