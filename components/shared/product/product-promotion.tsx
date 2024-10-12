'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ProductPromotion = () => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 3)

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const currentTime = new Date()
      const timeDifference = Math.max(
        Number(targetDate) - Number(currentTime),
        0
      )

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      )
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })

      if (timeDifference === 0) {
        clearInterval(timerInterval)
        // You can add code here to handle what happens when the target date is reached.
      }
    }, 1000)

    return () => {
      clearInterval(timerInterval) // Cleanup the interval when the component unmounts.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deals of the Month</h3>
        <p>
          Score amazing discounts on your campus essentials, plus enjoy
          exclusive perks with every purchase. It&apos;s time to celebrate smart
          shopping and unbeatable savings, only at Strathmall! Don&apos;t miss
          out on this month&apos;s incredible offers. 🎁🛒
        </p>

        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild aria-label="view products">
            <Link href="/search">View products</Link>
          </Button>
        </div>
      </div>

      <div className=" flex justify-center">
        <Image
          alt="promotion"
          width={500}
          height={200}
          src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728755858/monthdeal_fhbidw.png"
        />
      </div>
    </section>
  );
}

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center ">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
)

export default ProductPromotion
