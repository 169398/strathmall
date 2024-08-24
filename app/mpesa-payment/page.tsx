"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Mpesa from '@/public/assets/images/mpesa-logo.png'

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const total = 1
    const router = useRouter()

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true)

        try {
          const response = await fetch('/api/stkpush', {
            method: 'POST',
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total, phoneNumber }),
          });
    
          // eslint-disable-next-line no-unused-vars
          const data = await response.json();
          router.push('/')
        } catch (error) {
          console.error('Error initiating payment:', error);
        }
        setLoading(false)
      };

  return (
    <div className="grid w-full min-h-screen grid-cols-1 lg:grid-cols-2">
      

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto w-full max-w-[420px] space-y-6">
        <Image 
            src={Mpesa}
            alt='mpesa-logo'
            width={150}
            height={150}
        />
        <span className="text-sm text-gray-500">Once you enter your phone number and click on the pay button, a pop up will appear on your phone with the amount indicated prompting you to enter your pin</span>
        <h1 className="text-2xl font-bold">Payment Details:</h1>
        <div className='text-gray-800 dark:text-gray-100 font-semibold'>Your total is: {total}</div>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label 
                  htmlFor="phoneNumber" 
                  className="block font-semibold mb-1"
            >
              Phone Number:
            </label>
            <input
              type="tel"
              placeholder='254799333444'
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border rounded text-gray-500"
              required
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-900/50 text-[#00FF00] dark:bg-[#00FF00] dark:hover:bg-[#00FF00]/50 dark:text-gray-900 font-bold rounded-lg px-4 py-3 w-full"
          >
          {loading ? "Processing...":`Pay ${total}`}
          </Button>
        </form>
      </div>
    </div>
    </div>
  )
}