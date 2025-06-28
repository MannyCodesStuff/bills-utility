'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type Vendor = {
  id: string
  name: string
}

interface VendorComboboxProps {
  vendors: Vendor[]
  selectedVendor: string
  setSelectedVendor: (value: string) => void
  disabled?: boolean
  searchPlaceholder?: string
  selectText?: string
  categoryLabel?: string
}

export function VendorCombobox({
  vendors,
  selectedVendor,
  setSelectedVendor,
  disabled = false,
  searchPlaceholder = 'Search vendor...',
  selectText = 'Select vendor...',
  categoryLabel = 'Vendor'
}: VendorComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedVendorName = React.useMemo(() => {
    const found = vendors.find(vendor => vendor.id === selectedVendor)
    return found ? found.name : ''
  }, [vendors, selectedVendor])

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate"
          disabled={disabled}>
          {selectedVendor ? selectedVendorName : selectText}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No vendor found.</CommandEmpty>
            <CommandGroup heading={categoryLabel}>
              {vendors.map(vendor => (
                <CommandItem
                  key={vendor.id}
                  value={vendor.name}
                  onSelect={value => {
                    console.log({ value })
                    const found = vendors.find(vendor => vendor.name === value)
                    setSelectedVendor(found ? found.id : '')
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedVendor === vendor.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {vendor.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
