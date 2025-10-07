import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const Stars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.floor(rating)
              ? "fill-primary text-primary"
              : star - 0.5 <= rating
              ? "fill-primary/50 text-primary"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};

type Product = {
  rating: number;
  numberOfRatings: number;
};

export const StarRating = ({ productData }: { productData: Product }) => {
  return (
    <div className="flex items-center gap-3">
      <Stars rating={productData.rating} />
      <span className="text-sm font-medium">{productData.rating}</span>
      <span className="text-sm text-muted-foreground">
        ({productData.numberOfRatings.toLocaleString()} ratings)
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
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage
                  src={review.avatar}
                  alt={review.name}
                />
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
  );
};
