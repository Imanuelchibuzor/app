import { Star } from "lucide-react";

import EmptyContent from "./empty-content";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader } from "./ui/card";

const Stars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= Math.floor(rating)
              ? "fill-primary text-primary"
              : star - 0.5 <= rating
              ? "fill-primary/50 text-primary"
              : "fill-muted-foreground/50 text-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
};

type Rating = {
  count: number;
  average: number;
};

export const StarRating = ({ count, average }: Rating) => {
  return (
    <div className="flex items-center gap-3">
      <Stars rating={average} />
      <span className="font-medium">
        {average ? average.toLocaleString() : "0.0"}
      </span>
      <span className="text-muted-foreground">
        ({count ? count : "0"} rating{count > 1 ? "s" : ""})
      </span>
    </div>
  );
};

type Review = {
  id: string;
  name: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
};

export const Reviews = ({ reviews }: { reviews: Review[] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <EmptyContent
        type="review"
        title="No Review"
        description="There is no review for this publication yet."
      />
    );
  }

  return (
    <main>
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{review.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <Stars rating={review.rating} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};
