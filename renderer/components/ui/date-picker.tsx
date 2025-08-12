'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '../../lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface DatePickerProps {
  date: Date | undefined
  handleDateChange: (date: Date | undefined) => void
  disabled?: boolean
  className?: string
}

export function DatePicker({
  date,
  handleDateChange,
  disabled = false,
  className
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal max-lg:text-xs',
            !date && 'text-muted-foreground',
            className
          )}
          disabled={disabled}>
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          captionLayout="dropdown"
          disabled={date => date > new Date() || date < new Date('1900-01-01')}
        />
      </PopoverContent>
    </Popover>
  )
}
