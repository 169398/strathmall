 "use client";

 import React, { useRef } from "react";

 interface NavbarWrapperProps {
   children: React.ReactNode;
 }

 export function NavbarWrapper({ children }: NavbarWrapperProps) {
   const navRef = useRef<HTMLElement>(null);

   return (
     <nav
       ref={navRef}
       role="navigation"
       aria-label="Main navigation"
       className="sticky top-0 inset-x-0 z-50 bg-white shadow-md"
     >
       {children}
     </nav>
   );
 }