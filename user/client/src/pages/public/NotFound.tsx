import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-3 mt-5">
      <TriangleAlert className="w-20 h-20 text-primary" />
      <h1 className="font-semibold text-xl">404</h1>
      <p className="">Sorry, this page does not exist</p>
      <Button
        variant="outline"
        className="hover:bg-rose-100"
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
