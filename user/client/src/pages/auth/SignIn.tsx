import { Link } from "react-router-dom";

import { cn } from "../../libs/utils";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";

const Login = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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
                  <Button type="submit">Login</Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-primary hover:bg-rose-100/50 hover:text-primary"
                  >
                    <FaGoogle /> Continue with Google
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up" className="font-medium">
                      Sign up
                    </Link>
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

export default Login;
