import { useEffect, useState } from "react";
import { BookOpen, Download, Landmark, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import coverImg from "../../assets/covers/books";
import LoadMore from "@/components/load-more";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewModal } from "@/components/review-modal";

interface LibraryItem {
  id: string;
  title: string;
  author: string;
  coverImage: string;
}

const Library = () => {
  const [selectedProduct, setSelectedProduct] = useState<LibraryItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Sample library items
  const libraryItems: LibraryItem[] = [
    {
      id: "1",
      title: "Digital Marketing Mastery",
      author: "Sarah Johnson",
      coverImage: coverImg.book_24,
    },
    {
      id: "2",
      title: "Tech Trends 2024",
      author: "Michael Chen",
      coverImage: coverImg.book_24,
    },
    {
      id: "3",
      title: "AI Research Papers",
      author: "Dr. Emily Watson",
      coverImage: coverImg.book_24,
    },
    {
      id: "4",
      title: "Creative Writing Guide",
      author: "James Anderson",
      coverImage: coverImg.book_24,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const handleReviewClick = (item: LibraryItem) => {
    setSelectedProduct(item);
    setIsReviewModalOpen(true);
  };

  const handleOpen = (id: string) => {
    console.log("[Opening product:", id);
    // Navigate to product reader/viewer
  };

  const handleDownload = (id: string) => {
    console.log("Downloading product:", id);
    // Trigger download
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="w-8 h-8" />
            <h1 className="text-4xl font-bold text-foreground">Library</h1>
          </div>
          <p className="text-muted-foreground">
            Access your purchased publications
          </p>
        </div>

        {!loading && <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-16 space-y-6">
          {libraryItems.map((item) => (
            <div key={item.id} className="container">
              <div className="relative aspect-[6/7] w-full">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="py-2 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.author}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => handleOpen(item.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Open
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownload(item.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => handleReviewClick(item)}
                      variant="outline"
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
            {Array.from({ length: 4 }).map((_, item) => (
              <div key={item} className="container">
                <div className="relative aspect-[6/7] w-full">
                  <Skeleton className="h-full" />
                </div>
                <div className="py-2 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />

                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-full" />

                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && <LoadMore />}
        {loading && <Skeleton className="h-10 w-32 mx-auto" />}
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productTitle={selectedProduct?.title || ""}
      />
    </div>
  );
};

export default Library;
