import React, { useState } from 'react'
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
import { Button } from '../ui/button'
import { DatePicker } from '../ui/date-picker'
import { VendorCombobox } from '../ui/vendor-combobox'
import type { BillsSchemaType } from '@/schemas'
import type { Vendor, PdfFile, DocumentType, Asn } from './types'
import { FormError } from '../forms/form-error'
import { useStore } from '@/hooks/use-store'
import MoneyInput from '../ui/money-input'
import { InvoiceNumberCombobox } from '../ui/invoice-number-combobox'

interface InvoiceFormProps {
  form: UseFormReturn<BillsSchemaType>
  vendors: Vendor[]
  vendorsLoading: boolean
  selectedPdf: PdfFile | undefined
  onSubmit: (data: BillsSchemaType) => void
  documentType: DocumentType
  errorMessage: string
}

// Parse "$1,234.56" / "1,234.56" / "(123.45)" / "-123.45" -> number
function parseCurrencyToNumber(input: unknown): number {
  if (input == null) return 0
  let s = String(input).trim()
  const negativeByParens = /^\(.*\)$/.test(s)
  s = s.replace(/[^\d.-]/g, '') // keep digits, dot, minus
  let n = parseFloat(s || '0')
  if (!Number.isFinite(n)) n = 0
  if (negativeByParens && n > 0) n = -n
  return n
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
  const { isActionLoading, date, storeId } = useStore()
  const [asn, setAsn] = useState<Asn[]>([])

  const vendorsToShow =
    documentType === 'production-order'
      ? vendors.filter(vendor => vendor.id === '4181' || vendor.id === '4183')
      : vendors

  // modify name of a specific vendor
  const modifiedVendors = vendorsToShow.map(vendor => {
    if (vendor.id === 'CONSOLID_SUPER') {
      return { ...vendor, name: 'CSS - KoolTemp' }
    }
    return vendor
  })

  const handleVendorChange = async (vendorId: string) => {
    if (typeof window !== 'undefined' && (window as any).ipc) {
      if (storeId && date) {
        const vendor = vendorId === 'CONSOLID_SUPER' ? 'K001' : vendorId
        const response = await (window as any).ipc.getASNs(
          storeId,
          vendor,
          date
        )
        if (response?.success) {
          setAsn(response.data || [])
        } else {
          setAsn([])
        }
      }
    }
  }

  // Collect invoice numbers from ASNs (F91)
  const invoiceNumbersFromAsn = React.useMemo(() => {
    const nums =
      (asn ?? [])
        .map(a => a?.F91 ?? '')
        .filter(Boolean)
        .map(String) || []

    return Array.from(new Set(nums)).sort()
  }, [asn])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        {/* Vendor */}
        <FormField
          control={form.control}
          name="vendorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor</FormLabel>
              <FormControl>
                <VendorCombobox
                  vendors={modifiedVendors}
                  selectedVendor={field.value}
                  setSelectedVendor={vendorId => {
                    field.onChange(vendorId)
                    handleVendorChange(vendorId)
                  }}
                  disabled={!selectedPdf || vendorsLoading || isActionLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Invoice Number -> sets invoiceTotal from matching ASN.Net */}
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <InvoiceNumberCombobox
                  value={field.value || ''}
                  onChange={(val: string) => {
                    // update invoice number
                    field.onChange(val)
                    // find matching ASN and set invoiceTotal from Net
                    const match = asn.find(a => String(a?.F91) === String(val))
                    if (match?.Net != null) {
                      const total = parseCurrencyToNumber(match.Net)
                      form.setValue('invoiceTotal', total, {
                        shouldDirty: true,
                        shouldValidate: true
                      })
                    }
                  }}
                  options={invoiceNumbersFromAsn}
                  disabled={!selectedPdf || isActionLoading}
                  placeholder="Select or type invoice number..."
                  searchPlaceholder="Search or type..."
                  groupLabel="Electronic Invoice Numbers"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Invoice Date */}
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

        {/* Invoice Total (can still be edited manually) */}
        <FormField
          control={form.control}
          name="invoiceTotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Total</FormLabel>
              <FormControl>
                <MoneyInput
                  value={field.value || 0}
                  onChange={field.onChange}
                  disabled={!selectedPdf || isActionLoading}
                  placeholder="Enter invoice total"
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
