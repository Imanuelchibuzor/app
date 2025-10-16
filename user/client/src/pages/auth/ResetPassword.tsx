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
import { ShieldCheck } from "lucide-react";

const ResetPassword = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
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
                  <Input id="new-password" type="password" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmed-password">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirmed-password" type="password" required />
                </Field>
                <Field>
                  <Button type="submit">Reset Password</Button>
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
