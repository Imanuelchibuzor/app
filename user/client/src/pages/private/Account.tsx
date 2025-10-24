import { useEffect, useState } from "react";

import {
  CreditCard,
  User,
  Edit2,
  X,
  Check,
  AlertCircle,
  Landmark,
  CircleCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type BankAccount = {
  code: string;
  name: string;
  number: string;
};

type Bank = {
  code: string;
  name: string;
};

export default function AccountPage() {
  const { axios, checkUser } = useAuth();

  const [banks, setBanks] = useState<Bank[]>([]);
  const [userAccount, setUserAccount] = useState<BankAccount | null>();
  const [fetching, setFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [openBankSelect, setOpenBankSelect] = useState(false);

  // Edit form state
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState(null);
  const [validationStatus, setValidationStatus] = useState<
    "valid" | "invalid" | null
  >(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      setFetching(true);

      try {
        const { data } = await axios.get("/merchant/list-banks");
        setBanks(data.banks);
      } catch (err) {
        let message = "Something went wrong. Please try again.";
        if (err instanceof AxiosError && err.response) {
          message = err.response.data.message || err.response.data.errors;
        }
        toast.error(message);
      } finally {
        setFetching(false);
      }
    };

    fetchBanks();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
      setFetching(true);

      try {
        const { data } = await axios.get("/merchant/fetch-account");

        if (data.success) setUserAccount(data.account);
        else toast.error(data.message);
      } catch (err) {
        let message = "Something went wrong. Please try again.";
        if (err instanceof AxiosError && err.response) {
          message = err.response.data.message || err.response.data.errors;
        }
        toast.error(message);
      } finally {
        setFetching(false);
      }
    };

    fetchAccount();
    // eslint-disable-next-line
  }, []);

  const handleEditClick = () => {
    // Pre-fill form with existing data
    if (userAccount) {
      setSelectedBank(userAccount.code);
      setAccountNumber(userAccount.number);
      setAccountName(userAccount.name);
      setValidationStatus("valid");
    } else {
      setSelectedBank("");
      setAccountNumber("");
      setAccountName("");
      setValidationStatus(null);
    }
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    // Check if there are unsaved changes
    const hasChanges =
      selectedBank !== userAccount?.code ||
      accountNumber !== (userAccount?.number || "");

    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    setIsEditing(false);
    setSelectedBank("");
    setAccountNumber("");
    setAccountName("");
    setValidationStatus(null);
  };

  const handleContinue = () => {
    setShowDiscardDialog(false);
  };

  const verifyAccount = async (number: string, code: string) => {
    if (number.length !== 10 || !code) return;
    setIsValidating(true);

    try {
      const { data } = await axios.post("/merchant/verify-account", {
        number,
        code,
      });
      if (data.success) {
        setVerifiedAccount(data.info);
        setValidationStatus("valid");
      } else {
        setVerifiedAccount(null);
        setValidationStatus("invalid");
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err instanceof AxiosError && err.response) {
        message = err.response.data.message || err.response.data.errors;
      }
      toast.error(message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleAccountNumberChange = (value: string) => {
    // Only allow digits and max 10 characters
    const sanitized = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(sanitized);
    setAccountName("");

    // Trigger validation when 10 digits are entered
    if (sanitized.length === 10 && selectedBank) {
      verifyAccount(sanitized, selectedBank);
    }
  };

  const handleSaveAccount = async () => {
    if (!verifiedAccount) return;
    setIsSaving(true);

    try {
      const { data } = await axios.post("/merchant/save-account", {
        code: selectedBank,
        number: accountNumber,
      });

      if (data.success) {
        setUserAccount(data.account);
        setIsEditing(false);
        setVerifiedAccount(null);
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err instanceof AxiosError && err.response) {
        message = err.response.data.message || err.response.data.errors;
      }
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="container mx-auto max-w-2xl p-2 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl">Edit Bank Account</CardTitle>
              <CardDescription className="mt-1.5">
                Update your bank account information for withdrawals
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseEdit}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bank">Bank Name</Label>
              <Popover open={openBankSelect} onOpenChange={setOpenBankSelect}>
                <PopoverTrigger asChild>
                  <Button
                    id="bank"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openBankSelect}
                    className="w-full justify-between bg-transparent"
                  >
                    {selectedBank ? (
                      <span className="flex items-center gap-2">
                        <Landmark className="h-4 w-4" />
                        {banks.find((bank) => bank?.code === selectedBank)
                          ?.name || ""}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Select a bank
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search banks..." />
                    <CommandList>
                      <CommandEmpty>No bank found.</CommandEmpty>
                      <CommandGroup>
                        {banks.map((bank) => (
                          <CommandItem
                            key={bank.name}
                            value={bank.name}
                            onSelect={() => {
                              setSelectedBank(bank.code);
                              setOpenBankSelect(false);
                              // Re-validate if account number is already 10 digits
                              if (accountNumber.length === 10) {
                                verifyAccount(accountNumber, bank.code);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedBank === bank.code
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {bank.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Account Number */}
            <div className="space-y-2 text-sm">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                inputMode="numeric"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                maxLength={10}
              />
              <p className="text-muted-foreground">
                {accountNumber.length}/10 digits
              </p>
            </div>

            {/* Account Validation Status */}
            {isValidating && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 ">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">
                  Validating account...
                </span>
              </div>
            )}

            {validationStatus === "valid" && accountName && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3">
                <CircleCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  {accountName}
                </p>
              </div>
            )}

            {validationStatus === "invalid" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Account not found
                </p>
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSaveAccount}
              disabled={
                !selectedBank ||
                accountNumber.length !== 10 ||
                validationStatus !== "valid" ||
                isValidating ||
                isSaving
              }
              className="w-full"
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : userAccount ? (
                "Update Account"
              ) : (
                "Add Account"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Discard Changes Dialog */}
        <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Discard changes?</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to discard them?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleContinue}>
                Continue Editing
              </Button>
              <Button variant="destructive" onClick={handleDiscard}>
                Discard Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-2 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bank Account</CardTitle>
          <CardDescription>
            Manage your bank account information for receiving payments
          </CardDescription>
        </CardHeader>
        {fetching && <Skeleton className="h-60 w-full" />}
        {!fetching && (
          <CardContent className="space-y-6">
            {userAccount ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Landmark className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1 font-medium">
                      <p className="text-sm  text-muted-foreground">
                        Bank Name
                      </p>
                      <p className="text-base">
                        {banks.find((bank) => bank?.code === userAccount.code)
                          ?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1 font-medium">
                      <p className="text-sm text-muted-foreground">
                        Account Name
                      </p>
                      <p className="text-base">{userAccount.name || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1 font-medium">
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p className="text-base">{userAccount.number || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleEditClick} className="w-full">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Account
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Landmark className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    No bank account set
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Add your bank account information to start receiving
                    withdrawals
                  </p>
                </div>

                <Button onClick={handleEditClick} className="w-full">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Add Bank Account
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
