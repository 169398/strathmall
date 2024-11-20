"use client";

import { useState, useEffect } from "react";
import { Truck, Shield, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  {
    icon: Truck,
    text: "Free Shipping on First Order",
  },
  {
    icon: Shield,
    text: ["Free Returns up to 30 Days", "Delivery Guarantee"],
  },
  {
    icon: CreditCard,
    text: "Secure Payment",
  },
];

export default function AnimatedAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === announcements[1].text.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center gap-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 min-w-max group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 12 }}
              >
                <announcement.icon className="w-4 h-4 text-white" />
              </motion.div>
              {Array.isArray(announcement.text) ? (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    className="text-sm font-medium text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {announcement.text[currentIndex]}
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span className="text-sm font-medium text-white">
                  {announcement.text}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}
