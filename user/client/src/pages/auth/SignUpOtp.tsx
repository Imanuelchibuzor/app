import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/auth";
import handleError from "@/utils/handleError";

const SignUpOtp = ({
  className,
  ...props
}: React.ComponentProps<typeof Card>) => {
  const navigate = useNavigate();
  const { axios, loading, setLoading, setUser } = useAuth();

  const email = localStorage.getItem("email");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setTimer(60);

    setLoading(true);

    try {
      const { data } = await axios.post("/auth/resend-otp", {
        email,
        language: "en",
      });

      if (data.success) {
        toast.success(data.message);
        setTimer(60);
      } else toast.error(data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = () => {
    const newErrors: Record<string, string> = {};
    if (otp.length < 6) newErrors.otp = "Verification code must be 6 digits.";
    if (!otp.trim()) newErrors.otp = "Verification code is required.";
    if (isNaN(Number(otp)))
      newErrors.otp = "Verification code must be a number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp()) return;

    setLoading(true);

    try {
      const { data } = await axios.post("/auth/verify-email", {
        email,
        otp: Number(otp),
      });

      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("email");
        setUser(data.user);
        navigate("/");
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
        <Card {...props}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <KeyRound className="size-6 text-rose-600" />
            </div>
            <CardTitle className="text-2xl">Enter verification code</CardTitle>
            <CardDescription>
              We sent a 6-digit code to{" "}
              <span className="font-semibold">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <FieldGroup className="flex flex-col items-center justify-center">
                  <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                  <InputOTP maxLength={6} id="otp" onChange={setOtp} required>
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {errors.otp && (
                    <p id="name-error" className="text-sm text-destructive">
                      {errors.otp}
                    </p>
                  )}
                </FieldGroup>
                <FieldGroup>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive the code?
                    {timer > 0 ? (
                      <span className="text-sm text-muted-foreground">
                        {" "}
                        Resend in {String(timer).padStart(2, "0")}s
                      </span>
                    ) : (
                      <span
                        className="text-sm text-foreground cursor-pointer"
                        onClick={handleResend}
                      >
                        {" "}
                        Resend
                      </span>
                    )}
                  </FieldDescription>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpOtp;
