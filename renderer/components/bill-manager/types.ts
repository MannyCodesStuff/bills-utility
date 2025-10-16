export type PdfFile = {
  originalPath: string
  httpPath: string
}

export type Vendor = {
  id: string
  name: string
  asn_flag: number
}

export type Asn = {
  F1056: string
  F91: string
  F27: string
  F254: Date
  F03: number
  F238: string
  Gross: string
  Net: string
}

export type DocumentType =
  | 'invoice'
  | 'deposit-slip'
  | 'coversheets'
  | 'delivery-pick-tickets'
  | 'paid-out-receipts'
  | 'house-charge'
  | 'toast'
  | 'credit-memo'
  | 'other'
  | 'inter-store-transfer'
  | 'production-order'

export type TabType = 'scans' | 'bills' | 'non-invoice'

export type PdfFilesState = {
  scans: PdfFile[]
  bills: PdfFile[]
  'non-invoice': PdfFile[]
}

export type FetchErrorsState = {
  bills: string
  scans: string
  nonInvoice: string
}

export type UploadAction = 'rename' | 'upload' | 'email'
