import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";

import { useAuth } from "@/contexts/auth";
import { Button } from "./ui/button";
import type { Props } from "@/pages/public/Merchant";

const StarterButton = ({
  plan,
  setPlan,
  subscribing,
  setSubscribing,
  setSuccess,
}: Props) => {
  const { axios, user, setUser } = useAuth();

  const handleClick = async () => {
    if (!user) return toast.error("Please sign in to get started.");
    setPlan("Starter");
    setSubscribing(true);

    try {
      const { data } = await axios.post("/merchant/onboard-starter");
      if (data.success) {
        setSuccess(true);
        setUser({ ...user, plan: "starter" });
      } else toast.error(data.message);
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err instanceof AxiosError && err.response) {
        message = err.response.data.message || err.response.data.errors;
      }
      toast.error(message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full"
      aria-label="Get Started Button"
      disabled={subscribing}
    >
      {subscribing && plan === "Starter" ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        "Get Started"
      )}
    </Button>
  );
};

export default StarterButton;
