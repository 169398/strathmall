"use client";
import { useRouter } from "next/router";
import { FaWhatsapp, FaTwitter, FaFacebookF } from "react-icons/fa";
import { useState, useEffect } from "react";

const ShareButtons = ({ productName }: { productName: string }) => {
  // eslint-disable-next-line no-unused-vars
  const [shareUrl, setShareUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${router.asPath}`;
      setShareUrl(currentUrl);
    }
  }, [router]);

  const generateShareLink = () => {
    const url = `https://strathmall.com${router.asPath}`;
    setShareUrl(url);
    return url;
  };

  const handleShare = (platform: string) => {
    const url = generateShareLink();
    const message = `Check out this amazing product on StrathMall: ${productName} - ${url}`;

    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/share?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div className="flex gap-4">
      <button
        className="p-2 bg-green-600 text-white rounded-full"
        onClick={() => handleShare("whatsapp")}
      >
        <FaWhatsapp size={20} />
      </button>
      <button
        className="p-2 bg-blue-500 text-white rounded-full"
        onClick={() => handleShare("twitter")}
      >
        <FaTwitter size={20} />
      </button>
      <button
        className="p-2 bg-blue-700 text-white rounded-full"
        onClick={() => handleShare("facebook")}
      >
        <FaFacebookF size={20} />
      </button>
    </div>
  );
};

export default ShareButtons;
