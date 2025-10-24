import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, Share2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string;
};

const SubscriptionSuccessModal = ({ open, onOpenChange, plan }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-50">
        <div className="flex flex-col items-center justify-center space-y-10 py-4">
          {/* Success Icon */}
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Subscription Successful!
            </h2>
            <p className="text-muted-foreground">
              You have successfully subscribed to the{" "}
              <span className="font-semibold">{plan}</span> plan.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <h3 className="font-medium text-center">
              How would you like to proceed?
            </h3>
            <div className="w-full flex gap-6 justify-between">
              <Link
                to="/add"
                className="flex flex-col border shadow-sm rounded-lg w-full items-center justify-center p-4 hover:bg-foreground/10 transition-colors duration-300 ease-in-out"
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 text-white mb-2">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                Sell
              </Link>

              <Link
                to="/promote"
                className="flex flex-col border shadow-sm rounded-lg w-full items-center justify-center p-4 hover:bg-foreground/10 transition-colors duration-300 ease-in-out"
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-500 text-white mb-2">
                  <Share2 className="w-10 h-10" />
                </div>
                Promote
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionSuccessModal;
