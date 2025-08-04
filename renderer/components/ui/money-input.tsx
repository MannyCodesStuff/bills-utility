'use client'

import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Button, Group, Input, NumberField } from 'react-aria-components'
import React, { forwardRef } from 'react'

interface MoneyInputProps {
  value?: number
  onChange?: (value: number) => void
  disabled?: boolean
  placeholder?: string
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onChange, disabled, placeholder = 'Enter amount' }, ref) => {
    return (
      <NumberField
        value={value || 0}
        onChange={onChange}
        isDisabled={disabled}
        formatOptions={{
          style: 'currency',
          currency: 'USD',
          currencySign: 'accounting'
        }}>
        <Group className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive shadow-xs data-disabled:opacity-50 data-focus-within:ring-[3px] relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border text-sm outline-none transition-[color,box-shadow]">
          <Input
            ref={ref}
            placeholder={placeholder}
            className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums"
          />
          <div className="flex h-[calc(100%+2px)] flex-col">
            <Button
              slot="increment"
              className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronUpIcon
                size={12}
                aria-hidden="true"
              />
            </Button>
            <Button
              slot="decrement"
              className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
              <ChevronDownIcon
                size={12}
                aria-hidden="true"
              />
            </Button>
          </div>
        </Group>
      </NumberField>
    )
  }
)

MoneyInput.displayName = 'MoneyInput'

export default MoneyInput
