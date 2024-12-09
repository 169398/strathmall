import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'

import Google from 'next-auth/providers/google'

import db from './db/drizzle'
import {  users } from './db/schema'
import { processReferral } from './lib/actions/referral.actions'

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
    Google({
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session, account, request, response }: any) => {
      if (user) {
        if (account?.provider === 'google') {
          const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, user.email),
          });

          if (existingUser) {
            token.role = existingUser.role;
          } else {
            token.role = 'user';
            
            const userId = crypto.randomUUID();
            await db.insert(users).values({
              id: userId,
              name: user.name,
              email: user.email,
              emailVerified: new Date(),
              image: user.image,
              role: 'user'
            }).onConflictDoUpdate({
              target: users.email,
              set: {
                name: user.name,
                image: user.image,
                emailVerified: new Date()
              }
            });

            // Handle referral after user creation
            try {
              const cookies = request?.cookies;
              const referralCode = cookies?.get('referral_code')?.value;
              
              if (referralCode) {
                await processReferral(referralCode, userId);
                // Clear the referral cookie after processing
                response?.cookies.delete('referral_code');
              }
            } catch (error) {
              console.error('Error processing referral:', error);
            }
          }
        } else {
          token.role = user.role;
        }

        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
          await db
            .update(users)
            .set({ name: token.name })
            .where(eq(users.id, user.id));
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          try {
            const response = await fetch(new URL('/api/cart/merge', process.env.NEXTAUTH_URL).toString(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id }),
            });
            if (!response.ok) {
              console.error('Failed to merge carts');
            }
          } catch (error) {
            console.error('Error merging carts:', error);
          }
        }
      }

      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token;
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
    signIn: async ({ user, account, request }: any) => {
      console.log('🔑 Sign in callback triggered:', { user, account });
      
      try {
        const cookies = request?.cookies;
        const referralCode = cookies?.get('referral_code')?.value;

        if (referralCode && user.id) {
          console.log('📨 Processing referral:', { referralCode, userId: user.id });
          await processReferral(referralCode, user.id);
        }

        return true;
      } catch (error) {
        console.error('🔥 Error in signIn callback:', error);
        return true; // Still allow sign in even if referral processing fails
      }
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
