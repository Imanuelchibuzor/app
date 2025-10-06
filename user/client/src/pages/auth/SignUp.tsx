import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

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

const SignUp = ({ className, ...props }: React.ComponentProps<typeof Card>) => {
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
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </Field>
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
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" required />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirm-password" type="password" required />
                </Field>
                <FieldDescription>
                  By creating and account you agree to our{" "}
                  <Link to={"/terms"}>Term of Service</Link>.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <Button type="submit">Create Account</Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-primary hover:bg-rose-100/50 hover:text-primary"
                    >
                      <FaGoogle /> Continue with Google
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account?{" "}
                      <Link to={"/sign-in"} className="font-medium">
                        Sign in
                      </Link>
                    </FieldDescription>
                  </Field>
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
