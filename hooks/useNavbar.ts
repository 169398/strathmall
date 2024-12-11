"use client";

import { useRef } from "react";
import type { RefObject } from "react";

interface UseNavbarReturn {
  navRef: RefObject<HTMLElement>;
}

export function useNavbar(): UseNavbarReturn {
  const navRef = useRef<HTMLElement>(null);

  return {
    navRef,
  };
}
