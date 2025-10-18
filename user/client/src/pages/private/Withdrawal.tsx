import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RequestWithdrawal() {
  // Mock data - replace with actual data from your backend
  const [listings] = useState(4); // Example: 6 listings
  const [promotions] = useState(3); // Example: 3 promotions
  const availableBalance = 50000; // Example balance in Naira

  const [amount, setAmount] = useState("");
  const [showUpgradeDialog] = useState(listings > 5 || promotions > 5);
  // const [showUpgradeDialog, setShowUpgradeDialog] = useState(
  //   listings > 5 || promotions > 5
  // );

  // Calculate fees and final amount
  const enteredAmount = Number.parseFloat(amount) || 0;
  const platformFee = enteredAmount * 0.1;
  const amountToReceive = enteredAmount - platformFee;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle withdrawal submission
    console.log("Withdrawal requested:", {
      amount: enteredAmount,
      platformFee,
      amountToReceive,
    });
  };

  const handleUpgrade = () => {
    // Navigate to upgrade page
    console.log("Navigate to upgrade page");
  };

  const handleGoBack = () => {
    // Navigate back
    window.history.back();
  };

  // Show upgrade dialog if limits exceeded
  if (showUpgradeDialog) {
    return (
      <Dialog open={showUpgradeDialog} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">
              Withdrawal Disabled
            </DialogTitle>
            <DialogDescription className="text-center">
              Withdrawal has been disabled because your listings or promotions
              are greater than the limit. Kindly upgrade account to Pro plan to
              enable withdrawals.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-muted bg-muted/50 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Listings:</span>
                <span className="font-semibold">{listings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Current Promotions:
                </span>
                <span className="font-semibold">{promotions}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Free Plan Limit:</span>
                <span className="font-semibold">5 each</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="w-full sm:w-auto bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={handleUpgrade} className="w-full sm:w-auto">
              <TrendingUp className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Request Withdrawal</h1>
        <p className="text-muted-foreground">
          Withdraw your earnings to your bank account
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            ₦{availableBalance.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Details</CardTitle>
          <CardDescription>
            Enter the amount you wish to withdraw
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                className="text-lg"
              />
              {enteredAmount > availableBalance && (
                <p className="text-sm text-destructive">
                  Amount exceeds available balance
                </p>
              )}
            </div>

            {enteredAmount > 0 && (
              <div className="space-y-3 rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Withdrawal Amount
                  </span>
                  <span className="font-semibold">
                    ₦{enteredAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Platform Fee (10%)
                  </span>
                  <span className="font-semibold text-destructive">
                    -₦{platformFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-semibold">Amount to be Received</span>
                  <span className="text-lg font-semibold">
                    ₦{amountToReceive.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                !amount ||
                enteredAmount <= 0 ||
                enteredAmount > availableBalance
              }
            >
              Submit Withdrawal Request
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-6 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Withdrawal requests should be made latest by Thursday 23:59 (West
            African Time) to avoid carry over to the next payout cycle.
          </p>
        </div>
      </div>
    </section>
  );
}
