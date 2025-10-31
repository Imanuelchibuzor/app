import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Popup = {
  id: number;
  title: string;
  cover: string;
};

const Popup = ({ id, title, cover }: Popup) => {
  const navigate = useNavigate();

  const [copied, setCopied] = useState<boolean>(false);
  const url = `saerv.com/pub/${id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVisit = () => {
    navigate(`/pub/${id}`);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost" className="px-0">
            {title.length > 30 ? `${title.slice(0, 30)}...` : title}
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center justify-center sm:max-w-sm">
          <DialogTitle>{title}</DialogTitle>

          <div className="relative w-50 h-70 rounded-lg overflow-hidden border shadow-sm">
            <img src={cover} alt={title} className="object-cover" />
          </div>

          <div className="w-full flex gap-4 items-center justify-center">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              {copied ? (
                <span className="text-green-500">Copied!</span>
              ) : (
                "Copy Link"
              )}
            </Button>
            <Button className="flex-1" onClick={handleVisit}>
              Visit Page
            </Button>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default Popup;
