'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { updateShop } from '@/lib/actions/user.actions'
import { updateSellerSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ProfileForm = () => {
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof updateSellerSchema>>({
    resolver: zodResolver(updateSellerSchema),
    defaultValues: {
      shopName: '',
      email: session?.user?.email || '', // Assuming userId should be set from the session
    },
  })
  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof updateSellerSchema>) {
    const userId = session?.user.id || ''
    const res = await updateShop( userId,values.shopName) // Pass the shopName argument
    if (!res.success) {
      return toast({
        variant: 'destructive',
        description: res.message,
      })
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.shopName,
      },
    }
    await update(newSession)
    toast({
      description: res.message,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled
                    placeholder="User ID"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Shop Name"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
          aria-label='update shop'
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Shop'}
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm
