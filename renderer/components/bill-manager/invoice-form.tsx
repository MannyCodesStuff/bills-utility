import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { RefreshCw, Upload } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { DatePicker } from '../ui/date-picker'
import { VendorCombobox } from '../ui/vendor-combobox'
import type { BillsSchemaType } from '@/schemas'
import type { Vendor, PdfFile, DocumentType } from './types'
import { FormError } from '../forms/form-error'
import { useStore } from '@/hooks/use-store'

interface InvoiceFormProps {
  form: UseFormReturn<BillsSchemaType>
  vendors: Vendor[]
  vendorsLoading: boolean
  selectedPdf: PdfFile | undefined
  onSubmit: (data: BillsSchemaType) => void
  documentType: DocumentType
  errorMessage: string
}

export function InvoiceForm({
  form,
  vendors,
  vendorsLoading,
  selectedPdf,
  onSubmit,
  documentType,
  errorMessage
}: InvoiceFormProps) {
  const { isActionLoading } = useStore()
  const vendorsToShow =
    documentType === 'production-order'
      ? vendors.filter(vendor => vendor.id === '4181' || vendor.id === '4183')
      : vendors
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="vendorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor</FormLabel>
              <FormControl>
                <VendorCombobox
                  vendors={vendorsToShow}
                  selectedVendor={field.value}
                  setSelectedVendor={field.onChange}
                  disabled={!selectedPdf || vendorsLoading || isActionLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter invoice number"
                  disabled={!selectedPdf || isActionLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoiceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  handleDateChange={field.onChange}
                  disabled={!selectedPdf || isActionLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="invoiceTotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Total</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter invoice total"
                  disabled={!selectedPdf || isActionLoading}
                  value={field.value?.toString() || ''}
                  onChange={e => {
                    const value = e.target.value
                    field.onChange(value === '' ? 0 : parseFloat(value) || 0)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={errorMessage} />

        <Button
          type="submit"
          className="w-full"
          disabled={isActionLoading || !selectedPdf}>
          {isActionLoading ? (
            <>
              <RefreshCw className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              Upload Invoice
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
