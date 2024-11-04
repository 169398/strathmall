/* eslint-disable no-unused-vars */
import { NextResponse } from 'next/server';
import { getMyCart } from "@/lib/actions/sellercart.actions";

export async function GET() {
  try {
    const cart = await getMyCart();
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Placeholder for cart update logic
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' }, 
      { status: 500 }
    );
  }
} 