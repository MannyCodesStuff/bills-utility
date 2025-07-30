'use client'

import React from 'react'
import Image from 'next/image'
import { useState } from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { DatePicker } from './ui/date-picker'
import { StoreId, useStore } from '@/hooks/use-store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const frameworks = [
  {
    value: '4179',
    label: '4179 - Pelham'
  },
  {
    value: '4180',
    label: '4180 - Ardsley'
  },
  {
    value: '4181',
    label: '4181 - Brewster'
  },
  {
    value: '4182',
    label: '4182- Harrison'
  },
  {
    value: '4183',
    label: '4183 - Armonk'
  },
  {
    value: '4184',
    label: '4184 - Larchmont'
  },
  {
    value: '4185',
    label: '4185 - Millwood'
  },
  {
    value: '4186',
    label: '4186 - Somers'
  },
  {
    value: '4187',
    label: '4187 - Eastchester'
  },
  {
    value: '4188',
    label: '4188 - Bedford'
  },
  {
    value: '4189',
    label: '4189 - Sleepy Hollow'
  }
]

export const Header = () => {
  const [open, setOpen] = useState(false)
  const {
    storeId,
    setStoreId,
    date,
    setDate,
    setSelectedPdf,
    setDirectoryExists,
    setDirectoryPaths,
    setPdfFiles
  } = useStore()

  const handleStoreChange = async (currentValue: StoreId) => {
    if (!date) {
      toast.error('Please select a date first')
      return
    }

    let existingDirectories: {
      scans: string
      bills: string
      'non-invoice': string
    } = {
      scans: '',
      bills: '',
      'non-invoice': ''
    }

    if (typeof window !== 'undefined' && window.ipc) {
      existingDirectories = await window.ipc.getExistingDirectories(
        currentValue as StoreId,
        date
      )
      console.log({ existingDirectories })
    }

    setDirectoryPaths({
      scans: existingDirectories.scans,
      bills: existingDirectories.bills,
      'non-invoice': existingDirectories['non-invoice']
    })

    setStoreId(currentValue === storeId ? '' : currentValue)
    setOpen(false)
    setSelectedPdf(null)
    setDirectoryExists({
      scans: false,
      bills: false,
      'non-invoice': false
    })
    setPdfFiles([])
  }

  const handleDateChange = async (newDate: Date) => {
    if (storeId) {
      setDate(newDate)

      let existingDirectories: {
        scans: string
        bills: string
        'non-invoice': string
      } = {
        scans: '',
        bills: '',
        'non-invoice': ''
      }

      if (typeof window !== 'undefined' && window.ipc) {
        existingDirectories = await window.ipc.getExistingDirectories(
          storeId,
          newDate
        )
        console.log({ existingDirectories })
      }

      setDirectoryPaths({
        scans: existingDirectories.scans,
        bills: existingDirectories.bills,
        'non-invoice': existingDirectories['non-invoice']
      })
      setSelectedPdf(null)
      setDirectoryExists({
        scans: false,
        bills: false,
        'non-invoice': false
      })
    } else {
      toast.error('Please select a store first')
    }
  }

  // const handleTest = async () => {
  //   console.log('clicked test')
  //   if (typeof window !== 'undefined' && window.ipc) {
  //     const response = await window.ipc.getPdfFiles(
  //       '//10.1.10.20/Files/181 Brewster/Brewster Bills/Scans'
  //     )
  //     console.log(response)
  //   }
  // }

  return (
    <header className="bg-background border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            priority
            src="/images/DeCiccoAndSons_Logo_Vertical_RGB.png"
            alt="logo"
            width={60}
            height={60}
          />
          <h1 className="text-xl font-semibold">Document Manager</h1>
        </div>
        <div className="flex items-center gap-4">
          <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-64 justify-between">
                {storeId
                  ? frameworks.find(framework => framework.value === storeId)
                      ?.label
                  : 'Select store...'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Command>
                <CommandInput placeholder="Search store..." />
                <CommandList>
                  <CommandEmpty>No store found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map(framework => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={currentValue =>
                          handleStoreChange(currentValue as StoreId)
                        }>
                        {framework.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            storeId === framework.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <DatePicker
            date={date}
            handleDateChange={handleDateChange}
            className="w-64"
          />
          {/* <Button onClick={handleTest}>Test</Button> */}
        </div>
      </div>
    </header>
  )
}
