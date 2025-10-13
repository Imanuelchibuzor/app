import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Download } from "lucide-react";

interface PromoteSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productImage: string;
  productTitle: string;
}

const PromoteSuccessModal = ({
  open,
  onOpenChange,
  productImage,
  productTitle,
}: PromoteSuccessModalProps) => {
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
              Link Generated Successfully!
            </h2>
            <p className="text-muted-foreground text-sm">
              This product has been added to your dashboard
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

          <p className="text-foreground text-center">
            <span className="font-semibold">Affiliate Link:</span>{" "}
            www.saerv.com/product?1/affiliate?1
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              <Copy />
              Copy Link
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => onOpenChange(false)}
            >
              <Download />
              Download Cover
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoteSuccessModal;
