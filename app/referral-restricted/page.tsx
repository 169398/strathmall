"use client";

import { motion } from "framer-motion";
import { School, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ReferralRestricted() {
  useEffect(() => {
    // Create a burst of confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ["#4F46E5", "#7C3AED", "#2563EB"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto"
        >
          <School className="w-10 h-10 text-indigo-600" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-gray-800"
        >
          Strathmore Students Only! 🎓
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <p className="text-lg text-gray-600">
            Our awesome referral program is exclusively for Strathmore University students.
            You&apos;ll need a <span className="font-semibold text-indigo-600">@strathmore.edu</span> email address to participate.
          </p>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>example@strathmore.edu</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Link href="/">
            <Button 
              variant="outline"
              className="group transition-all duration-300 ease-in-out"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign in with Strathmore Email
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 pt-4"
        >
          <p>
            Are you a Strathmore student? Make sure to use your university email when signing up!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 