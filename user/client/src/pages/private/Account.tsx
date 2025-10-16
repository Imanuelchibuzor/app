import { useState } from "react";
import {
  CreditCard,
  User,
  Edit2,
  X,
  Check,
  AlertCircle,
  Landmark,
  CircleCheck,
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

// Mock Nigerian banks data
const NIGERIAN_BANKS = [
  { code: "044", name: "Access Bank" },
  { code: "063", name: "Access Bank (Diamond)" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "070", name: "Fidelity Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "214", name: "First City Monument Bank" },
  { code: "058", name: "Guaranty Trust Bank" },
  { code: "030", name: "Heritage Bank" },
  { code: "301", name: "Jaiz Bank" },
  { code: "082", name: "Keystone Bank" },
  { code: "526", name: "Parallex Bank" },
  { code: "076", name: "Polaris Bank" },
  { code: "101", name: "Providus Bank" },
  { code: "221", name: "Stanbic IBTC Bank" },
  { code: "068", name: "Standard Chartered Bank" },
  { code: "232", name: "Sterling Bank" },
  { code: "100", name: "Suntrust Bank" },
  { code: "032", name: "Union Bank of Nigeria" },
  { code: "033", name: "United Bank For Africa" },
  { code: "215", name: "Unity Bank" },
  { code: "035", name: "Wema Bank" },
  { code: "057", name: "Zenith Bank" },
];

interface BankAccount {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export default function AccountPage() {
  // Mock user account data - replace with actual data fetching
  const [userAccount, setUserAccount] = useState<BankAccount | null>();
  //   {
  //   bankName: "Guaranty Trust Bank",
  //   bankCode: "058",
  //   accountNumber: "0123456789",
  //   accountName: "John Doe",
  // }

  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [openBankSelect, setOpenBankSelect] = useState(false);

  // Edit form state
  const [selectedBank, setSelectedBank] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    "valid" | "invalid" | null
  >(null);

  const handleEditClick = () => {
    // Pre-fill form with existing data
    if (userAccount) {
      setSelectedBank({
        code: userAccount.bankCode,
        name: userAccount.bankName,
      });
      setAccountNumber(userAccount.accountNumber);
      setAccountName(userAccount.accountName);
      setValidationStatus("valid");
    } else {
      setSelectedBank(null);
      setAccountNumber("");
      setAccountName("");
      setValidationStatus(null);
    }
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    // Check if there are unsaved changes
    const hasChanges =
      selectedBank?.name !== userAccount?.bankName ||
      accountNumber !== (userAccount?.accountNumber || "");

    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleDiscard = () => {
    setShowDiscardDialog(false);
    setIsEditing(false);
    setSelectedBank(null);
    setAccountNumber("");
    setAccountName("");
    setValidationStatus(null);
  };

  const handleContinue = () => {
    setShowDiscardDialog(false);
  };

  const validateAccount = async (accNumber: string, bankCode: string) => {
    if (accNumber.length !== 10 || !bankCode) return;

    setIsValidating(true);
    setValidationStatus(null);

    // Simulate API call to validate account
    // Replace with actual API call to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - in production, call your backend API
    const isValid = Math.random() > 0.3; // 70% success rate for demo

    if (isValid) {
      setAccountName("John Doe"); // Replace with actual account name from API
      setValidationStatus("valid");
    } else {
      setAccountName("");
      setValidationStatus("invalid");
    }

    setIsValidating(false);
  };

  const handleAccountNumberChange = (value: string) => {
    // Only allow digits and max 10 characters
    const sanitized = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(sanitized);
    setValidationStatus(null);
    setAccountName("");

    // Trigger validation when 10 digits are entered
    if (sanitized.length === 10 && selectedBank) {
      validateAccount(sanitized, selectedBank.code);
    }
  };

  const handleSaveAccount = () => {
    if (!selectedBank || !accountNumber || validationStatus !== "valid") return;

    // Save account information
    const newAccount: BankAccount = {
      bankName: selectedBank.name,
      bankCode: selectedBank.code,
      accountNumber,
      accountName,
    };

    setUserAccount(newAccount);
    setIsEditing(false);

    // Here you would typically make an API call to save the account
    console.log("[v0] Saving account:", newAccount);
  };

  if (isEditing) {
    return (
      <div className="container mx-auto max-w-2xl p-4 md:p-6">
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
                        {selectedBank.name}
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
                        {NIGERIAN_BANKS.map((bank) => (
                          <CommandItem
                            key={bank.code}
                            value={bank.name}
                            onSelect={() => {
                              setSelectedBank(bank);
                              setOpenBankSelect(false);
                              // Re-validate if account number is already 10 digits
                              if (accountNumber.length === 10) {
                                validateAccount(accountNumber, bank.code);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedBank?.code === bank.code
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
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                inputMode="numeric"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                maxLength={10}
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground">
                {accountNumber.length}/10 digits
              </p>
            </div>

            {/* Account Validation Status */}
            {isValidating && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">
                  Validating account...
                </span>
              </div>
            )}

            {validationStatus === "valid" && accountName && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3">
                <CircleCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Account verified
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {accountName}
                  </p>
                </div>
              </div>
            )}

            {validationStatus === "invalid" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Account not found
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Please check the account number and try again
                  </p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSaveAccount}
              disabled={
                !selectedBank ||
                accountNumber.length !== 10 ||
                validationStatus !== "valid" ||
                isValidating
              }
              className="w-full"
            >
              {userAccount ? "Update Account" : "Add Account"}
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
    <div className="container mx-auto max-w-2xl p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bank Account</CardTitle>
          <CardDescription>
            Manage your bank account information for receiving payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userAccount ? (
            <>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Bank Name
                    </p>
                    <p className="text-base font-semibold">
                      {userAccount.bankName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Account Name
                    </p>
                    <p className="text-base font-semibold">
                      {userAccount.accountName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Account Number
                    </p>
                    <p className="font-mono text-base font-semibold">
                      {userAccount.accountNumber}
                    </p>
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
      </Card>
    </div>
  );
}
