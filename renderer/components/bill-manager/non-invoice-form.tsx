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
import { Button } from '../ui/button'
import { DatePicker } from '../ui/date-picker'
import type { NonInvoiceSchemaType } from '@/schemas'
import type { PdfFile, DocumentType } from './types'
import { FormError } from '../forms/form-error'
import { useStore } from '@/hooks/use-store'

interface NonInvoiceFormProps {
  form: UseFormReturn<NonInvoiceSchemaType>
  documentType: DocumentType
  selectedPdf: PdfFile | undefined
  onSubmit: (data: NonInvoiceSchemaType) => void
  errorMessage: string
}

export function NonInvoiceForm({
  form,
  documentType,
  selectedPdf,
  onSubmit,
  errorMessage
}: NonInvoiceFormProps) {
  const { isActionLoading } = useStore()
  const formatDocumentType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Date</FormLabel>
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
              Upload {formatDocumentType(documentType)}
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
