// 'use client'

// import React, { useState, useEffect } from 'react'
// import { Card } from './ui/card'
// import { Button } from './ui/button'
// import { DatePicker } from './ui/date-picker'
// import { Input } from './ui/input'
// import { VendorCombobox } from './ui/vendor-combobox'

// type PdfFile = {
//   originalPath: string
//   httpPath: string
// }

// type Vendor = {
//   id: string
//   name: string
// }

// // Mock vendors for demo, replace with actual data later
// const VENDORS: Vendor[] = [
//   { id: 'vendor1', name: 'Vendor 1' },
//   { id: 'vendor2', name: 'Vendor 2' },
//   { id: 'vendor3', name: 'Vendor 3' },
//   { id: 'vendor4', name: 'ACME Corporation' },
//   { id: 'vendor5', name: 'TechSupplies Inc.' },
//   { id: 'vendor6', name: 'Global Services Ltd.' }
// ]

// // Default directory path - replace with your actual default path
// const DEFAULT_DIRECTORY = 'C:\\Users\\Manny\\Desktop\\temp\\4-25'

// export function PdfViewer() {
//   const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [selectedPdf, setSelectedPdf] = useState<PdfFile | null>(null)
//   const [isRenaming, setIsRenaming] = useState(false)
//   const [currentDirectory, setCurrentDirectory] = useState(DEFAULT_DIRECTORY)

//   // Form state
//   const [selectedVendor, setSelectedVendor] = useState('')
//   const [invoiceNumber, setInvoiceNumber] = useState('')
//   const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(undefined)

//   const fetchPdfFiles = async (directoryPath = currentDirectory) => {
//     try {
//       setLoading(true)
//       const response = await fetch('http://localhost:5000/list-pdfs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ directory: directoryPath })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to fetch PDF files')
//       }

//       const data = await response.json()
//       setPdfFiles(data)

//       // Select the first PDF if available
//       if (data.length > 0) {
//         setSelectedPdf(data[0])
//       } else {
//         setSelectedPdf(null)
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchPdfFiles()
//   }, [])

//   // Add electron dialog for directory selection
//   const selectDirectory = async () => {
//     try {
//       // Try to use the Electron IPC if available
//       if (typeof window !== 'undefined' && window.ipc) {
//         const directoryPath = await window.ipc.selectDirectory()
//         if (directoryPath) {
//           setCurrentDirectory(directoryPath)
//           await fetchPdfFiles(directoryPath)
//         }
//       } else {
//         // Fallback to browser API for web version
//         const input = document.createElement('input')
//         input.type = 'file'
//         input.webkitdirectory = true

//         input.onchange = async e => {
//           const files = (e.target as HTMLInputElement).files
//           if (files && files.length > 0) {
//             // Get the directory path from the first file's path
//             const firstFile = files[0] as File & { path: string }
//             const directoryPath = firstFile.path
//               .split('\\')
//               .slice(0, -1)
//               .join('\\')

//             setCurrentDirectory(directoryPath)
//             await fetchPdfFiles(directoryPath)
//           }
//         }

//         input.click()
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : 'Failed to select directory'
//       )
//     }
//   }

//   const handleRefresh = () => {
//     fetchPdfFiles()
//   }

//   const handleRenameFile = async () => {
//     if (!selectedPdf || !selectedVendor || !invoiceNumber || !invoiceDate) {
//       alert('Please fill out all fields')
//       return
//     }

//     try {
//       setIsRenaming(true)

//       // Format date to YYYY-MM-DD
//       const formattedDate = invoiceDate.toISOString().split('T')[0]

//       const response = await fetch('http://localhost:5000/rename-invoice-pdf', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           filePath: selectedPdf.originalPath,
//           vendorId: selectedVendor,
//           invoiceNumber,
//           invoiceDate: formattedDate
//         })
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || 'Failed to rename file')
//       }

//       const result = await response.json()

//       // Clear form fields
//       setSelectedVendor('')
//       setInvoiceNumber('')
//       setInvoiceDate(undefined)

//       // Refresh the PDF list
//       await fetchPdfFiles()

