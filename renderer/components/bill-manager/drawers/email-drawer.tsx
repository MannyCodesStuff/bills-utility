'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { useDrawer } from '@/hooks/use-drawer'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { EmailSchema, EmailSchemaType } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, User, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function EmailDrawer() {
  const { isOpen, onClose, type } = useDrawer()
  const [emailInput, setEmailInput] = React.useState('')

  const emailForm = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      emailSubject: '',
      emailTo: ['test@test.com'],
      emailBody: '',
      emailAttachments: []
    }
  })

  // const { fields, append, remove } = useFieldArray({
  //   control: emailForm.control,
  //   name:
  // })

  const isDrawerOpen = isOpen && type === 'email'

  const onSubmit = (data: EmailSchemaType) => {
    console.log(data)
  }

  if (isDrawerOpen) {
    console.log(emailForm.getValues('emailTo'))
  }

  const emailTags = emailForm.watch('emailTo')

  return (
    <Sheet
      open={isDrawerOpen}
      onOpenChange={onClose}>
      <SheetContent className="my-auto mr-2 flex h-[97vh] w-[500px] min-w-[500px] flex-col rounded-xl">
        <SheetHeader>
          <SheetTitle>Email Document</SheetTitle>
          <SheetDescription>
            Fill out the form below to email selected documents and attachments.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1">
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onSubmit)}
              className="space-y-4">
              <FormField
                control={emailForm.control}
                name="emailType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Type</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select email type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal-days">
                          Personal Days
                        </SelectItem>
                        <SelectItem value="vacation-request">
                          Vacation Request
                        </SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="emailTo"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email Recipients</FormLabel>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {emailTags?.map(email => (
                          <Badge
                            key={email}
                            variant="secondary"
                            className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {email}
                            <button
                              onClick={() => {
                                const updatedRecipients = emailTags.filter(
                                  e => e !== email
                                )
                                emailForm.setValue('emailTo', updatedRecipients)
                              }}
                              className="hover:bg-destructive/20 ml-1 rounded-full p-0.5">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            {...field}
                            placeholder="Add recipient email"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                          />
                          <Button
                            type="button"
                            size="icon"
                            onClick={() => {
                              if (emailInput.trim()) {
                                field.onChange([...emailTags, emailInput])
                                setEmailInput('')
                              }
                            }}>
                            <Plus />
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={emailForm.control}
                name="emailSubject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter email subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="emailBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Body</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter email body"
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button
                  className="w-full"
                  type="submit">
                  Save changes
                </Button>
                <SheetClose asChild>
                  <Button
                    className="w-full"
                    variant="outline">
                    Close
                  </Button>
                </SheetClose>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
