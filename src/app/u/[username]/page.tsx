'use client';

import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { Loader2, Send } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const Page = () => {
  const { username } = useParams();
  const [content, setContent] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isMessageNotAccepting, setIsMessageNotAccepting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const sendMessage = async () => {
    try {
      setisLoading(true);
      setIsMessageNotAccepting(false);

      const resp = await axios.post('/api/send-message', {
        username: username,
        content: content,
      });

      toast(resp.data.message);
      setContent('');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || 'An unexpected error occurred.';

      if (errorMessage === 'User is not accepting messages') {
        setIsMessageNotAccepting(true);
        toast(errorMessage, {
          style: {
            color: 'red',
          },
        });
      } else {
        toast(errorMessage);
      }
    } finally {
      setisLoading(false);
    }
  };

const fetchSuggestions = async () => {
  try {
    setIsSuggesting(true);
    setSuggestedMessages([]);

    const response = await axios.post('/api/suggest-messages', {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const questionsString = response.data;
    
    // Check if the response is a string and contains the separator
    if (typeof questionsString === 'string' && questionsString.includes('||')) {
      const questionsArray = questionsString
        .split('||')
        .map((q) => q.trim())
        .filter((q) => q.length > 0);
      setSuggestedMessages(questionsArray);
    } else {
      console.error('API response format is incorrect or empty:', questionsString);
      toast('Failed to get suggestions. Please try again.');
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Failed to fetch suggestions:", axiosError);
    toast("Failed to fetch suggestions. Please check the network and try again.");
  } finally {
    setIsSuggesting(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Public Profile Link
          </h1>
        </div>
        <div>
          <h2>Send Anonymous Message to @{username}</h2>
          {isMessageNotAccepting && (
            <div className="text-red-500 text-sm mt-2">
              User is not accepting messages.
            </div>
          )}
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            className="border-1 border-gray-400 w-[100%] rounded-sm p-1"
          />
        </div>
        <div className="text-center">
          <Button className="text-center p-1" onClick={sendMessage} disabled={isLoading}>
            {isLoading ? (
              <>
                Submitting
                <Loader2 className="w-2 h-2 animate-spin" />
              </>
            ) : (
              <>
                Send
                <Send />
              </>
            )}
          </Button>
        </div>

        <hr className="my-4 border-t border-gray-300" />

        <div className="text-center space-y-4">
          <Button onClick={fetchSuggestions} disabled={isSuggesting}>
            {isSuggesting ? (
              <>
                Suggesting...
                <Loader2 className="w-2 h-2 animate-spin ml-2" />
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>
          {suggestedMessages.length > 0 && (
            <div className="mt-4 space-y-2 text-left">
              <p className="text-sm text-gray-600">Click a message to select it:</p>
              {suggestedMessages.map((message, index) => (
                <div
                  key={index}
                  onClick={() => setContent(message)}
                  className="p-3 border rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  {message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;