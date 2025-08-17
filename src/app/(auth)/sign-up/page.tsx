"use client"

import { Loader } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Page = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkusernameUnique = async () => {
      if (username) {
        setisCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setisCheckingUsername(false)
        }
      }
    }
    checkusernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setisSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/signup', data);

      toast(response.data.message);

      router.replace(`/verify/${username}`);
      setisSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? "Error in signup of user");
      setisSubmitting(false);

    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-cener">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous advanture</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}/>
              </FormControl>
                 {isCheckingUsername && <Loader className='fixed mt-7 mr-3 animate-spin'/>}
                 <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-600': 'text-red-600'}`}>{usernameMessage}</p>
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
                <Input placeholder="Email" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {
            isSubmitting ? (
              <>
                <Loader className='mr-2 h-4 w-4 animate-spin'/> Please Wait
              </>
            ): ('Signup')
          }
        </Button>
        </form>
      </Form>

      <div className='text-center mt-4 '>
          <p>
            Already a member? {' '}
            <Link href="/sign-in" className='text-blue-600 hover:text-blue-800'>Sign in</Link>
          </p>
      </div>

      </div>
    </div>
  )
}

export default Page
