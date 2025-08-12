'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'

interface InvoiceNumberComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[] // invoice numbers from ASN
  disabled?: boolean
  placeholder?: string // button placeholder
  searchPlaceholder?: string // command input placeholder
  groupLabel?: string
}

export function InvoiceNumberCombobox({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Select or type invoice number...',
  searchPlaceholder = 'Search or type...',
  groupLabel = 'Electronic Invoice Numbers'
}: InvoiceNumberComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  // de-dupe + sort for a nice UX
  const items = React.useMemo(
    () => Array.from(new Set(options.filter(Boolean))).sort(),
    [options]
  )

  const hasExactMatch = React.useMemo(
    () => !!items.find(n => n.toLowerCase() === query.trim().toLowerCase()),
    [items, query]
  )

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
    setQuery('')
  }

  // Added auto-accept functionality when popover closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && query.trim() && !hasExactMatch) {
      // Auto-accept the typed value when closing
      onChange(query.trim())
      setQuery('')
    }
    setOpen(newOpen)
  }

  // Added Enter key handling for smooth UX
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim() && !hasExactMatch) {
      e.preventDefault()
      handleSelect(query.trim())
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate max-lg:text-xs max-lg:placeholder:text-xs"
          disabled={disabled}>
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={searchPlaceholder}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            {/* Freeform option when there is a query and no exact match */}
            {query.trim() && !hasExactMatch && (
              <CommandGroup heading="Custom">
                <CommandItem
                  value={query}
                  onSelect={() => handleSelect(query.trim())}>
                  Use “{query.trim()}”
                </CommandItem>
              </CommandGroup>
            )}

            <CommandEmpty>
              No electronic invoice found.
              <br />
              Type invoice number
            </CommandEmpty>

            <CommandGroup heading={groupLabel}>
              {items
                .filter(n =>
                  query
                    ? n.toLowerCase().includes(query.trim().toLowerCase())
                    : true
                )
                .map(n => (
                  <CommandItem
                    key={n}
                    value={n}
                    onSelect={() => handleSelect(n)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === n ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {n}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
