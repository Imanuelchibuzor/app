import React, { useEffect, useMemo, useState } from "react";
import { Languages, X } from "lucide-react";

import { Button } from "./ui/button";

const LanguageModal: React.FC = () => {
  const [language, setLanguage] = useState<string>("en");
  const [languageModalOpen, setLanguageModalOpen] = useState<boolean>(false);

  const languages = useMemo(
    () => [
      { name: "English", code: "en" },
      { name: "French", code: "fr" },
      { name: "German", code: "de" },
      { name: "Italian", code: "it" },
      { name: "Portuguese", code: "pt" },
      { name: "Spanish", code: "es" },
    ],
    []
  );

  useEffect(() => {
    // log the selected language object for debugging
    console.log(languages.find((lang) => lang.code === language));
  }, [language, languages]);

  // close on Escape
  useEffect(() => {
    if (!languageModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLanguageModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [languageModalOpen]);

  const currentLanguageName =
    languages.find((l) => l.code === language)?.name ?? "English";

  return (
    <>
      {/* Modal */}
      {languageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
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
            onClick={(e) => e.stopPropagation()} // prevent backdrop click
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
              {languages.map((lang) => (
                <Button
                  variant="ghost"
                  key={lang.code}
                  type="button"
                  className="text-left justify-start"
                  onClick={() => {
                    setLanguage(lang.code); // store code
                    setLanguageModalOpen(false);
                  }}
                >
                  <span>{lang.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {lang.code}
                  </span>
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
