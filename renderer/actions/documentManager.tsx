import axios from 'axios'

import { DocumentType } from '@/components/bill-manager/types'
import { StoreId } from '@/hooks/use-store'

export const renameFile = async (data: {
  filePath: string
  newFileName: string
  documentType: string
  vendorId?: string
  invoiceNumber?: string
  invoiceDate?: string
}) => {
  if (typeof window !== 'undefined' && window.ipc) {
    const response = await window.ipc.renameDocument(data)
    if (response.success) {
      return {
        success: true,
        data: {
          newPath: response.newFilePath,
          originalPath: response.originalPath
        }
      }
    } else {
      return {
        error: true,
        message: response.error
      }
    }
  } else {
    return {
      error: true,
      message: 'Window IPC is not available'
    }
  }
}

export const uploadFileToSharePoint = async (data: {
  filePath: string
  vendorId: string
  invoiceNumber: string
  invoiceDate: string
  documentType: 'invoice' | 'credit-memo'
  store: StoreId
  invoiceTotal: number
}) => {
  // const uploadResponse = await fetch(
  //   `http://localhost:${serverPort}/upload-pdf`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       ...data
  //     })
  //   }
  // )

  // if (!uploadResponse.ok) {
  //   const errorData = await uploadResponse.json()
  //   return {
  //     error: true,
  //     message: `Upload failed: ${errorData.message || 'Failed to upload file to SharePoint'}`
  //   }
  // }

  // const uploadResult = await uploadResponse.json()
  // return {
  //   success: true,
  //   data: uploadResult
  // }
  if (typeof window !== 'undefined' && window.ipc) {
    const response = await window.ipc.uploadPdf(data)
    if (response.success) {
      return response
    } else {
      return {
        success: false,
        message: response.error
      }
    }
  } else {
    return { success: false, message: 'Window IPC is not available' }
  }
}

export const moveFileToZDrive = async (data: {
  filePath: string
  directoryPath: string
  documentType: DocumentType
}): Promise<
  | {
      success: true
      data: {
        newPath: string
        originalPath: string
        fileName: string
      }
    }
  | {
      success: false
      message: string
    }
> => {
  // const moveResponse = await fetch(
  //   `http://localhost:${serverPort}/move-file-to-zdrive`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       ...data
  //     })
  //   }
  // )

  // if (!moveResponse.ok) {
  //   const errorData = await moveResponse.json()
  //   return {
  //     error: true,
  //     message: `Move failed: ${errorData.message || 'Failed to move file to ZDrive'}`
  //   }
  // }

  // const moveResult = await moveResponse.json()
  // return {
  //   success: true,
  //   data: moveResult
  // }
  if (typeof window !== 'undefined' && window.ipc) {
    const response = await window.ipc.moveFileToZDrive(data)
    if (response.success) {
      return {
        success: true,
        data: response
      }
    } else {
      return {
        success: false,
        message: response.error
      }
    }
  } else {
    return {
      success: false,
      message: 'Window IPC is not available'
    }
  }
}

// export const deleteFile = async (
//   serverPort: number,
//   data: { filePath: string }
// ) => {
//   try {
//     const deleteResponse = await fetch(
//       `http://localhost:${serverPort}/delete-file`,
//       {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//       }
//     )

//     if (!deleteResponse.ok) {
//       let errorData
//       try {
//         errorData = await deleteResponse.json()
//       } catch {
//         errorData = { message: 'Unknown error' }
//       }

//       return {
//         error: true,
//         message: `Delete failed: ${errorData.message || 'Failed to delete file'}`
//       }
//     }

//     const deleteResult = await deleteResponse.json()
//     return {
//       success: true,
//       data: deleteResult
//     }
//   } catch (err: any) {
//     return {
//       error: true,
//       message: `Delete failed: ${err.message || 'Unexpected error'}`
//     }
//   }
// }

export const deleteFile = async (data: { filePath: string }) => {
  try {
    const response = await axios.delete(`http://localhost:5000/delete-file`, {
      data, // axios allows sending body in DELETE requests
      timeout: 10000, // optional: 10-second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    // This handles both network errors and HTTP error responses
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unexpected error occurred'

    return {
      error: true,
      message: `Delete failed: ${message}`
    }
  }
}
