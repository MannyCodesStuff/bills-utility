import { TabType } from '@/components/bill-manager'
import { StoreId } from '@/hooks/use-store'
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  async selectDirectory() {
    return ipcRenderer.invoke('select-directory')
  },
  async getServerStatus() {
    return ipcRenderer.invoke('get-server-status')
  },
  async getDefaultDirectory() {
    return ipcRenderer.invoke('get-default-directory')
  },
  async setDefaultDirectory(directory: string) {
    return ipcRenderer.invoke('set-default-directory', directory)
  },
  async getServerPort() {
    return ipcRenderer.invoke('get-server-port')
  },
  async getVendors() {
    return ipcRenderer.invoke('get-vendors')
  },
  async getExistingDirectory(storeId: StoreId, type: TabType, date: Date) {
    return ipcRenderer.invoke('get-existing-directory', storeId, type, date)
  },
  async getExistingDirectories(storeId: StoreId, date: Date) {
    return ipcRenderer.invoke('get-existing-directories', storeId, date)
  },
  onServerStatusChange(callback: (status: any) => void) {
    const subscription = (_event: IpcRendererEvent, status: any) =>
      callback(status)
    ipcRenderer.on('server-status', subscription)

    return () => {
      ipcRenderer.removeListener('server-status', subscription)
    }
  },
  // Update-related APIs
  async checkForUpdates() {
    return ipcRenderer.invoke('check-for-updates')
  },
  async downloadUpdate() {
    return ipcRenderer.invoke('download-update')
  },
  async installUpdate() {
    return ipcRenderer.invoke('install-update')
  },
  async getAppVersion() {
    return ipcRenderer.invoke('get-app-version')
  },
  onUpdateStatus(callback: (status: any) => void) {
    const subscription = (_event: IpcRendererEvent, status: any) =>
      callback(status)
    ipcRenderer.on('update-status', subscription)

    return () => {
      ipcRenderer.removeListener('update-status', subscription)
    }
  }
  // onLogMessage(callback: (message: string) => void) {
  //   const subscription = (_event: IpcRendererEvent, message: string) =>
  //     callback(message)
  //   ipcRenderer.on('log-message', subscription)

  //   return () => {
  //     ipcRenderer.removeListener('log-message', subscription)
  //   }
  // }
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
