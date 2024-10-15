"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Package,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function Component() {


  const handleClick = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your account to get started",
    },
    {
      icon: ShoppingBag,
      title: "Create a Shop",
      description: "Set up your online shop in minutes",
    },
    {
      icon: Package,
      title: "List Products",
      description: "Add your products and start selling",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Expand your reach and increase sales",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-blue-600 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-blue-800 max-w-2xl mx-auto">
            StrathMall connects buyers and student sellers in a secure, user-friendly
            platform. Follow these simple steps to get started:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                {step.title}
              </h3>
              <p className="text-blue-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-12"
              >
<Link
              href="/seller"
              
          >          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors duration-300 flex items-center"
          onClick={handleClick}
            >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            </Link>
        </motion.div>
      </div>
    </section>
  );
}
