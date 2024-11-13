import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import db from '@/db/drizzle'
import { carts } from '@/db/schema'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    const cookieStore = cookies()
    const sessionCartId = cookieStore.get('sessionCartId')?.value

    if (!sessionCartId) {
      const newSessionCartId = crypto.randomUUID()
      await db.insert(carts).values({
        id: crypto.randomUUID(),
        userId,
        sessionCartId: newSessionCartId,
        items: [],
        itemsPrice: "0",
        shippingPrice: "0",
        totalPrice: "0",
      })
      cookieStore.set('sessionCartId', newSessionCartId)
      return NextResponse.json({ success: true })
    }

    const [sessionCart, userCart] = await Promise.all([
      db.query.carts.findFirst({
        where: eq(carts.sessionCartId, sessionCartId),
      }),
      db.query.carts.findFirst({
        where: eq(carts.userId, userId),
      }),
    ])

    if (sessionCart && !sessionCart.userId) {
      if (userCart) {
        const mergedItems = [...userCart.items, ...sessionCart.items]
        await Promise.all([
          db.update(carts)
            .set({ items: mergedItems })
            .where(eq(carts.id, userCart.id)),
          db.delete(carts).where(eq(carts.id, sessionCart.id)),
        ])
        cookieStore.set('sessionCartId', userCart.sessionCartId)
      } else {
        await db.update(carts)
          .set({ userId })
          .where(eq(carts.id, sessionCart.id))
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error merging carts:', error)
    return NextResponse.json(
      { error: 'Failed to merge carts' },
      { status: 500 }
    )
  }
} 