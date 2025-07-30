import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { CheckCircle, AlertTriangle, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CertificateStatus {
  installed: boolean
  message?: string
  error?: string
}

export function CertificateSetup() {
  const [status, setStatus] = useState<CertificateStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  // Check certificate status on component mount
  useEffect(() => {
    checkCertificateStatus()
  }, [])

  const checkCertificateStatus = async () => {
    if (!window.ipc) return

    setIsChecking(true)
    try {
      const result = await window.ipc.checkCertificateInstalled()
      setStatus(result)

      // Show setup dialog if certificate is not installed
      if (!result.installed && !result.error) {
        setShowSetup(true)
      }
    } catch (error) {
      console.error('Error checking certificate status:', error)
      setStatus({
        installed: false,
        error: 'Failed to check certificate status'
      })
    } finally {
      setIsChecking(false)
    }
  }

  const installCertificate = async () => {
    if (!window.ipc) return

    setIsInstalling(true)
    try {
      const result = await window.ipc.installCertificate()

      if (result.success) {
        toast.success(
          'Certificate installed successfully! Auto-updates will now work seamlessly.'
        )
        setStatus({ installed: true, message: result.message })
        setShowSetup(false)
      } else {
        toast.error(`Certificate installation failed: ${result.error}`)
        setStatus({
          installed: false,
          error: result.error,
          message: result.details
        })
      }
    } catch (error) {
      console.error('Error installing certificate:', error)
      toast.error('Failed to install certificate')
    } finally {
      setIsInstalling(false)
    }
  }

  // Don't show anything if we're still checking or if certificate is already installed
  if (isChecking || !status || (status.installed && !showSetup)) {
    return null
  }

  // Don't show if there was an error checking (likely not admin or system issue)
  if (status.error && !showSetup) {
    return null
  }

  return (
    <Card className="m-4 border-orange-200 bg-orange-50 p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {status.installed ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {status.installed
              ? 'Certificate Installed'
              : 'Setup Required for Auto-Updates'}
          </h3>

          <div className="mt-2 text-sm text-gray-600">
            {status.installed ? (
              <p>
                The DeCicco & Sons certificate is installed. Auto-updates will
                work seamlessly.
              </p>
            ) : (
              <>
                <p className="mb-2">
                  To enable automatic updates without security warnings, the
                  DeCicco & Sons certificate needs to be installed on this
                  computer.
                </p>
                <p className="mb-2">
                  <strong>Benefits of installing the certificate:</strong>
                </p>
                <ul className="ml-4 list-inside list-disc space-y-1">
                  <li>Automatic updates without security warnings</li>
                  <li>Seamless app updates in the background</li>
                  <li>No user intervention required for updates</li>
                </ul>
              </>
            )}
          </div>

          {!status.installed && (
            <div className="mt-4 flex space-x-3">
              <Button
                onClick={installCertificate}
                disabled={isInstalling}
                className="inline-flex items-center">
                {isInstalling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Install Certificate
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowSetup(false)}
                disabled={isInstalling}>
                Skip for Now
              </Button>
            </div>
          )}

          {status.error && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">
                <strong>Note:</strong> {status.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// Hook for checking certificate status
export function useCertificateStatus() {
  const [status, setStatus] = useState<CertificateStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkStatus = async () => {
    if (!window.ipc) return null

    setIsLoading(true)
    try {
      const result = await window.ipc.checkCertificateInstalled()
      setStatus(result)
      return result
    } catch (error) {
      console.error('Error checking certificate status:', error)
      const errorResult = {
        installed: false,
        error: 'Failed to check certificate status'
      }
      setStatus(errorResult)
      return errorResult
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return {
    status,
    isLoading,
    checkStatus
  }
}