//       // Select the newly renamed file
//       setPdfFiles(prevFiles => {
//         const newFile = prevFiles.find(
//           file => file.originalPath === result.newPath
//         )
//         if (newFile) {
//           setSelectedPdf(newFile)
//         }
//         return prevFiles
//       })

//       alert('File renamed successfully!')
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : 'An error occurred while renaming'
//       )
//       alert(
//         `Error: ${err instanceof Error ? err.message : 'Failed to rename file'}`
//       )
//     } finally {
//       setIsRenaming(false)
//     }
//   }

//   if (loading && pdfFiles.length === 0) {
//     return <div className="mt-10 text-center">Loading PDF files...</div>
//   }

//   if (error && pdfFiles.length === 0) {
//     return <div className="mt-10 text-center text-red-500">Error: {error}</div>
//   }

//   return (
//     <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
//       {/* PDF List */}
//       <Card className="max-h-[80vh] overflow-auto p-4 md:col-span-1">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Bills</h2>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRefresh}
//               disabled={loading}>
//               {loading ? 'Refreshing...' : 'Refresh'}
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={selectDirectory}
//               disabled={loading}>
//               Select Directory
//             </Button>
//           </div>
//         </div>

//         <div className="mb-3 truncate text-xs text-gray-500">
//           {currentDirectory}
//         </div>

//         {loading ? (
//           <p>Loading...</p>
//         ) : pdfFiles.length === 0 ? (
//           <p>No PDF files found in the selected directory</p>
//         ) : (
//           <ul className="space-y-2">
//             {pdfFiles.map((pdf, index) => (
//               <li key={index}>
//                 <Button
//                   variant={
//                     selectedPdf?.originalPath === pdf.originalPath
//                       ? 'default'
//                       : 'outline'
//                   }
//                   className="w-full truncate text-left text-xs"
//                   onClick={() => setSelectedPdf(pdf)}>
//                   {pdf.originalPath.split('\\').pop()}
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </Card>

//       {/* PDF Preview and Form */}
//       <Card className="flex flex-col p-4 md:col-span-2">
//         {selectedPdf ? (
//           <>
//             <h2 className="mb-2 text-lg font-semibold">Bill PDF Preview</h2>
//             <p className="mb-4 text-sm text-gray-500">
//               {selectedPdf.originalPath}
//             </p>

//             <div className="mb-4 h-[600px]">
//               <object
//                 data={selectedPdf.httpPath}
//                 type="application/pdf"
//                 width="100%"
//                 height="100%"
//                 className="rounded-md border border-gray-200">
//                 <embed
//                   src={selectedPdf.httpPath}
//                   type="application/pdf"
//                   width="100%"
//                   height="100%"
//                 />
//               </object>
//             </div>

//             <h3 className="text-md mb-2 font-semibold">Rename File</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="mb-1 block text-sm font-medium">Vendor</label>
//                 <VendorCombobox
//                   vendors={VENDORS}
//                   selectedVendor={selectedVendor}
//                   setSelectedVendor={setSelectedVendor}
//                   disabled={isRenaming}
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium">
//                   Invoice Number
//                 </label>
//                 <Input
//                   value={invoiceNumber}
//                   onChange={e => setInvoiceNumber(e.target.value)}
//                   placeholder="Enter invoice number"
//                   disabled={isRenaming}
//                 />
//               </div>

//               <div>
//                 <label className="mb-1 block text-sm font-medium">
//                   Invoice Date
//                 </label>
//                 <DatePicker
//                   date={invoiceDate}
//                   setDate={setInvoiceDate}
//                   disabled={isRenaming}
//                 />
//               </div>

//               <Button
//                 onClick={handleRenameFile}
//                 className="w-full"
//                 disabled={
//                   isRenaming ||
//                   !selectedPdf ||
//                   !selectedVendor ||
//                   !invoiceNumber ||
//                   !invoiceDate
//                 }>
//                 {isRenaming ? 'Renaming...' : 'Rename File'}
//               </Button>
//             </div>
//           </>
//         ) : (
//           <div className="py-10 text-center">
//             <p>Select a PDF file to preview</p>
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }
