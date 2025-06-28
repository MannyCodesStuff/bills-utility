import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { RefreshCw, Upload } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { DatePicker } from '../ui/date-picker'
// import { VendorCombobox } from '../ui/vendor-combobox'
import type { CreditMemoSchemaType } from '@/schemas'
import type { Vendor, PdfFile } from './types'
import { FormError } from '../forms/form-error'

interface CreditMemoFormProps {
  form: UseFormReturn<CreditMemoSchemaType>
  vendors: Vendor[]
  vendorsLoading: boolean
  isActionLoading: boolean
  selectedPdf: PdfFile | null
  onSubmit: (data: CreditMemoSchemaType) => void
  errorMessage: string
}

export function CreditMemoForm({
  form,
  isActionLoading,
  selectedPdf,
  onSubmit,
  errorMessage
}: CreditMemoFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="creditMemoNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit Memo Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter credit memo number"
                  disabled={isActionLoading}
                />
              </FormControl>
              <FormDescription>
                Please provide the credit memo number if available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creditMemoDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit Memo Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  handleDateChange={field.onChange}
                  disabled={isActionLoading}
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
              Upload Credit Memo
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
