"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Landmark,
  Loader2,
  AlertCircle,
  Edit2,
  X,
  ChevronDown,
  CheckCircle2,
  Check,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MOCK_BANKS = [
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

const mockAPI = {
  fetchBanks: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { banks: MOCK_BANKS };
  },

  fetchAccount: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Return null for new users or existing account data
    const hasExistingAccount = Math.random() > 0.5;
    if (hasExistingAccount) {
      return {
        success: true,
        account: {
          code: "058",
          number: "0123456789",
          name: "John Doe",
        },
      };
    }
    return { success: false };
  },

  verifyAccount: async (accountNumber: string, bankCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate verification
    if (accountNumber.length === 10) {
      return {
        info: {
          name: "John Doe",
          accountNumber,
          bankCode,
        },
      };
    }
    throw new Error("Account not found");
  },

  saveAccount: async (accountCode: string, accountNumber: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      account: {
        code: accountCode,
        number: accountNumber,
        name: "John Doe",
      },
    };
  },
};

const translations = {
  setup_account_header: "Account Setup",
  setup_account_header_note:
    "Add your bank account details to receive payments",
  bank: "Bank",
  acct_name: "Account Name",
  acct_number: "Account Number",
  select_bank: "Select a bank",
  search_banks: "Search banks...",
  no_banks_found: "No banks found",
  enter_here: "Enter account number",
  setup_account: "Setup Account",
  edit_account: "Edit Account",
  save_account_button: "Save Account",
  update_acct_button: "Update Account",
  cancel_text: "Cancel",
  discard_text: "Discard",
  warn_discard_changes: "Discard Changes?",
  discard_changes_note:
    "You have unsaved changes. Are you sure you want to discard them?",
  error_fetch_bank: "Failed to load banks",
  error_fetch_account: "Failed to load account",
  error_acct_not_found:
    "Account not found. Please check the details and try again.",
  acct_save_success: "Account saved successfully!",
  error_save_acct: "Failed to save account",
};

