import { Link } from "react-router-dom";

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
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

const SignIn = ({ className, ...props }: React.ComponentProps<"div">) => {
  const auth = useAuth();
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    auth.setLoading(true);

    setTimeout(() => {
      auth.setLoading(false);
      auth.setUser({
        id: "1",
        email: "johndoe@email.com",
        name: "John Doe",
        avatar:
          "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
        language: "en",
      });
      auth.setShowAuth(false);
    }, 3000);

    return;
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
                <Field className="space-y-0">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
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
                  <Input id="password" type="password" required />
                </Field>
                <Field>
                  <Button type="submit" onClick={handleSignIn}>
                    {auth.loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <FieldSeparator className="my-0.5">
                    Or continue with
                  </FieldSeparator>

                  <Field>
                    <div className="flex justify-center gap-4 ">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>{" "}
                        Google
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                      >
                        <svg
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <rect
                              x="10"
                              y="2"
                              width="20"
                              height="28"
                              rx="2"
                              fill="#1066B5"
                            ></rect>{" "}
                            <rect
                              x="10"
                              y="2"
                              width="20"
                              height="28"
                              rx="2"
                              fill="url(#paint0_linear_87_7742)"
                            ></rect>{" "}
                            <rect
                              x="10"
                              y="5"
                              width="10"
                              height="10"
                              fill="#32A9E7"
                            ></rect>{" "}
                            <rect
                              x="10"
                              y="15"
                              width="10"
                              height="10"
                              fill="#167EB4"
                            ></rect>{" "}
                            <rect
                              x="20"
                              y="15"
                              width="10"
                              height="10"
                              fill="#32A9E7"
                            ></rect>{" "}
                            <rect
                              x="20"
                              y="5"
                              width="10"
                              height="10"
                              fill="#58D9FD"
                            ></rect>{" "}
                            <mask
                              id="mask0_87_7742"
                              maskUnits="userSpaceOnUse"
                              x="8"
                              y="14"
                              width="24"
                              height="16"
                            >
                              {" "}
                              <path
                                d="M8 14H30C31.1046 14 32 14.8954 32 16V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V14Z"
                                fill="url(#paint1_linear_87_7742)"
                              ></path>{" "}
                            </mask>{" "}
                            <g mask="url(#mask0_87_7742)">
                              {" "}
                              <path
                                d="M32 14V18H30V14H32Z"
                                fill="#135298"
                              ></path>{" "}
                              <path
                                d="M32 30V16L7 30H32Z"
                                fill="url(#paint2_linear_87_7742)"
                              ></path>{" "}
                              <path
                                d="M8 30V16L33 30H8Z"
                                fill="url(#paint3_linear_87_7742)"
                              ></path>{" "}
                            </g>{" "}
                            <path
                              d="M8 12C8 10.3431 9.34315 9 11 9H17C18.6569 9 20 10.3431 20 12V24C20 25.6569 18.6569 27 17 27H8V12Z"
                              fill="#000000"
                              fill-opacity="0.3"
                            ></path>{" "}
                            <rect
                              y="7"
                              width="18"
                              height="18"
                              rx="2"
                              fill="url(#paint4_linear_87_7742)"
                            ></rect>{" "}
                            <path
                              d="M14 16.0693V15.903C14 13.0222 11.9272 11 9.01582 11C6.08861 11 4 13.036 4 15.9307V16.097C4 18.9778 6.07278 21 9 21C11.9114 21 14 18.964 14 16.0693ZM11.6424 16.097C11.6424 18.0083 10.5665 19.1579 9.01582 19.1579C7.46519 19.1579 6.37342 17.9806 6.37342 16.0693V15.903C6.37342 13.9917 7.44937 12.8421 9 12.8421C10.5348 12.8421 11.6424 14.0194 11.6424 15.9307V16.097Z"
                              fill="white"
                            ></path>{" "}
                            <defs>
                              {" "}
                              <linearGradient
                                id="paint0_linear_87_7742"
                                x1="10"
                                y1="16"
                                x2="30"
                                y2="16"
                                gradientUnits="userSpaceOnUse"
                              >
                                {" "}
                                <stop stop-color="#064484"></stop>{" "}
                                <stop offset="1" stop-color="#0F65B5"></stop>{" "}
                              </linearGradient>{" "}
                              <linearGradient
                                id="paint1_linear_87_7742"
                                x1="8"
                                y1="26.7692"
                                x2="32"
                                y2="26.7692"
                                gradientUnits="userSpaceOnUse"
                              >
                                {" "}
                                <stop stop-color="#1B366F"></stop>{" "}
                                <stop offset="1" stop-color="#2657B0"></stop>{" "}
                              </linearGradient>{" "}
                              <linearGradient
                                id="paint2_linear_87_7742"
                                x1="32"
                                y1="23"
                                x2="8"
                                y2="23"
                                gradientUnits="userSpaceOnUse"
                              >
                                {" "}
                                <stop stop-color="#44DCFD"></stop>{" "}
                                <stop
                                  offset="0.453125"
                                  stop-color="#259ED0"
                                ></stop>{" "}
                              </linearGradient>{" "}
                              <linearGradient
                                id="paint3_linear_87_7742"
                                x1="8"
                                y1="23"
                                x2="32"
                                y2="23"
                                gradientUnits="userSpaceOnUse"
                              >
                                {" "}
                                <stop stop-color="#259ED0"></stop>{" "}
                                <stop offset="1" stop-color="#44DCFD"></stop>{" "}
                              </linearGradient>{" "}
                              <linearGradient
                                id="paint4_linear_87_7742"
                                x1="0"
                                y1="16"
                                x2="18"
                                y2="16"
                                gradientUnits="userSpaceOnUse"
                              >
                                {" "}
                                <stop stop-color="#064484"></stop>{" "}
                                <stop offset="1" stop-color="#0F65B5"></stop>{" "}
                              </linearGradient>{" "}
                            </defs>{" "}
                          </g>
                        </svg>
                        Outlook
                      </Button>
                    </div>
                  </Field>

                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => auth.setMode("sign-up")}
                      className="hover:text-foreground underline-offset-4 hover:underline"
                    >
                      Sign up
                    </Button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
