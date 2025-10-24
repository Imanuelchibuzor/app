import { Loader2 } from "lucide-react";

import { Button } from "./ui/button";
import type { Props } from "@/pages/public/Merchant";

const ProButton = ({
  plan,
  setPlan,
  subscribing,
  setSubscribing,
  setSuccess,
}: Props) => {
  const handleClick = async () => {
    console.log("Subscribing to pro plan...");
    setPlan("Pro");
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
      aria-label="Subscribe to Pro Plan Button"
      disabled={subscribing}
    >
      {subscribing && plan === "Pro" ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        "Get Pro"
      )}
    </Button>
  );
};

export default ProButton;
