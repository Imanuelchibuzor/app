import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import handleError from "@/utils/handleError";

const ForgotPassword = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const { axios, loading, setLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!email.trim()) newErrors.email = "Email is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    localStorage.setItem("email", email);
    setLoading(true);

    try {
      const { data } = await axios.post("/auth/forgot-password", {
        email,
        language: "en",
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/verify-otp");
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className={cn("w-full max-w-md", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Mail className="size-6 text-rose-600" />
            </div>
            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
            <CardDescription>
              Enter your registered email address to get a verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="m@example.com"
                    className={
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="name-error" className="text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </Field>
                <Field>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    <Link
                      to="/sign-in"
                      className="font-medium hover:underline underline-offset-4"
                    >
                      Back to Login
                    </Link>
                  </div>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
