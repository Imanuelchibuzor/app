import React, { useEffect, useState } from "react";
import { Languages, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import languages from "../data/language.json";

const LanguageModal: React.FC = () => {
  const [language, setLanguage] = useState<string>("en");
  const [languageModalOpen, setLanguageModalOpen] = useState<boolean>(false);

  // close on Escape
  useEffect(() => {
    if (!languageModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLanguageModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [languageModalOpen]);

  const currentLanguageName = languages[language as keyof typeof languages];

  const handleSelect = (code: string) => {
    setLanguage(code); // store code
    setLanguageModalOpen(false);
    toast.info("This feature is not available yet.");
  };

  return (
    <>
      {/* Modal */}
      {languageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300"
          aria-hidden={!languageModalOpen}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setLanguageModalOpen(false)}
          />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select language"
            className="relative border bg-background rounded-lg p-6 w-96 max-w-[90vw] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Language</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguageModalOpen(false)}
                aria-label="Close language selector"
              >
                <X />
              </Button>
            </div>

            <p className="text-muted-foreground mb-4">
              Choose your preferred language
            </p>

            <div className="space-y-1 space-x-2 grid grid-cols-2 gap-4">
              {Object.entries(languages).map(([code, name]) => (
                <Button
                  variant="ghost"
                  key={code}
                  type="button"
                  className="text-left justify-start"
                  onClick={() => handleSelect(code)}
                >
                  <span>{name}</span>
                  <span className="text-muted-foreground text-sm">{code}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trigger */}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setLanguageModalOpen(true)}>
          <Languages />
        </Button>

        <span className="block text-sm text-muted-foreground">
          {currentLanguageName}
        </span>
      </div>
    </>
  );
};

export default LanguageModal;
