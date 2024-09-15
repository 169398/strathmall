"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Copy, Clipboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function ShareButton({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const productLink = `https://www.strathmall.com/product/${productSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(productLink)
      .then(() => {
        toast({
          description: "Link copied to clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          description: "Failed to copy link",
          variant: "destructive",
        });
      });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
        aria-label="Share"
      >
        <Clipboard className="w-4 h-4" />
        Share
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <h2>Share {productName}</h2>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm break-all">{productLink}</span>
              <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(productLink)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Share on WhatsApp
                </Button>
              </Link>
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  productLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Share on Facebook
                </Button>
              </Link>
              <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  productLink
                )}&text=${encodeURIComponent(productName)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Share on X
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
