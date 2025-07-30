import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Card } from '../ui/card'
import { InvoiceForm } from './invoice-form'
import { NonInvoiceForm } from './non-invoice-form'
import type {
  BillsSchemaType,
  CreditMemoSchemaType,
  InterStoreTransferSchemaType,
  NonInvoiceSchemaType,
  OtherSchemaType
} from '@/schemas'
import type { DocumentType, Vendor, PdfFile, UploadAction } from './types'
import { OtherForm } from './other-form'
import { Button } from '../ui/button'
import { RefreshCw, Upload } from 'lucide-react'
import { CreditMemoForm } from './credit-memo-form'
import { InterStoreTransferForm } from './inter-store-transfer-form'
import { useStore } from '@/hooks/use-store'
import { FormError } from '../forms/form-error'

interface DocumentProcessingFormProps {
  documentType: DocumentType | null
  setDocumentType: (type: DocumentType | null) => void
  invoiceForm: UseFormReturn<BillsSchemaType>
  creditMemoForm: UseFormReturn<CreditMemoSchemaType>
  interStoreTransferForm: UseFormReturn<InterStoreTransferSchemaType>
  nonInvoiceForm: UseFormReturn<NonInvoiceSchemaType>
  otherForm: UseFormReturn<OtherSchemaType>
  vendors: Vendor[]
  vendorsLoading: boolean
  selectedPdf: PdfFile | undefined
  onInvoiceSubmit: (data: BillsSchemaType) => void
  onCreditMemoSubmit: (data: CreditMemoSchemaType) => void
  onInterStoreTransferSubmit: (data: InterStoreTransferSchemaType) => void
  onNonInvoiceSubmit: (data: NonInvoiceSchemaType) => void
  onOtherSubmit: (data: OtherSchemaType, action: UploadAction) => void
}

export function DocumentProcessingForm({
  documentType,
  setDocumentType,
  invoiceForm,
  creditMemoForm,
  interStoreTransferForm,
  nonInvoiceForm,
  otherForm,
  vendors,
  vendorsLoading,
  selectedPdf,
  onInvoiceSubmit,
  onCreditMemoSubmit,
  onInterStoreTransferSubmit,
  onNonInvoiceSubmit,
  onOtherSubmit
}: DocumentProcessingFormProps) {
  const { errorMessage, isActionLoading } = useStore()
  return (
    <Card className="h-full overflow-hidden">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Process Document</h2>
        </div>
        <div className="mt-2 truncate text-xs text-gray-500">
          Select document type and provide details
        </div>
      </div>

      <div className={`h-[calc(100vh-13rem)] overflow-y-auto p-2 px-3`}>
        <div className="flex h-full flex-col">
          <div className="flex-1 p-6">
            <div className="space-y-5">
              {/* Document Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <Select
                  value={documentType || ''}
                  onValueChange={value =>
                    setDocumentType(value as DocumentType)
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="production-order">
                        Production Order
                      </SelectItem>
                      <SelectItem value="inter-store-transfer">
                        Inter-Store Transfer
                      </SelectItem>
                      <SelectItem value="credit-memo">Credit Memo</SelectItem>
                      <SelectItem value="deposit-slip">Deposit Slip</SelectItem>
                      <SelectItem value="coversheets">Coversheets</SelectItem>
                      <SelectItem value="delivery-pick-tickets">
                        Delivery/Pick Tickets
                      </SelectItem>
                      <SelectItem value="paid-out-receipts">
                        Paid out receipts
                      </SelectItem>
                      <SelectItem value="house-charge">
                        House Charge Receipts
                      </SelectItem>
                      <SelectItem value="toast">Toast</SelectItem>
                      <SelectItem value="other">Custom</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Form Rendering */}
              {documentType === 'invoice' ||
              documentType === 'production-order' ? (
                <InvoiceForm
                  form={invoiceForm}
                  vendors={vendors}
                  vendorsLoading={vendorsLoading}
                  selectedPdf={selectedPdf}
                  onSubmit={onInvoiceSubmit}
                  documentType={documentType}
                  errorMessage={errorMessage || ''}
                />
              ) : documentType === 'credit-memo' ? (
                <CreditMemoForm
                  form={creditMemoForm}
                  vendors={vendors}
                  vendorsLoading={vendorsLoading}
                  selectedPdf={selectedPdf}
                  onSubmit={onCreditMemoSubmit}
                  errorMessage={errorMessage || ''}
                />
              ) : documentType === 'inter-store-transfer' ? (
                <InterStoreTransferForm
                  form={interStoreTransferForm}
                  vendors={vendors}
                  vendorsLoading={vendorsLoading}
                  selectedPdf={selectedPdf}
                  onSubmit={onInterStoreTransferSubmit}
                  errorMessage={errorMessage || ''}
                />
              ) : documentType &&
                [
                  'deposit-slip',
                  'coversheets',
                  'delivery-pick-tickets',
                  'paid-out-receipts',
                  'house-charge',
                  'toast',
                  'inter-store-transfer'
                ].includes(documentType) ? (
                <NonInvoiceForm
                  form={nonInvoiceForm}
                  documentType={documentType}
                  selectedPdf={selectedPdf}
                  onSubmit={onNonInvoiceSubmit}
                  errorMessage={errorMessage || ''}
                />
              ) : documentType && documentType === 'other' ? (
                <>
                  <OtherForm
                    form={otherForm}
                    selectedPdf={selectedPdf}
                    onSubmit={onOtherSubmit}
                  />

                  <FormError message={errorMessage} />

                  <Button
                    type="button"
                    onClick={() =>
                      onOtherSubmit(otherForm.getValues(), 'upload')
                    }
                    className="w-full"
                    disabled={(isActionLoading ?? false) || !selectedPdf}>
                    {(isActionLoading ?? false) ? (
                      <>
                        <RefreshCw className="mr-2 size-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 size-4" />
                        Upload to Non-Invoice Folder
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Please select a document type to continue
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
