import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { PencilLine, RefreshCw } from 'lucide-react'
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
import type { OtherSchemaType } from '@/schemas'
import type { PdfFile, UploadAction } from './types'
import { useStore } from '@/hooks/use-store'
import { Input } from '../ui/input'

interface OtherFormProps {
  form: UseFormReturn<OtherSchemaType>
  selectedPdf: PdfFile | undefined
  onSubmit: (data: OtherSchemaType, action: UploadAction) => void
}

export function OtherForm({ form, selectedPdf, onSubmit }: OtherFormProps) {
  const { isActionLoading } = useStore()
  const handleRename = () =>
    form.handleSubmit(data => onSubmit(data, 'rename'))()

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="newFileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New File Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!selectedPdf || isActionLoading}
                  placeholder="Enter new file name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Document Date{' '}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
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

        <Button
          type="button"
          onClick={handleRename}
          className="w-full"
          disabled={isActionLoading || !selectedPdf}>
          {isActionLoading ? (
            <>
              <RefreshCw className="mr-2 size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <PencilLine className="mr-2 size-4" />
              Rename File
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

// <Button
//   type="button"
//   onClick={() => onOpen('email')}
//   className="w-full"
//   disabled={isActionLoading || !selectedPdf}>
//   {isActionLoading ? (
//     <>
//       <RefreshCw className="mr-2 size-4 animate-spin" />
//       Processing...
//     </>
//   ) : (
//     <>
//       <Mail className="mr-2 size-4" />
//       Email Document
//     </>
//   )}
// </Button>
