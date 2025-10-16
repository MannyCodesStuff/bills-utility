'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays } from 'date-fns'
import { File, Folder } from 'lucide-react'
import { toast } from 'sonner'

import { useStore } from '@/hooks/use-store'
import {
  BillsSchema,
  CreditMemoSchema,
  CreditMemoSchemaType,
  InterStoreTransferSchema,
  InterStoreTransferSchemaType,
  NonInvoiceSchema,
  OtherSchema,
  type BillsSchemaType,
  type NonInvoiceSchemaType,
  type OtherSchemaType
} from '@/schemas'
import {
  PdfFileList,
  PdfViewer,
  DocumentProcessingForm,
  type Vendor,
  type DocumentType,
  UploadAction,
  TabType,
  PdfFile
} from './bill-manager'
import {
  deleteFile,
  moveFileToZDrive,
  renameFile,
  uploadFileToSharePoint
} from '@/actions/documentManager'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet'

export function BillManager2() {
  const [loading, setLoading] = useState(true)
  const [filterQuery, setFilterQuery] = useState('')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [vendorsLoading, setVendorsLoading] = useState(true)
  const [documentType, setDocumentType] = useState<DocumentType | null>(null)
  const {
    storeId,
    date,
    activeTab,
    selectedPdf,
    setSelectedPdf,
    setDirectoryExists,
    directoryPaths,
    setPdfFiles,
    setDeletingPdf,
    setErrorMessage,
    setIsActionLoading
  } = useStore()

  // Form for Invoice documents
  const invoiceForm = useForm<BillsSchemaType>({
    resolver: zodResolver(BillsSchema),
    defaultValues: {
      filePath: '',
      vendorId: '',
      invoiceNumber: '',
      invoiceDate: addDays(new Date(), 0),
      documentType: 'invoice',
      invoiceTotal: 0
    }
  })

  const creditMemoForm = useForm<CreditMemoSchemaType>({
    resolver: zodResolver(CreditMemoSchema),
    defaultValues: {
      filePath: '',
      vendorId: '',
      creditMemoNumber: '',
      creditMemoDate: addDays(new Date(), 0),
      documentType: 'credit-memo'
    }
  })

  const interStoreTransferForm = useForm<InterStoreTransferSchemaType>({
    resolver: zodResolver(InterStoreTransferSchema),
    defaultValues: {
      filePath: '',
      storeFrom: '',
      storeTo: '',
      departmentTo: '',
      invoiceDate: addDays(new Date(), 0),
      documentType: 'inter-store-transfer'
    }
  })

  // Form for Non-Invoice documents
  const nonInvoiceForm = useForm<NonInvoiceSchemaType>({
    resolver: zodResolver(NonInvoiceSchema),
    defaultValues: {
      filePath: '',
      date: addDays(new Date(), 0),
      documentType: 'deposit-slip'
    }
  })

  const otherForm = useForm<OtherSchemaType>({
    resolver: zodResolver(OtherSchema),
    defaultValues: {
      filePath: '',
      newFileName: '',
      documentType: 'other'
    }
  })

  const fetchPdfFiles = useCallback(
    async (type: TabType, directoryPath: string) => {
      console.log('fetchPdfFiles', type, directoryPath)
      if (!directoryPath) {
        console.log('directoryPath is empty')
        setDirectoryExists(prev => ({
          ...prev,
          [type]: false
        }))
        setSelectedPdf(null)
        setPdfFiles([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        console.log('directoryPath:', directoryPath)

        if (typeof window !== 'undefined' && window.ipc) {
          const response = await window.ipc.getPdfFiles(directoryPath)
          if (response.success) {
            setDirectoryExists(prev => ({
              ...prev,
              [type]: response.folderExists
            }))
            const files2: PdfFile[] =
              response?.files?.map(file => ({
                originalPath: file.path,
                httpPath: file.path
              })) || []
            // console.log({ files2 })
            setPdfFiles(files2)
            if (files2.length === 0) {
              setSelectedPdf(null)
            } else {
              setSelectedPdf(files2[0])
            }
          } else {
            toast.error('Failed to fetch PDFs')
            setDirectoryExists(prev => ({
              ...prev,
              [type]: response.folderExists
            }))
          }
        }
      } catch (err) {
        console.log(`Error fetching ${type} files:`, err)
        setPdfFiles([])
      } finally {
        setLoading(false)
      }
    },
    [setDirectoryExists, setSelectedPdf, setPdfFiles]
  )

  // Update form filePath when selectedPdf changes
  useEffect(() => {
    if (selectedPdf) {
      invoiceForm.setValue('filePath', selectedPdf.originalPath)
      nonInvoiceForm.setValue('filePath', selectedPdf.originalPath)
      otherForm.setValue('filePath', selectedPdf.originalPath)
    }
  }, [selectedPdf, invoiceForm, nonInvoiceForm])

  // Update non-invoice form document type when documentType changes
  useEffect(() => {
    if (documentType && documentType !== 'invoice') {
      nonInvoiceForm.setValue(
        'documentType',
        documentType as NonInvoiceSchemaType['documentType']
      )
    }
  }, [documentType, nonInvoiceForm])

  // Fetch vendors from database
  useEffect(() => {
    async function fetchVendors() {
      try {
        setVendorsLoading(true)
        if (typeof window !== 'undefined' && window.ipc) {
          const vendorData = await window.ipc.getVendors()
          console.log({ vendorData })
          if (vendorData && Array.isArray(vendorData)) {
            setVendors(vendorData)
          }
        }
      } catch (err) {
        console.log('Failed to fetch vendors:', err)
      } finally {
        setVendorsLoading(false)
      }
    }

    fetchVendors()
  }, [])

  // Fetch PDFs when active tab changes
  useEffect(() => {
    console.log('activeTab changed:', activeTab)
    const currentPath = directoryPaths[activeTab!]
    if (activeTab === 'scans') {
      console.log('fetching scans in ', currentPath)
      fetchPdfFiles('scans', currentPath)
    } else if (activeTab === 'non-invoice') {
      console.log('fetching non-invoice in ', currentPath)
      fetchPdfFiles('non-invoice', currentPath)
    } else if (activeTab === 'bills' && directoryPaths.bills) {
      console.log('fetching bills in ', currentPath)
      fetchPdfFiles('bills', currentPath)
    }
  }, [activeTab, fetchPdfFiles, directoryPaths])

  const handleRefresh = (type: TabType) => {
    if (type === 'bills') {
      fetchPdfFiles(type, directoryPaths[type])
    } else if (type === 'scans') {
      fetchPdfFiles(type, directoryPaths[type])
    } else if (type === 'non-invoice') {
      fetchPdfFiles(type, directoryPaths[type])
    }
  }

  // Invoice form submit handler
  const handleRenameAndUpload = async (data: BillsSchemaType) => {
    console.log({ data })
    setErrorMessage(undefined)
    if (!selectedPdf) {
      console.log('Please select a PDF file')
      // alert('Please select a PDF file')
      return
    }

    try {
      setIsActionLoading(true)

      const formattedDate = data.invoiceDate.toISOString().split('T')[0]
      const vendorId = data.vendorId
      const invoiceNumber = data.invoiceNumber
      const invoiceDate = formattedDate
      // const documentType = data.documentType
      const asnFlag = vendors.find(vendor => vendor.id === vendorId)?.asn_flag
      const newFileName = `${vendorId}_${invoiceNumber}_${invoiceDate}${asnFlag ? '_ASN' : ''}.pdf`
      // const originalPath = selectedPdf.originalPath

      // Step 1: Rename file
      const renameResult = await renameFile({
        filePath: selectedPdf.originalPath,
        newFileName,
        documentType: documentType!,
        vendorId,
        invoiceNumber,
        invoiceDate
      })

      if (renameResult.error) {
        throw new Error(renameResult.message)
      }

      const updatedPdf = {
        ...selectedPdf,
        originalPath: renameResult.data!.newPath!
      }
      setSelectedPdf(updatedPdf)

      // Step 2: Move file to ZDrive
      const moveResult = await moveFileToZDrive({
        filePath: renameResult.data!.newPath!,
        directoryPath:
          documentType === 'invoice'
            ? directoryPaths.bills
            : directoryPaths['non-invoice'],
        documentType: documentType!
      })

      if (moveResult.success === false) {
        throw new Error(moveResult.message)
      }

      const newFilePath = moveResult.data.newPath

      // Step 3: Upload file to SharePoint
      if (documentType === 'invoice') {
        const uploadResult = await uploadFileToSharePoint({
          filePath: newFilePath,
          vendorId,
          invoiceNumber,
          invoiceDate,
          documentType: 'invoice',
          store: storeId!,
          invoiceTotal: data.invoiceTotal
        })

        if (uploadResult.success === false) {
          throw new Error(uploadResult.message)
        }

        console.log('uploadResult', uploadResult)
      }

      await fetchPdfFiles('scans', directoryPaths[activeTab!])

      toast.success('Invoice uploaded successfully.')

      // Reset form and clear state after successful completion
      setTimeout(() => {
        invoiceForm.reset({
          filePath: '',
          vendorId: '',
          invoiceNumber: '',
          invoiceDate: addDays(new Date(), 0),
          documentType: 'invoice',
          invoiceTotal: 0
        })
        setDocumentType(null)
      }, 0)
    } catch (err) {
      console.log('Error in rename and upload process:', err)
      setErrorMessage(
        `Error: ${err instanceof Error ? err.message : 'Failed to complete the rename and upload process'}`
      )
      // toast.error(
      //   `Error: ${err instanceof Error ? err.message : 'Failed to complete the rename and upload process'}`
      // )
    } finally {
      setIsActionLoading(false)
    }
  }

  // Non-invoice form submit handler
  const handleUploadNonInvoice = async (data: NonInvoiceSchemaType) => {
    console.log('handleUploadNonInvoice', data)
    setErrorMessage(undefined)
    if (!selectedPdf) {
      setErrorMessage('Please select a PDF file')
      // toast.error('Please select a PDF file')
      return
    }

    try {
      setIsActionLoading(true)

      console.log('Processing non-invoice document:', data)

      console.log('Step 1: Starting file rename...')
      const formattedDate = data.date.toISOString().split('T')[0]
      const newFileName = `${data.documentType}_${formattedDate}.pdf`

      const renameResult = await renameFile({
        filePath: selectedPdf.originalPath,
        newFileName,
        documentType: data.documentType
      })

      if (renameResult.error) {
        throw new Error(renameResult.message)
      }

      const updatedPdf = {
        ...selectedPdf,
        originalPath: renameResult.data!.newPath!
      }
      setSelectedPdf(updatedPdf)

      const moveResult = await moveFileToZDrive({
        filePath: renameResult.data!.newPath!,
        directoryPath: directoryPaths['non-invoice'],
        documentType: data.documentType
      })

      if (moveResult.success === false) {
        throw new Error(moveResult.message)
      }

      await fetchPdfFiles('scans', directoryPaths[activeTab!])

      toast.success(`${documentType} uploaded successfully.`)

      // Reset form and clear state after successful completion
      setTimeout(() => {
        nonInvoiceForm.reset({
          filePath: '',
          date: addDays(new Date(), 0),
          documentType: 'deposit-slip'
        })
        setDocumentType(null)
      }, 0)
    } catch (err) {
      console.log('Error in non-invoice processing:', err)
      setErrorMessage(
        `Error: ${err instanceof Error ? err.message : 'Failed to complete the non-invoice processing'}`
      )
      // toast.error(
      //   `Error: ${err instanceof Error ? err.message : 'Failed to complete the non-invoice processing'}`
      // )
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUploadOther = async (
    data: OtherSchemaType,
    action: UploadAction
  ) => {
    console.log('handleUploadOther', data, action)
    setErrorMessage(undefined)
    if (!selectedPdf) {
      setErrorMessage('Please select a PDF file')
      // toast.error('Please select a PDF file')
      return
    }

    setIsActionLoading(true)
    try {
      console.log('handleUploadOther', data, action)

      let newFileName = data.newFileName
      if (data.date) {
        const formattedDate = data.date.toISOString().split('T')[0]
        newFileName = `${data.newFileName}_${formattedDate}.pdf`
      } else {
        newFileName = `${data.newFileName}.pdf`
      }

      // Rename file action
      if (action === 'rename') {
        const renameResult = await renameFile({
          filePath: selectedPdf.originalPath,
          newFileName,
          documentType: data.documentType
        })

        if (renameResult.error) {
          throw new Error(renameResult.message)
        }

        // Move file to ZDrive action
      } else if (action === 'upload') {
        const moveResult = await moveFileToZDrive({
          filePath: selectedPdf.originalPath,
          directoryPath: directoryPaths['non-invoice'],
          documentType: data.documentType
        })

        if (moveResult.success === false) {
          throw new Error(moveResult.message)
        } else {
          // Reset form and clear state after successful completion
          setTimeout(() => {
            otherForm.reset({
              filePath: '',
              newFileName: '',
              date: undefined,
              documentType: 'other'
            })
            setDocumentType(null)
          }, 0)
        }
      }

      await fetchPdfFiles('scans', directoryPaths[activeTab!])

      toast.success(
        `Success! ${
          action === 'rename'
            ? 'Renamed successfully'
            : 'Moved to Non-Invoice folder.'
        }`
      )
    } catch (error) {
      setErrorMessage(
        `Error: ${error instanceof Error ? error.message : 'Failed to complete the other processing'}`
      )
      // toast.error(
      //   `Error: ${error instanceof Error ? error.message : 'Failed to complete the other processing'}`
      // )
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUploadCreditMemo = async (data: CreditMemoSchemaType) => {
    setErrorMessage(undefined)
    if (!selectedPdf) {
      console.log('Please select a PDF file')
      return
    }

    try {
      setIsActionLoading(true)

      // Step 1: Rename file
      const formattedDate = data.creditMemoDate.toISOString().split('T')[0]
      const creditMemoNumber = data.creditMemoNumber
      let newFileName = `${data.vendorId}_${data.documentType}_${formattedDate}.pdf`
      if (creditMemoNumber) {
        newFileName = `${data.vendorId}_${data.documentType}_${creditMemoNumber}_${formattedDate}.pdf`
      }

      const renameResult = await renameFile({
        filePath: selectedPdf.originalPath,
        newFileName,
        documentType: data.documentType
      })

      if (renameResult.error) {
        throw new Error(renameResult.message)
      }

      const updatedPdf = {
        ...selectedPdf,
        originalPath: renameResult.data!.newPath!
      }
      setSelectedPdf(updatedPdf)

      // Step 2: Move file to ZDrive
      const moveResult = await moveFileToZDrive({
        filePath: renameResult.data!.newPath!,
        directoryPath: directoryPaths['bills'],
        documentType: 'credit-memo'
      })

      if (moveResult.success === false) {
        throw new Error(moveResult.message)
      }

      const newFilePath = moveResult.data.newPath

      // Step 3: Upload file to SharePoint
      const uploadResult = await uploadFileToSharePoint({
        filePath: newFilePath,
        vendorId: data.vendorId,
        invoiceNumber: data.creditMemoNumber || '',
        invoiceDate: formattedDate,
        documentType: 'credit-memo',
        store: storeId!,
        invoiceTotal: 0
      })

      if (uploadResult.success === false) {
        throw new Error(uploadResult.message)
      }

      console.log('uploadResult', uploadResult)

      await fetchPdfFiles('scans', directoryPaths[activeTab!])

      toast.success('Credit Memo uploaded successfully.')

      // Reset form after successful completion but keep document type
      setTimeout(() => {
        creditMemoForm.reset({
          filePath: '',
          creditMemoNumber: '',
          creditMemoDate: addDays(new Date(), 0),
          documentType: 'credit-memo'
        })
        // Don't clear documentType - keep the form visible for immediate reuse
      }, 0)
    } catch (error) {
      setErrorMessage(
        `Error: ${error instanceof Error ? error.message : 'Failed to complete the credit memo processing'}`
      )
      // toast.error(
      //   `Error: ${error instanceof Error ? error.message : 'Failed to complete the credit memo processing'}`
      // )
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleUploadInterStoreTransfer = async (
    data: InterStoreTransferSchemaType
  ) => {
    setErrorMessage(undefined)
    if (!selectedPdf) {
      setErrorMessage('Please select a PDF file')
      // toast.error('Please select a PDF file')
      return
    }

    try {
      setIsActionLoading(true)

      // Step 1: Rename file
      const formattedDate = data.invoiceDate.toISOString().split('T')[0]
      const newFileName = `${data.documentType}_${data.storeFrom}_${data.storeTo}-${data.departmentTo}_${formattedDate}.pdf`

      const renameResult = await renameFile({
        filePath: selectedPdf.originalPath,
        newFileName,
        documentType: data.documentType
      })

      if (renameResult.error) {
        throw new Error(renameResult.message)
      }

      const updatedPdf = {
        ...selectedPdf,
        originalPath: renameResult.data!.newPath!
      }
      setSelectedPdf(updatedPdf)

      // Step 2: Move file to ZDrive Non-Invoice
      const moveResult = await moveFileToZDrive({
        filePath: renameResult.data!.newPath!,
        directoryPath: directoryPaths['non-invoice'],
        documentType: data.documentType
      })

      if (moveResult.success === false) {
        throw new Error(moveResult.message)
      }

      await fetchPdfFiles('scans', directoryPaths[activeTab!])

      toast.success('Inter Store Transfer uploaded successfully.')

      // Reset form and clear state after successful completion
      setTimeout(() => {
        interStoreTransferForm.reset({
          filePath: '',
          storeFrom: '',
          storeTo: '',
          departmentTo: '',
          invoiceDate: addDays(new Date(), 0),
          documentType: 'inter-store-transfer'
        })
        // setDocumentType(null)
      }, 0)
    } catch (error) {
      console.log('Error in inter-store transfer processing:', error)
      setErrorMessage(
        `Error: ${error instanceof Error ? error.message : 'Failed to complete the inter-store transfer processing'}`
      )
      // toast.error(
      //   `Error: ${error instanceof Error ? error.message : 'Failed to complete the inter-store transfer processing'}`
      // )
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeletePdf = async (filePath: string) => {
    setDeletingPdf(filePath)
    const toastId = toast.loading('Deleting file...')

    try {
      const result = await deleteFile({ filePath })

      if (result.error) {
        // setErrorMessage(`Failed delete: ${result.message}`)
        toast.error(`Failed delete: ${result.message}`, { id: toastId })
        return
      }

      if (result.success) {
        toast.success('File deleted successfully', { id: toastId })

        // Clear selected PDF if it was the deleted file
        if (selectedPdf?.originalPath === filePath) {
          setSelectedPdf(null)
        }

        // Refresh the file list to reflect the deletion
        await fetchPdfFiles(activeTab!, directoryPaths[activeTab!])
      }
    } catch (error) {
      // setErrorMessage(
      //   `Delete error: ${error instanceof Error ? error.message : 'Unknown error'}`
      // )
      toast.error(
        `Delete error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { id: toastId }
      )
    } finally {
      setDeletingPdf(undefined)
    }
  }

  if (!storeId) {
    return (
      <div className="flex h-full w-screen items-center justify-center py-20">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="text-center">
            <div className="text-primary mb-4">
              <Folder className="mx-auto size-10" />
            </div>
            <h2 className="text-lg font-medium">Welcome to Bills Utility</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Select a store to get started
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="ml-3 mt-3 flex items-center gap-2 capitalize lg:hidden">
          <File className="size-4" />{' '}
          {activeTab !== 'scans' && date && `${date.toLocaleDateString()} `}
          {activeTab} Folder
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="sr-only">
          <SheetTitle>PDF Files List Sidebar</SheetTitle>
          <SheetDescription>Select a folder to view the files</SheetDescription>
        </SheetHeader>
        <PdfFileList
          loading={loading}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          onRefresh={handleRefresh}
          onDelete={handleDeletePdf}
        />
      </SheetContent>
      <div className="grid h-[calc(100vh-64px-52px)] w-screen grid-cols-12 gap-3 p-3 lg:h-[calc(100vh-64px)]">
        {/* PDF File List Sidebar */}
        <div className="col-span-3 h-[calc(100vh-64px-52px-24px)] transition-all duration-300 max-lg:hidden lg:h-[calc(100vh-64px-24px)]">
          <PdfFileList
            loading={loading}
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
            onRefresh={handleRefresh}
            onDelete={handleDeletePdf}
          />
        </div>

        {/* PDF Viewer */}
        <div
          className={`lg:col-span-11 ${activeTab === 'scans' ? 'col-span-8 lg:col-span-6' : 'col-span-12 lg:col-span-9'} h-[calc(100vh-64px-52px-24px)] transition-all duration-300 lg:h-[calc(100vh-64px-24px)]`}>
          <PdfViewer />
        </div>

        {/* Document Processing Form - only shown for Scans tab */}
        {activeTab === 'scans' && (
          <div className="col-span-4 h-[calc(100vh-64px-52px-24px)] transition-all duration-300 lg:col-span-3 lg:h-[calc(100vh-64px-24px)]">
            <DocumentProcessingForm
              key={`${documentType}-${selectedPdf?.originalPath || 'no-pdf'}`}
              documentType={documentType}
              setDocumentType={setDocumentType}
              invoiceForm={invoiceForm}
              creditMemoForm={creditMemoForm}
              interStoreTransferForm={interStoreTransferForm}
              nonInvoiceForm={nonInvoiceForm}
              otherForm={otherForm}
              vendors={vendors}
              vendorsLoading={vendorsLoading}
              selectedPdf={selectedPdf || undefined}
              onInvoiceSubmit={handleRenameAndUpload}
              onCreditMemoSubmit={handleUploadCreditMemo}
              onInterStoreTransferSubmit={handleUploadInterStoreTransfer}
              onNonInvoiceSubmit={handleUploadNonInvoice}
              onOtherSubmit={handleUploadOther}
            />
          </div>
        )}
      </div>
    </Sheet>
  )
}
