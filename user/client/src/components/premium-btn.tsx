import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";
import type { Props } from "@/pages/public/Merchant";

const PremiumButton = ({
  plan,
  setPlan,
  subscribing,
  setSubscribing,
  setSuccess,
}: Props) => {
  const handleClick = async () => {
    console.log("Subscribing to premium plan...");
    setPlan("Premium");
    setSubscribing(true);

    setTimeout(() => {
      setSuccess(true);
      setSubscribing(false);
    }, 2000);
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full"
      aria-label="Subscribe to Premium Plan Button"
      disabled={subscribing}
    >
      {subscribing && plan === "Premium" ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        "Get Premium"
      )}
    </Button>
  );
};

export default PremiumButton;
