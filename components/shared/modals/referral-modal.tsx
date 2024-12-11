"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Smartphone, CheckCircle, XCircle } from "lucide-react";
import { phoneNumberSchema } from "@/lib/validator";
import confetti from "canvas-confetti";

export function ReferralNumberModal({
  onSave,
}: {
  // eslint-disable-next-line no-unused-vars
  onSave: (number: string) => void;
}) {
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async () => {
    try {
      phoneNumberSchema.parse(mpesaNumber);
      setIsSubmitting(true);
      await onSave(mpesaNumber);
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e: any) {
      setError(e.errors?.[0]?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none rounded-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DialogTitle className="text-2xl font-bold mb-6 text-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              🎉 Enter Your M-Pesa Number 🎉
            </motion.div>
          </DialogTitle>
          <div className="grid gap-6">
            <div className="relative">
              <Input
                type="tel"
                placeholder="Enter M-Pesa number (254...)"
                value={mpesaNumber}
                onChange={(e) => {
                  setMpesaNumber(e.target.value);
                  setError(null);
                }}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-white"
              />
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-300 text-sm flex items-center"
                >
                  <XCircle className="mr-2 h-4 w-4" /> {error}
                </motion.p>
              )}
            </AnimatePresence>
            <Button
              onClick={handleSave}
              disabled={isSubmitting || isSuccess}
              className={`
                ${
                  isSubmitting || isSuccess
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }
                text-purple-700 font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105
              `}
            >
              {isSubmitting ? (
                <Loader className="mr-2 h-5 w-5 animate-spin" />
              ) : isSuccess ? (
                <CheckCircle className="mr-2 h-5 w-5" />
              ) : null}
              {isSubmitting
                ? "Saving..."
                : isSuccess
                ? "Saved!"
                : "Save & Earn Rewards"}
            </Button>
          </div>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <p className="text-lg font-semibold">Great job! 🎊</p>
              <p className="text-sm">
                Your M-Pesa number has been saved. Get ready for amazing
                rewards!
              </p>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
