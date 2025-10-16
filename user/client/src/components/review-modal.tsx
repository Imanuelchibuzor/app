import { useState } from "react";
import { Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  productTitle,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    console.log("[v0] Submitting review:", {
      productTitle,
      rating,
      comment,
    });

    // Reset form
    setRating(0);
    setComment("");
    onClose();
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] z-50">
        <DialogHeader className="flex flex-col gap-2 items-center justify-center">
          <DialogTitle className="text-xl">Write a Review</DialogTitle>
          <DialogDescription className="text-base">
            {productTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="flex items-center justify-center space-y-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "w-6 h-6 transition-colors cursor-pointer",
                      (hoveredRating || rating) >= star
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
            <Textarea
              id="comment"
              placeholder="Share your thoughts ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-32 resize-none"
            />
          </div>

          {/* Public Notice */}
          <div className="flex items-center justify-center bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              Your review will be public and visible to all users.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Post Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
