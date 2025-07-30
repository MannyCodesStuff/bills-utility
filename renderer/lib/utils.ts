import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a blob URL from base64 PDF data for display in the UI
 * @param base64Data - Base64 encoded PDF data from the main process
 * @returns Object with blob URL and cleanup function
 */
export function createPdfBlobUrl(base64Data: string) {
  try {
    // Convert base64 to binary
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Create blob with PDF MIME type
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const blobUrl = URL.createObjectURL(blob)

    return {
      url: blobUrl,
      cleanup: () => URL.revokeObjectURL(blobUrl)
    }
  } catch (error) {
    console.error('Error creating PDF blob URL:', error)
    throw new Error('Failed to create PDF blob URL')
  }
}

/**
 * Loads and displays a PDF file by creating a blob URL
 * @param filePath - Full path to the PDF file
 * @returns Promise with blob URL and cleanup function
 */
export async function loadPdfForDisplay(filePath: string) {
  try {
    const result = await window.ipc.readPdfFile(filePath)

    if (!result.success) {
      throw new Error(result.error || 'Failed to read PDF file')
    }

    if (!result.data) {
      throw new Error('No PDF data received')
    }

    const { url, cleanup } = createPdfBlobUrl(result.data)

    return {
      url,
      fileName: result.fileName || 'document.pdf',
      size: result.size || 0,
      cleanup
    }
  } catch (error) {
    console.error('Error loading PDF for display:', error)
    throw error
  }
}
