"use client";

import { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Briefcase } from "lucide-react";

const Alert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(contentRef, () => setIsOpen(false));

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger onClick={() => setIsOpen(true)} className="text-sm">
        <Briefcase size={20} className="text-blue-600" />
      </AlertDialogTrigger>
      <AlertDialogContent ref={contentRef}>
        <AlertDialogHeader>
          <Button
            variant="ghost"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <X size={20}  className="text-blue-600" />
          </Button>
          <AlertDialogTitle>
            Exciting Services Coming Your Way 🚀
          </AlertDialogTitle>
          <AlertDialogDescription>
            Got a service or product that you want to monetize? Whether
            it&apos;s makeup skills or a manicure magic touch? 💅 renting out
            your gaming gear 🎮, sound systems, or any other valuable item,
            we&apos;ve got you covered. Stay tuned as we&apos;re gearing up to
            add the feature on <span className="text-blue-600">StrathMall</span>{" "}
            where you can turn your assets into income effortlessly
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>

            Got it
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
