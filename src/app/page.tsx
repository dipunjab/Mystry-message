'use client'; // This directive makes the component a Client Component in Next.js

import { useState, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true);
      setError(null);
      setMessages(''); // Clear previous messages

      try {
        const response = await fetch('/api/suggest-messages', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not a readable stream.');
        }

        const decoder = new TextDecoder();
        let result = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
          setMessages(result); // Update state with each new chunk
        }

      } catch (e: any) {
        console.error("Failed to fetch messages:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Streaming Messages from API</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!isLoading && !error && (
        <div style={{ whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '1rem' }}>
          {messages}
        </div>
      )}
    </div>
  );
}