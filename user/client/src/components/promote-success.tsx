import { useState } from "react";
import { CheckCircle2, Copy, Download, Loader2 } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import handleError from "@/utils/handleError";

interface PromoteSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cover: string;
  title: string;
  link: string;
}

const PromoteSuccessModal = ({
  open,
  onOpenChange,
  cover,
  title,
  link,
}: PromoteSuccessModalProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-50" showCloseButton={false}>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          {/* Success Icon */}
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
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
            <img src={cover} alt={title} className="object-cover" />
          </div>

          <p className="text-foreground text-center">{link}</p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              {copied ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading && <Loader2 className="animate-spin" />}
              {downloaded && <CheckCircle2 className="text-green-500" />}
              {!downloading && !downloaded && <Download />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoteSuccessModal;
