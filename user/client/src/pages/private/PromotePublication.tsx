import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Download,
  Share2,
  ChevronLeft,
  Languages,
  BookOpen,
  Loader2,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reviews, StarRating } from "@/components/reviews";
import PromoteSuccessModal from "@/components/promote-success";

import { useApp } from "@/contexts/app";
import { useAuth } from "@/contexts/auth";
import languages from "@/data/language.json";
import handleError from "@/utils/handleError";

export type Publication = {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  language: string;
  pages: number;
  price: number;
  discount: number;
  rating: number;
  enablesDownload: boolean;
  hasExplicitContent: boolean;
  commission: number;
  reviewCount: number;
  averageRating: number;
  reviews: [
    {
      id: string;
      avatar: string;
      name: string;
      date: string;
      rating: number;
      comment: string;
    }
  ];
};

const Promoteproduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAuth();
  const { loading, setLoading, formatNGN, calculateDiscount } = useApp();

  const [pub, setPub] = useState<Publication>({} as Publication);
  const [link, setLink] = useState<string>("");
  const [promoting, setPromoting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchPublication = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get("/pub/fetch-by-id", {
          params: { id, forAffiliates: "yes" },
        });
        if (data.success) {
          setPub(data.pub);
        } else toast.error(data.message);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
    // eslint-disable-next-line
  }, [id]);

  const handlePromote = async () => {
    setPromoting(true);

    try {
      const { data } = await axios.post("/pub/promote", {
        id,
      });
      
      if (data.success) {
        setLink(data.link)
        setIsModalOpen(true);
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setPromoting(false);
    }
  };

  return (
    <section>
      {!promoting && isModalOpen && (
        <PromoteSuccessModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          cover={pub?.cover}
          title={pub?.title}
          link={link}
        />
      )}

      {pub && !loading && (
        <div className="min-h-screen bg-background">
          {/* Back Button */}
          <div className="container mx-auto p-2 mb-2">
            <Button variant="ghost" onClick={() => navigate("/promote")}>
              <ChevronLeft />
              Back
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
                      src={pub?.cover}
                      alt={pub?.title}
                      className="w-full object-cover"
                    />
                    {pub.discount > 0 && (
                      <Badge className="absolute top-4 right-4 bg-destructive">
                        -{pub?.discount}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">
                    {pub?.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    by {pub?.author}
                  </p>
                </div>

                {/* Rating */}
                <StarRating
                  count={pub?.reviewCount}
                  average={pub.averageRating}
                />

                {/* Description */}
                <ScrollArea className="max-h-[270px]">
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {pub?.description}
                  </p>
                </ScrollArea>

                <Separator />

                {/* Product Details */}
                <div className="grid grid-cols-4 gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    <p className="font-medium">
                      {languages[pub?.language as keyof typeof languages]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <p className="font-medium">{pub?.pages}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <p className="font-medium">
                      {pub?.enablesDownload ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-5 w-5" />
                    <p className="font-medium">
                      {pub?.hasExplicitContent ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Price and Buy Section */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">
                      {formatNGN(calculateDiscount(pub?.price, pub?.discount))}
                    </span>
                    {pub?.discount > 0 && (
                      <span className="text-xl text-muted-foreground line-through">
                        {formatNGN(pub?.price)}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-green-500">
                      {pub?.commission}%
                    </span>
                  </div>

                  <Button
                    size="icon-lg"
                    onClick={handlePromote}
                    className="w-full gap-2"
                    disabled={promoting}
                  >
                    {promoting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Promote
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <Reviews reviews={pub?.reviews} />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="min-h-screen bg-background">
          {/* Back Button */}
          <div className="container mx-auto p-2 mb-2">
            <Button variant="ghost" onClick={() => navigate("/promote")}>
              <ChevronLeft />
              Back
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
                <div className="grid grid-cols-4 gap-4 text-muted-foreground">
                  <Skeleton className="h-8 w-3/4" />
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
    </section>
  );
};

export default Promoteproduct;
