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
import { VendorCombobox } from '../ui/vendor-combobox'
import type { InterStoreTransferSchemaType } from '@/schemas'
import type { Vendor, PdfFile } from './types'
import { FormError } from '../forms/form-error'
import { useStore } from '@/hooks/use-store'

interface InterStoreTransferFormProps {
  form: UseFormReturn<InterStoreTransferSchemaType>
  vendors: Vendor[]
  vendorsLoading: boolean
  selectedPdf: PdfFile | undefined
  onSubmit: (data: InterStoreTransferSchemaType) => void
  errorMessage: string
}

export function InterStoreTransferForm({
  form,
  vendors,
  vendorsLoading,
  selectedPdf,
  onSubmit,
  errorMessage
}: InterStoreTransferFormProps) {
  const { isActionLoading } = useStore()
  const vendorsToShow = vendors.filter(vendor =>
    [
      '4179',
      '4180',
      '4181',
      '4182',
      '4183',
      '4184',
      '4185',
      '4186',
      '4187',
      '4188',
      '4189'
    ].includes(vendor.id)
  )

  const departmentsToShow = [
    {
      id: 'GROCERY',
      name: 'GROCERY'
    },
    {
      id: 'BEER',
      name: 'BEER'
    },
    {
      id: 'MEAT',
      name: 'MEAT'
    },
    {
      id: 'SEAFOOD',
      name: 'SEAFOOD'
    },
    {
      id: 'PRODUCE',
      name: 'PRODUCE'
    },
    {
      id: 'FLORAL',
      name: 'FLORAL'
    },
    {
      id: 'DELI',
      name: 'DELI'
    },
    {
      id: 'BAKERY',
      name: 'BAKERY'
    },
    {
      id: 'PIZZA',
      name: 'PIZZA'
    },
    {
      id: 'CHEESE',
      name: 'CHEESE'
    },
    {
      id: 'DAIRY',
      name: 'DAIRY'
    },
    {
      id: 'FROZEN',
      name: 'FROZEN'
    },
    {
      id: 'SUSHI',
      name: 'SUSHI'
    },
    {
      id: 'BAKERY_PRODUCTION',
      name: 'BAKERY PRODUCTION'
    },
    {
      id: 'MOZZARELLA_PRODUCTION',
      name: 'MOZZARELLA PRODUCTION'
    }
  ]
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="storeFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store From</FormLabel>
              <FormControl>
                <VendorCombobox
                  vendors={vendorsToShow}
                  selectedVendor={field.value}
                  setSelectedVendor={field.onChange}
                  disabled={!selectedPdf || vendorsLoading || isActionLoading}
                  searchPlaceholder="Search store..."
                  selectText="Select store..."
                  categoryLabel="Store"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store To</FormLabel>
              <FormControl>
                <VendorCombobox
                  vendors={vendorsToShow}
                  selectedVendor={field.value}
                  setSelectedVendor={field.onChange}
                  disabled={!selectedPdf || vendorsLoading || isActionLoading}
                  searchPlaceholder="Search store..."
                  selectText="Select store..."
                  categoryLabel="Store"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department To</FormLabel>
              <FormControl>
                <VendorCombobox
                  vendors={departmentsToShow}
                  selectedVendor={field.value}
                  setSelectedVendor={field.onChange}
                  disabled={!selectedPdf || isActionLoading}
                  searchPlaceholder="Search department..."
                  selectText="Select department..."
                  categoryLabel="Department"
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
              Upload Inter-Store Transfer
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
