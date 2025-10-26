import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
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

const ResetPassword = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const { axios, loading, setLoading } = useAuth();
  const email = localStorage.getItem("email");
  const otp = Number(localStorage.getItem("otp"));
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear validation error when user types
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters.";
    if (!formData.newPassword.trim())
      newErrors.newPassword = "Password is required.";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm password";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data } = await axios.post("/auth/reset-password", {
        email,
        otp,
        password: formData.newPassword,
      });

      if (data.success) {
        localStorage.removeItem("email");
        localStorage.removeItem("otp");
        toast.success(data.message);
        navigate("/sign-in");
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
              <ShieldCheck className="size-6 text-rose-600" />
            </div>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="********"
                    className={
                      errors.newPassword
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                    aria-invalid={!!errors.newPassword}
                    aria-describedby={
                      errors.newPassword ? "new-password-error" : undefined
                    }
                  />
                  {errors.newPassword && (
                    <p
                      id="new-password-error"
                      className="text-sm text-destructive"
                    >
                      {errors.newPassword}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="********"
                    className={
                      errors.confirmPassword
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                  />
                  {errors.confirmPassword && (
                    <p
                      id="confirm-password-error"
                      className="text-sm text-destructive"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </Field>
                <Field>
                  <Button
                    type="submit"
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
