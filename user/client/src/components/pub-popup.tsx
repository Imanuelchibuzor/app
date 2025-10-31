import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import handleError from "@/utils/handleError";
import { CheckCircle2, Download, Loader2 } from "lucide-react";

type Popup = {
  id: number;
  title: string;
  link: string;
  cover: string;
  type: "vendor" | "affiliate";
};

const Popup = ({ id, title, link, cover, type }: Popup) => {
  const navigate = useNavigate();

  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVisit = () => {
    navigate(`/pub/${id}`);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(cover);
      const blob = await response.blob(); // Convert image to a blob

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `${title}.jpg`);
      document.body.appendChild(link);
      link.click();

      // Clean up the URL after download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      handleError(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost" className="px-0">
            {title.length > 30 ? `${title.slice(0, 30)}...` : title}
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center justify-center sm:max-w-sm space-y-3">
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

            {type === "vendor" && (
              <Button className="flex-1" onClick={handleVisit}>
                Visit Page
              </Button>
            )}

            {type === "affiliate" && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownload}
                disabled={downloading}
              >
                {downloading && <Loader2 className="animate-spin" />}
                {downloaded && <CheckCircle2 className="text-green-500" />}
                {!downloading && !downloaded && (
                  <div className="flex items-center gap-2">
                    <Download />
                    <span>Download</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default Popup;
