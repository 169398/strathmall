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
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";

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
  const words = [
    {
      text: "How",
    },
    {
      text: "StrathMall",
    },
    {
      text: "Works",
    },
  ]

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
    <section className="py-16 bg-gradient-to-b  from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-3"
        >
            <div className="flex justify-center items-center mb-0 sm:hidden">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">
              How StrathMall Works
            </h2>
            </div>
            <div className="hidden sm:flex justify-center items-center mb-0">
            <TypewriterEffectSmooth words={words} />
            </div>
          <p className="text-xl text-blue-800 max-w-2xl mx-auto">
            StrathMall connects buyers and student sellers in a secure,
            user-friendly platform. Follow these simple steps to get started:
          </p>
        </motion.div>

        <CardContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {steps.map((step, index) => (
            <CardBody
              key={index}
              className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border transform hover:scale-105 transition-transform duration-300"
            >
              <CardItem
                translateZ="60"
                className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto"
              >
                <step.icon className="w-8 h-8 text-blue-600" />
              </CardItem>
              <CardItem
                translateZ="45"
                className="text-xl font-semibold text-blue-800 mb-2"
              >
                {step.title}
              </CardItem>
              <CardItem translateZ="30" as="p" className="text-blue-600">
                {step.description}
              </CardItem>
            </CardBody>
          ))}
        </CardContainer>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-3"
        >
          <Link href="/seller">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors duration-300 flex items-center"
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
