"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  SmilePlus,
  Meh,
  Frown,
  CloudRain,
  Loader,
} from "lucide-react";
import { createFeedback } from "@/lib/actions/user.actions";

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendFeedback = async () => {
    if (!feedback) {
      setError("Please enter your feedback before sending.");
      return;
    }

    if (!selectedEmoji) {
      setError("Please select an emoji before sending.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await createFeedback({
        feedbackText: feedback,
        emoji: selectedEmoji,
      });
      if (response.success) {
        setSuccessMessage(
          "Feedback sent successfully, thank you for your support🤗"
        );
        setTimeout(() => {
          setIsOpen(false);
          setFeedback("");
          setSelectedEmoji(null);
          setSuccessMessage(null);
        }, 2000);
      } else {
        setError("Sign in to submit your feedback.");
      }
    } catch (error) {
      setError("An error occurred while submitting feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const emojis = [
    { icon: SmilePlus, label: "Happy" },
    { icon: Meh, label: "Neutral" },
    { icon: Frown, label: "Sad" },
    { icon: CloudRain, label: "Very Sad" },
  ];

  return (
    <div className="fixed bottom-6 right-4 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Give Feedback">
            <MessageCircle className="h-6 w-6 text-blue-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white text-black border-gray-700">
          <div className="grid gap-4">
            {successMessage ? (
              <p className="text-green-600 text-sm">{successMessage}</p>
            ) : (
              <>
                <Textarea
                  placeholder="Your feedback..."
                  value={feedback}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    setError(null); // Clear error when user types
                  }}
                  className="min-h-[100px] bg-white border-gray-700 text-black placeholder-gray-400"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
                {/* Inline error message */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {emojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedEmoji(emoji.label)}
                        aria-label={emoji.label}
                        className={`hover:bg-gray-700 ${
                          selectedEmoji === emoji.label ? "bg-gray-700" : ""
                        }`}
                      >
                        <emoji.icon
                          className={`h-6 w-6 ${
                            selectedEmoji === emoji.label
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleSendFeedback}
                    disabled={!feedback || isSubmitting} // Disable when feedback is empty or submitting
                    className={`${
                      !feedback || isSubmitting
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-black hover:bg-black"
                    } text-white flex items-center`}
                  >
                    {isSubmitting && (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "Sending..." : "Send"}
                  </Button>
                </div>
                <div className="text-right text-xs text-gray-400">
                  M+ supported
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
