'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import { Badge } from './ui/badge'
import { Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

interface UpdateStatus {
  type: string
  message: string
  version?: string
  releaseNotes?: string
  progress?: {
    percent: number
    transferred: number
    total: number
    bytesPerSecond: number
  }
}

export function UpdateNotification() {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null)
  const [appVersion, setAppVersion] = useState<string>('Unknown')
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false)

  useEffect(() => {
    // Get current app version
    if (typeof window !== 'undefined' && window.ipc) {
      window.ipc.getAppVersion().then((version: string) => {
        setAppVersion(version)
      })

      // Listen for update status changes
      const unsubscribe = window.ipc.onUpdateStatus((status: UpdateStatus) => {
        setUpdateStatus(status)
        setIsCheckingForUpdates(false)
      })

      return unsubscribe
    }
  }, [])

  const handleCheckForUpdates = async () => {
    if (!window.ipc) return

    setIsCheckingForUpdates(true)
    try {
      const result = await window.ipc.checkForUpdates()
      console.log('Update check result:', result)
    } catch (error) {
      console.error('Error checking for updates:', error)
      setIsCheckingForUpdates(false)
    }
  }

  const handleDownloadUpdate = async () => {
    if (!window.ipc) return

    try {
      await window.ipc.downloadUpdate()
    } catch (error) {
      console.error('Error downloading update:', error)
    }
  }

  const handleInstallUpdate = async () => {
    if (!window.ipc) return

    try {
      await window.ipc.installUpdate()
    } catch (error) {
      console.error('Error installing update:', error)
    }
  }

  const getStatusIcon = () => {
    switch (updateStatus?.type) {
      case 'checking-for-update':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'update-available':
        return <Download className="h-4 w-4" />
      case 'download-progress':
        return <Download className="h-4 w-4" />
      case 'update-downloaded':
        return <CheckCircle className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getStatusVariant = () => {
    switch (updateStatus?.type) {
      case 'update-available':
        return 'default'
      case 'download-progress':
        return 'secondary'
      case 'update-downloaded':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          App Updates
          <Badge variant="outline">v{appVersion}</Badge>
        </CardTitle>
        <CardDescription>
          Keep your Bills Utility app up to date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {updateStatus && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <Badge variant={getStatusVariant()}>
                {updateStatus.type.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm">
              {updateStatus.message}
            </p>

            {updateStatus.version && (
              <p className="text-sm">
                <strong>New Version:</strong> {updateStatus.version}
              </p>
            )}

            {updateStatus.progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(updateStatus.progress.percent)}%</span>
                </div>
                <div className="bg-secondary h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${updateStatus.progress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {updateStatus.releaseNotes && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Release Notes:</h4>
                <div className="text-muted-foreground bg-muted rounded p-2 text-xs">
                  {updateStatus.releaseNotes}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleCheckForUpdates}
            disabled={isCheckingForUpdates}
            variant="outline"
            size="sm">
            {isCheckingForUpdates ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check for Updates'
            )}
          </Button>

          {updateStatus?.type === 'update-available' && (
            <Button
              onClick={handleDownloadUpdate}
              size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}

          {updateStatus?.type === 'update-downloaded' && (
            <Button
              onClick={handleInstallUpdate}
              size="sm">
              Install & Restart
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
