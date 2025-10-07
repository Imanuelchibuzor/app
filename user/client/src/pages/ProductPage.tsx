import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  ShoppingCart,
  ChevronLeft,
  Languages,
  BookOpen,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import coverImg from "../assets/covers/books";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reviews, StarRating } from "@/components/reviews";
import { Skeleton } from "@/components/ui/skeleton";
import PurchaseSuccessModal from "@/components/purchase-success";

// Mock product data
const productData = {
  id: "1",
  title: "The Complete Guide to Digital Marketing",
  author: "Sarah Johnson",
  image: coverImg.book_24,
  rating: 4.5,
  numberOfRatings: 1234,
  description:
    "Master the art of digital marketing with this comprehensive guide. Learn proven strategies for SEO, social media marketing, content creation, email campaigns, and analytics. Perfect for beginners and experienced marketers looking to stay ahead in the digital landscape. Master the art of digital marketing with this comprehensive guide. Learn proven strategies for SEO, social media marketing, content creation, email campaigns, and analytics. Perfect for beginners and experienced marketers looking to stay ahead in the digital landscape. Master the art of digital marketing with this comprehensive guide. Learn proven strategies for SEO, social media marketing, content creation, email campaigns, and analytics. Perfect for beginners and experienced marketers looking to stay ahead in the digital landscape. Master the art of digital marketing with this comprehensive guide. Learn proven strategies for SEO, social media marketing, content creation, email campaigns, and analytics. Perfect for beginners and experienced marketers looking to stay ahead in the digital landscape.",
  language: "English",
  pages: 350,
  downloadable: true,
  discount: 30,
  newPrice: 24.99,
  oldPrice: 35.99,
};

const reviews = [
  {
    id: "1",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Michael Chen",
    date: "2024-01-15",
    rating: 5,
    comment:
      "Excellent resource! The strategies outlined in this book helped me increase my website traffic by 200%. Highly recommended for anyone serious about digital marketing.",
  },
  {
    id: "2",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Emily Rodriguez",
    date: "2024-01-10",
    rating: 4,
    comment:
      "Very comprehensive and well-written. The only reason I'm not giving 5 stars is that some sections could use more recent case studies. Overall, a great purchase!",
  },
  {
    id: "3",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "David Thompson",
    date: "2024-01-05",
    rating: 5,
    comment:
      "This book transformed my approach to digital marketing. The author explains complex concepts in an easy-to-understand way. Worth every penny!",
  },
  {
    id: "4",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Lisa Anderson",
    date: "2023-12-28",
    rating: 4,
    comment:
      "Great content with actionable insights. I've already implemented several strategies from this book with positive results. Would definitely recommend to colleagues.",
  },
];

const ProductPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePurchase = () => {
    setPurchasing(true);

    setTimeout(() => {
      setPurchasing(false);
      setIsModalOpen(true);
    }, 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {!purchasing && setIsModalOpen && (
        <PurchaseSuccessModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          productImage={productData.image}
          productTitle={productData.title}
        />
      )}
      {!loading && (
        <div className="min-h-screen bg-background">
          {/* Back Button */}
          <div className="container mx-auto px-4 py-6">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ChevronLeft />
              Back Home
            </Button>
          </div>

          {/* Product Details Section */}
          <div className="container mx-auto px-4 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="overflow-hidden w-full max-w-md rounded-xl">
                  <div className="relative aspect-[3/4] w-full">
                    <img
                      src={productData.image}
                      alt={productData.title}
                      className="w-full object-cover"
                    />
                    {productData.discount > 0 && (
                      <Badge className="absolute top-4 right-4 bg-destructive">
                        -{productData.discount}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">
                    {productData.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    by {productData.author}
                  </p>
                </div>

                {/* Rating */}
                <StarRating productData={productData} />

                {/* Description */}
                <ScrollArea className="max-h-[300px]">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {productData.description}
                  </p>
                </ScrollArea>

                <Separator />

                {/* Product Details */}
                <div className="grid grid-cols-3 gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    <p className="font-medium">{productData.language}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <p className="font-medium">{productData.pages} pages</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <p className="font-medium">
                      {productData.downloadable ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Price and Buy Section */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ${productData.newPrice}
                    </span>
                    {productData.discount > 0 && (
                      <span className="text-xl text-muted-foreground line-through">
                        ${productData.oldPrice}
                      </span>
                    )}
                  </div>

                  <Button
                    size="icon-lg"
                    onClick={handlePurchase}
                    className="w-full gap-2"
                  >
                    {purchasing ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Buy
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <Reviews reviews={reviews} />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="min-h-screen bg-background">
          {/* Back Button */}
          <div className="container mx-auto px-4 py-6">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ChevronLeft />
              Back Home
            </Button>
          </div>

          {/* Product Details Section */}
          <div className="container mx-auto px-4 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="overflow-hidden w-full max-w-md rounded-xl">
                  <Skeleton className="w-full aspect-[3/4]" />
                </div>
              </div>

              {/* Product Information */}
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-2/4" />
                </div>

                {/* Rating */}
                <Skeleton className="h-8 w-1/4" />

                {/* Description */}
                <Skeleton className="h-70 w-full" />

                <Separator />

                {/* Product Details */}
                <div className="grid grid-cols-3 gap-4 text-muted-foreground">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-3/4" />
                </div>

                <Separator />

                {/* Price and Buy Section */}
                <div className="space-y-4">
                  <Skeleton className="h-8 w-2/4" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-40 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
