import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
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
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import GoogleButton from "@/components/google-btn";

const SignIn = ({ className, ...props }: React.ComponentProps<"div">) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    auth.setLoading(true);
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(
        `${auth.server}/sign-in`,
        {
          email: formData.email,
          password: formData.password,
          language: "en",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        auth.setUser(data.user);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err instanceof AxiosError && err.response) {
        message = err.response.data.message || err.response.data.errors;
      }
      toast.error(message);
    } finally {
      auth.setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className={cn("w-full max-w-md", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription>
              Enter your details below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <GoogleButton />
                </Field>

                <FieldSeparator className="">OR</FieldSeparator>

                <Field className="space-y-0">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
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
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      to={"/forgot-password"}
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className={
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  {errors.password && (
                    <p id="password-error" className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
                </Field>

                <Field>
                  <Button
                    type="submit"
                    onClick={handleSignIn}
                    disabled={auth.loading}
                  >
                    {auth.loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </Field>
                <div className="flex justify-center gap-1 text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/sign-up"
                    className="underline-offset-4 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
