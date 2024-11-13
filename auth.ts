import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { compareSync } from 'bcrypt-ts-edge'
import { eq } from 'drizzle-orm'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Resend from 'next-auth/providers/resend'
import Google from 'next-auth/providers/google'

import db from './db/drizzle'
import {  users } from './db/schema'
import { APP_NAME, SENDER_EMAIL } from './lib/constants'

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })
        if (user?.password) {
          const isMatch = compareSync(credentials.password as string, user.password)
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
    Resend({
      name: 'Email',
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      id: 'email',
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }: any) => {
      if (user) {
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]
          await db
            .update(users)
            .set({ name: token.name })
            .where(eq(users.id, user.id))
        }

        token.role = user.role

        if (trigger === 'signIn' || trigger === 'signUp') {
          // Handle cart merging in a separate API route
          try {
            const response = await fetch('/api/cart/merge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id }),
            })
            if (!response.ok) {
              console.error('Failed to merge carts')
            }
          } catch (error) {
            console.error('Error merging carts:', error)
          }
        }
      }

      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }

      return token
    },
    session: async ({ session, token }: any) => {
      session.user.id = token.sub
      session.user.role = token.role
      return session
    },
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/onboard/,
        /\/payment\/(.*)/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl
      return !protectedPaths.some((p) => p.test(pathname)) || !!auth
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
