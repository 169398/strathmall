import type { Metadata } from "next";
import "./globals.css";

import { Poppins as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { constructMetadata } from "@/lib/paypal";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { WelcomeToast } from "@/components/shared/welcome-toast";
import Navbar from "@/components/shared/Navbar";
import FeedbackModal from "@/components/shared/Feedback-Modal";
import { AccessibilityProvider } from "@/lib/context/AccessibilityContext";
import SkipToContent from "@/components/shared/SkipToContent";
import { getAuthWithTimeout } from "@/lib/auth-helpers";
import { Session } from "next-auth";
import AuthModalProvider from "@/components/providers/auth-modal-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = constructMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getAuthWithTimeout();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased bg-neutral-50",
          fontSans.variable
        )}
      >
        <SessionProvider session={session as Session | null}>
          <AccessibilityProvider>
            <Navbar session={session as Session | null} />
            <main className="pt-20">
              <SkipToContent />
              {children}
              <WelcomeToast />
              <Toaster />
              <Analytics />
              <FeedbackModal />
              <AuthModalProvider />
            </main>
          </AccessibilityProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
