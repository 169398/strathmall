import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Gift, ArrowRight } from "lucide-react";

const ReferralAnnouncement: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 rounded-xl shadow-lg my-8"
    >
      <div className="max-w-4xl mx-auto text-white">
        <motion.h2
          className="text-3xl font-bold mb-4 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="mr-2" /> Unlock Rewards with Our Referral
          Program <Sparkles className="ml-2" />
        </motion.h2>
        <p className="text-lg mb-6 text-center">
          Invite friends, earn money, and level up your StrathMall experience
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FeatureCard
            icon={<Gift />}
            title="Earn Money"
            description="Get money for every successful referral"
          />
          <FeatureCard
            icon={<Sparkles />}
            title="Exclusive Discounts"
            description="Unlock special discounts as you refer more friends"
          />
          <FeatureCard
            icon={<ArrowRight />}
            title="Easy to Share"
            description="Simple process to invite friends and track rewards"
          />
        </div>
        <div className="text-center">
          <Link href="/referrals" passHref>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-purple-600 font-bold py-3 px-6 rounded-full text-lg shadow-md hover:bg-yellow-100 transition duration-300"
            >
              Join the Referral Adventure Now
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white bg-opacity-20 p-4 rounded-lg text-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm">{description}</p>
    </motion.div>
  );
};

export default ReferralAnnouncement;