export default function AccountSetup() {
  const debounceTimeoutRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [fetching, setFetching] = useState(false);
  const [banks, setBanks] = useState<typeof MOCK_BANKS>([]);
  const [showBanks, setShowBanks] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState<{
    name: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [existingAccount, setExistingAccount] = useState<{
    code: string;
    number: string;
    name: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setFetching(true);
        const data = await mockAPI.fetchBanks();
        setBanks(data.banks);
      } catch (err) {
        console.error("Failed to load banks:", err);
        showToast(translations.error_fetch_bank, "error");
      } finally {
        setFetching(false);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
      setFetching(true);
      try {
        const data = await mockAPI.fetchAccount();
        if (data.success) setExistingAccount(data.account ?? null);
      } catch (err) {
        console.error("Fetch Account Error:", err);
        showToast(translations.error_fetch_account, "error");
      } finally {
        setFetching(false);
      }
    };
    fetchAccount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowBanks(false);
        setBankSearch("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showBanks) {
        setShowBanks(false);
        setBankSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showBanks]);

  useEffect(() => {
    if (accountNumber.length < 10) setVerifiedAccount(null);
  }, [accountNumber]);

  const maskAccountNumber = (num: string) => {
    if (!num) return "";
    const last = num.slice(-4);
    return last.padStart(num.length, "*");
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (existingAccount) {
      setSelectedCode(existingAccount.code);
      setAccountNumber(existingAccount.number);
    }
    setVerifiedAccount(null);
    setError("");
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setAccountNumber(value);
      setError("");
    }
  };

  const handleCancel = () => {
    if (verifiedAccount) {
      setShowConfirmation(true);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    if (existingAccount) {
      setSelectedCode(existingAccount.code);
      setAccountNumber(existingAccount.number);
    } else {
      setSelectedCode("");
      setAccountNumber("");
    }
    setVerifiedAccount(null);
    setBankSearch("");
    setError("");
  };

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleVerify = useCallback(async () => {
    setError("");
    setIsVerifying(true);
    setVerifiedAccount(null);

    try {
      const data = await mockAPI.verifyAccount(accountNumber, selectedCode);
      if (data) setVerifiedAccount(data.info);
    } catch (err) {
      console.error("Verify Error:", err);
      setError(translations.error_acct_not_found);
    } finally {
      setIsVerifying(false);
    }
  }, [selectedCode, accountNumber]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (selectedCode && accountNumber.length === 10) {
      debounceTimeoutRef.current = setTimeout(() => {
        handleVerify();
      }, 500);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [accountNumber, selectedCode, handleVerify]);

  const handleSave = async () => {
    if (!verifiedAccount) return;
    setIsSaving(true);

    try {
      const data = await mockAPI.saveAccount(selectedCode, accountNumber);
      if (data.success) {
        setExistingAccount(data.account);
        setIsEditing(false);
        setVerifiedAccount(null);
        showToast(translations.acct_save_success, "success");
      } else {
        showToast(translations.error_save_acct, "error");
      }
    } catch (err) {
      showToast(translations.error_save_acct, "error");
      console.error("Save Error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <Card className="border-border shadow-lg">
          {/* Header */}
          <CardHeader className="bg-primary text-primary-foreground text-center space-y-2 rounded-t-lg">
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-balance">
              {translations.setup_account_header}
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 text-pretty">
              {translations.setup_account_header_note}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 lg:p-10">
            {fetching && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
              </div>
            )}

            {!fetching && existingAccount && !isEditing ? (
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-6 h-6 text-primary" />
                      <CardTitle className="text-lg">Account Details</CardTitle>
                    </div>
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {translations.bank}
                      </p>
                      <p className="mt-1 text-sm text-foreground capitalize">
                        {banks.find(
                          (bank) => bank.code === existingAccount?.code
                        )?.name ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {translations.acct_name}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {existingAccount.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {translations.acct_number}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {maskAccountNumber(existingAccount.number)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              !fetching && (
                <Card className="border-border shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">
                          {isEditing
                            ? translations.edit_account
                            : translations.setup_account}
                        </CardTitle>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <form
                      className="space-y-6"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      {/* Bank Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="bank">{translations.bank}</Label>
                        <div className="relative w-full" ref={dropdownRef}>
                          <Button
                            type="button"
                            onClick={() => setShowBanks((prev) => !prev)}
                            variant="outline"
                            className="w-full justify-between font-normal"
                            aria-haspopup="true"
                            aria-expanded={showBanks}
                          >
                            <span
                              className={`truncate ${
                                selectedCode
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {selectedCode
                                ? banks.find(
                                    (bank) => bank.code === selectedCode
                                  )?.name
                                : translations.select_bank}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                                showBanks ? "rotate-180" : ""
                              }`}
                            />
                          </Button>

                          {showBanks && (
                            <div className="absolute z-10 top-full mt-2 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                              <Card className="border-border shadow-lg">
                                <CardContent className="p-0">
                                  <div className="p-3 border-b border-border">
                                    <div className="relative">
                                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                      <Input
                                        type="text"
                                        placeholder={translations.search_banks}
                                        value={bankSearch}
                                        onChange={(e) =>
                                          setBankSearch(e.target.value)
                                        }
                                        className="pl-9"
                                        autoFocus
                                      />
                                    </div>
                                  </div>
                                  <div className="max-h-60 overflow-auto">
                                    {filteredBanks.length > 0 ? (
                                      <div className="py-1">
                                        {filteredBanks.map((bank) => (
                                          <button
                                            key={bank.code}
                                            type="button"
                                            onClick={() => {
                                              setSelectedCode(bank.code);
                                              setError("");
                                              setVerifiedAccount(null);
                                              setShowBanks(false);
                                              setBankSearch("");
                                            }}
                                            className={`flex w-full justify-between px-4 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left ${
                                              selectedCode === bank.code
                                                ? "bg-accent text-accent-foreground"
                                                : "text-foreground"
                                            }`}
                                          >
                                            <span className="truncate pr-2">
                                              {bank.name}
                                            </span>
                                            {selectedCode === bank.code && (
                                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="px-4 py-8 text-sm text-muted-foreground text-center">
                                        {translations.no_banks_found}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">
                          {translations.acct_number}
                        </Label>
                        <Input
                          type="text"
                          id="accountNumber"
                          value={accountNumber}
                          onChange={handleAccountNumberChange}
                          placeholder={translations.enter_here}
                          maxLength={10}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          {accountNumber.length} / 10
                        </p>
                      </div>

                      {isVerifying && (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                      )}

                      {/* Verified Account Banner */}
                      {verifiedAccount && (
                        <div className="rounded-lg border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-sm text-green-700 dark:text-green-400">
                              {verifiedAccount.name}
                            </p>
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-destructive" />
                            <p className="text-sm text-destructive">{error}</p>
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      {verifiedAccount && (
                        <Button
                          type="button"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="w-full"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : isEditing ? (
                            translations.update_acct_button
                          ) : (
                            translations.save_account_button
                          )}
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{translations.warn_discard_changes}</DialogTitle>
            <DialogDescription>
              {translations.discard_changes_note}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              {translations.cancel_text}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirmation(false);
                resetForm();
              }}
            >
              {translations.discard_text}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <Card
            className={`border shadow-lg ${
              toast.type === "success"
                ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20"
                : "border-destructive/50 bg-destructive/10"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {toast.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                <p
                  className={`text-sm font-medium ${
                    toast.type === "success"
                      ? "text-green-700 dark:text-green-400"
                      : "text-destructive"
                  }`}
                >
                  {toast.message}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
