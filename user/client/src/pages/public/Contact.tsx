import type React from "react";

import { useEffect, useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import handleError from "@/utils/handleError";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { FieldSeparator } from "@/components/ui/field";
import WhatsAppButton from "@/components/whatsapp-btn";
import GmailButton from "@/components/gmail-btn";

const Contact = () => {
  const { axios, user } = useAuth();

  const acckey = "b270351c-0b48-492a-b2bd-5764ab2d5c7e";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when user types
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const submissionData = new FormData();
    submissionData.append("access_key", acckey);
    submissionData.append("from_name", formData.name);
    submissionData.append("subject", `New message from ${formData.name}`);
    submissionData.append("reply_to", formData.email);
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    try {
      const { data } = await axios.post(
        "https://api.web3forms.com/submit",
        submissionData,
        { timeout: 10000, withCredentials: false } // fail faster on network issues
      );

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 10000);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          message: "",
        });
      } else toast.error(data.message);
    } catch (err) {
      console.log(err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 flex items-center justify-center">
      <div className="max-w-xl w-full bg-card rounded-xl border border-border shadow-lg p-6 sm:p-10 lg:p-12">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Send className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 text-balance">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-pretty">
            We'd love to hear from you. Send us a message and we'll get back to
            you quickly.
          </p>
        </header>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full flex items-center justify-center gap-3">
            <WhatsAppButton />
            <GmailButton />
          </div>

          <div>
            <FieldSeparator>OR CONTINUE WITH</FieldSeparator>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              type="name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={
                errors.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={
                errors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={10}
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              className={
                errors.message
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-destructive">
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>

      {/* Success Modal */}
      <Dialog open={isSubmitted} onOpenChange={setIsSubmitted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center">Message Sent!</DialogTitle>
            <DialogDescription className="text-center">
              We have received your message and will get back to you as soon as
              possible.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contact;
