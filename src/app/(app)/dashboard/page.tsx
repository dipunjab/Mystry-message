"use client"

import MessageCard from '@/components/MessageCard';
import { Message } from '@/modal/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

import {User} from "next-auth"
import { Loader2, RefreshCcw } from 'lucide-react';

const Page = () => {  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setloading] = useState(false);
  const [isSwitchloading, setisSwitchloading] = useState(false);


  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  });

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessage');

  const fetchAcceptMessage = useCallback(async () => {
    setisSwitchloading(true);
    try {
      const res = await axios.get('/api/accept-message');
      setValue('acceptMessage', res.data.isAcceptinMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "Failed to fetch message settings")
    } finally {
      setisSwitchloading(false)
    }
  }, [setValue])

  const fetchMessage = useCallback(async (refresh: boolean = false) => {
    setloading(true);
    setisSwitchloading(false);
    try {
      const res = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(res.data.messages || [])
      if (refresh) {
        toast("Showing latest Messages")
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "Failed to get message")
    } finally {
      setloading(false)
      setisSwitchloading(false)
    }
  }, [setloading, setMessages]);

  useEffect(() => {
    if (!session || !session.user) {
      return
    }

    fetchMessage()
    fetchAcceptMessage()
  }, [setValue, session, fetchAcceptMessage, fetchMessage])

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/accept-message", {
        accesptMessages: !acceptMessages
      })
      setValue("acceptMessage", !acceptMessages)
      toast(res.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "Failed to post toggle message")
    }
  }

  if (!session || !session.user) {
    return <div>Please Login</div>
  }

  const { username } = session?.user as User;
  const basseURL = `${window.location.protocol}//${window.location.host}`
  const profileURL = `${basseURL}/u/${username}`

  const coptoClipboard = () => {
    navigator.clipboard.writeText(profileURL)
    toast("URL Copied")
  }




  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-5xl font-bold mb-4'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
        <div className="flex item-center">
          <input type="text" value={profileURL} disabled className='input input-bordered w-full p-2 mr-2' />
          <Button onClick={coptoClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch 
          {...register('acceptMessage')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchloading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages? 'On': "Off"}
        </span>
      </div>
      <Separator/>

    <Button className='mt-4' variant="outline" onClick={(e) => {
      e.preventDefault();
      fetchMessage(true);
    }}>
      {loading ? (
<Loader2 className="h-4 w-4 animate-spin"/>
      ):( <RefreshCcw className='h-4 w-4'/>)}
    </Button>

    <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
{messages.length> 0 ? (
  messages.map((message, i)=> (
    <MessageCard key={message._id as string} message={message} onMessageDelete={handleDeleteMessage}/>
  ))
): (<p>No Messages to display.</p>)}
    </div>
      
    </div>
  )
}

export default Page;
