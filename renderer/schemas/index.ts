import * as z from 'zod'

export const BillsSchema = z.object({
  filePath: z.string(),
  vendorId: z.string().min(1, 'Vendor is required'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.date({
    required_error: 'Invoice date is required'
  }),
  documentType: z.enum(['invoice', 'production-order']),
  invoiceTotal: z.number().gte(0, 'Invoice total is required')
})

export const CreditMemoSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  filePath: z.string(),
  creditMemoNumber: z.string().optional(),
  creditMemoDate: z.date({
    required_error: 'Credit memo date is required'
  }),
  documentType: z.literal('credit-memo')
})
export type CreditMemoSchemaType = z.infer<typeof CreditMemoSchema>

export type BillsSchemaType = z.infer<typeof BillsSchema>

export const NonInvoiceSchema = z.object({
  filePath: z.string(),
  date: z.date({
    required_error: 'Date is required'
  }),
  documentType: z.enum([
    'deposit-slip',
    'coversheets',
    'delivery-pick-tickets',
    'paid-out-receipts',
    'house-charge',
    'toast',
    'credit-memo'
  ])
})

export type NonInvoiceSchemaType = z.infer<typeof NonInvoiceSchema>

export const OtherSchema = z.object({
  filePath: z.string(),
  newFileName: z.string().min(1, 'New file name is required'),
  date: z.date().optional(),
  documentType: z.literal('other')
})

export type OtherSchemaType = z.infer<typeof OtherSchema>

export const EmailSchema = z.object({
  emailType: z.enum(['personal-days', 'vacation-request', 'custom'], {
    required_error: 'Email type is required'
  }),
  emailSubject: z.string().min(1, 'Email subject is required'),
  emailTo: z.array(z.string()).min(1, 'Email recipients are required'),
  emailBody: z.string().min(1, 'Email body is required'),
  emailAttachments: z.array(z.string()).min(1, 'Email attachments are required')
})

export type EmailSchemaType = z.infer<typeof EmailSchema>

export const InterStoreTransferSchema = z.object({
  filePath: z.string(),
  storeFrom: z.string().min(1, 'Store from is required'),
  storeTo: z.string().min(1, 'Store to is required'),
  departmentTo: z.string().min(1, 'Department to is required'),
  invoiceDate: z.date({
    required_error: 'Invoice date is required'
  }),
  documentType: z.literal('inter-store-transfer')
})

export type InterStoreTransferSchemaType = z.infer<
  typeof InterStoreTransferSchema
>
