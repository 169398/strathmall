"use client";

import React,{ useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {
  Copy,
  Coins,
  Users,
  Gift,
  Sparkles,
} from "lucide-react";
import { updateMpesaNumber } from "@/lib/actions/referral.actions";
import { useToast } from "@/components/ui/use-toast";
import { ReferralNumberModal } from "@/components/shared/modals/referral-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";

export function ReferralDashboard({
  stats,
  userId,
}: {
  stats: any;
  userId: string;
}) {
  const router = useRouter();
  const [mpesaNumber, setMpesaNumber] = useState(stats.mpesaNumber || "");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(!stats.mpesaNumber);
  const { toast } = useToast();

  useEffect(() => {
    if (stats?.restricted) {
      router.push(stats.redirectUrl);
    }
  }, [stats, router]);

  useEffect(() => {
    if (!stats.mpesaNumber && !stats.restricted) {
      toast({
        title: "M-Pesa Number Required",
        description:
          "Please enter your M-Pesa number for recieving money.",
      });
    }
  }, [stats.mpesaNumber, toast, stats.restricted]);

  if (stats?.restricted) {
    return null;
  }

  const referralLink =
    process.env.NODE_ENV === "production"
      ? `${process.env.NEXT_PUBLIC_APP_URL}/sign-up?ref=${stats.referralCode}`
      : `http://localhost:3000/sign-up?ref=${stats.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Success",
      description: "Referral link copied!",
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Join Strathmall using my referral link and let's  earn rewards \n\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleUpdateMpesaNumber = async () => {
    setIsUpdating(true);
    const result = await updateMpesaNumber(userId, mpesaNumber);
    setIsUpdating(false);
    if (result.success) {
      toast({
        title: "Success",
        description: "M-Pesa number updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
      });
    }
  };

  const handleSaveMpesaNumber = async (number: string) => {
    setIsUpdating(true);
    const result = await updateMpesaNumber(userId, number);
    setIsUpdating(false);
    if (result.success) {
      setMpesaNumber(number);
      setIsModalOpen(false);
      toast({
        title: "Success",
        description:
          "M-Pesa number updated successfully. Get ready to earn money 💰🎉",
      });
    } else {
      toast({
        title: "Error",
        description: result.message,
      });
    }
  };

  return (
    <div className="min-h-screen rounded-sm bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 sm:p-8">
      {isModalOpen && <ReferralNumberModal onSave={handleSaveMpesaNumber} />}
      {!isModalOpen && (
        <>
          <AnimatePresence>
            {showConfetti && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Confetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  recycle={false}
                  numberOfPieces={400}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              <motion.h1
                className="text-3xl sm:text-4xl font-bold text-center text-purple-600 mb-6 sm:mb-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Referral Rewards Adventure
              </motion.h1>

              <motion.div
                className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-base sm:text-lg">
                  This referral program is exclusively for Strathmore University
                  students. Both you and your referred friend must use a valid
                  @strathmore.edu email address.
                </p>
              </motion.div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                <StatsCard
                  icon={<Users className="w-6 h-6 sm:w-8 sm:h-8" />}
                  title="Total Referrals"
                  value={stats.totalReferrals}
                  color="from-green-400 to-emerald-500"
                />
                <StatsCard
                  icon={<Coins className="w-6 h-6 sm:w-8 sm:h-8" />}
                  title="Total Earned"
                  value={`KES ${stats.totalEarned}`}
                  color="from-yellow-400 to-orange-500"
                />
                <StatsCard
                  icon={<Gift className="w-6 h-6 sm:w-8 sm:h-8" />}
                  title="Pending Payment"
                  value={stats.pendingReferrals}
                  color="from-pink-400 to-rose-500"
                  subtitle="Will be paid after verification"
                />
              </div>

              <motion.div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 sm:p-6 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white flex items-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Your Magic Referral Link
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <Input
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-white/20 text-white placeholder-white/50"
                  />
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                      onClick={handleCopyLink}
                      className="flex-1 sm:flex-none bg-white text-purple-600 hover:bg-purple-100"
                    >
                      <Copy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={handleWhatsAppShare}
                      className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white"
                    >
                      <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 sm:p-6 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white flex items-center">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Payment Details
                  <span className="text-xs ml-2 text-blue-200">
                    *Payments are processed daily via M-pesa
                  </span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="tel"
                    placeholder="Enter M-Pesa number (254...)"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    className="flex-1 bg-white/20 text-white placeholder-white/50"
                  />
                  <Button
                    onClick={handleUpdateMpesaNumber}
                    disabled={isUpdating || mpesaNumber === stats.mpesaNumber}
                    className="bg-yellow-400 text-purple-700 hover:bg-yellow-300 mt-2 sm:mt-0"
                  >
                    {isUpdating ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Updating...
                      </>
                    ) : (
                      "Update Number"
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

function StatsCard({
  icon,
  title,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-4 sm:p-6 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        {icon}
      </div>
      <motion.p
        className="text-2xl sm:text-3xl font-bold"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {value}
      </motion.p>
      {subtitle && (
        <p className="text-xs mt-2 text-white/80 italic">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
