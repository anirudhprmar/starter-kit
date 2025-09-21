'use client'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { authClient } from "~/lib/auth-client"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Toaster } from "~/components/ui/sonner"

const formSchema = z.object({
  name:z.string().min(2),
  email:z.email()
})



export function EmailLoginForm({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const [loading,setLoading] = useState<boolean>(false)
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name:" "
    },
  })
 
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
   try {
    setLoading(true)
    const { data, error } = await authClient.signIn.magicLink({
    email: values.email, 
    name: "",
    callbackURL: "/dashboard",
    newUserCallbackURL: "/dashboard",
    errorCallbackURL: "/error",
});

  if (data?.status === true) {
      toast.success("Check your mail")
    }

    if(error){
        toast.error(error.message)
    }

    setLoading(false)
   } catch (error) {
    console.log("error in magic link",error)
   }
  }

    

  return (
    <div {...props}>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>

            <div className="grid gap-3 grid-rows-2">
                    <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" type="text" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                    <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" type="email" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin"/> : "Login with email"}
            </Button>
            </div>
      </form>
      </Form>
      <Toaster/>
    </div>
  )
}
