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

const SignUp = ({ className, ...props }: React.ComponentProps<typeof Card>) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
    if (formData.name.length < 3)
      newErrors.name = "Name must be at least 3 characters.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm password";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    localStorage.setItem("email", formData.email)
    auth.setLoading(true);
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(
        `${auth.server}/sign-up`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          language: "en",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/verify-email");
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
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className={cn("w-full max-w-md", className)} {...props}>
        <Card {...props}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Saerv!</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <GoogleButton />
                </Field>

                <FieldSeparator className="">OR</FieldSeparator>

                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
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
                    <p id="email-error" className="text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
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
                    <p id="email-error" className="text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
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

                <div className="text-center text-sm text-muted-foreground">
                  By creating and account you agree to our{" "}
                  <Link
                    to={"/terms"}
                    className="text-foreground hover:underline hover:underline-offset-2"
                  >
                    Term of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to={"/privacy"}
                    className="text-foreground hover:underline hover:underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </div>
                <FieldGroup>
                  <Field>
                    <Button
                      type="submit"
                      onClick={handleSignUp}
                      disabled={auth.loading}
                    >
                      {auth.loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Sign up"
                      )}
                    </Button>
                  </Field>
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to={"/sign-in"}
                      className="ml-auto inline-block underline-offset-4 hover:underline"
                    >
                      Sign in
                    </Link>
                  </div>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
