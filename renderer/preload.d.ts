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
}

declare global {
  interface Window {
    ipc: IpcHandler
  }
}
