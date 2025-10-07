import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface PurchaseSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productImage: string;
  productTitle: string;
}

const PurchaseSuccessModal = ({
  open,
  onOpenChange,
  productImage,
  productTitle,
}: PurchaseSuccessModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-50" showCloseButton={false}>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          {/* Success Icon */}
          <div className="rounded-full bg-primary/10 p-3">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Purchase Successful!
            </h2>
            <p className="text-muted-foreground text-sm">
              Your purchase has been added to your library
            </p>
          </div>

          {/* Product Image */}
          <div className="relative w-40 h-56 rounded-lg overflow-hidden border shadow-sm">
            <img
              src={productImage}
              alt={productTitle}
              className="object-cover"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              asChild
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => onOpenChange(false)}
            >
              <Link to="/library">Go to Library</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PurchaseSuccessModal