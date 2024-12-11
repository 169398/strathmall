"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextType {
  isAccessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
  // eslint-disable-next-line no-unused-vars
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const speak = (text: string) => {
    if (
      isAccessibilityMode &&
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  useEffect(() => {
    if (isMounted && isAccessibilityMode) {
      speak(
        "Welcome to StrathMall. Accessibility mode is now enabled. Use your keyboard to navigate through products."
      );
    }
  }, [isAccessibilityMode, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <AccessibilityContext.Provider
      value={{ isAccessibilityMode, toggleAccessibilityMode, speak }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context)
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  return context;
};
