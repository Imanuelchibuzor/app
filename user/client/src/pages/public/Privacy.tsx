import {
  FileText,
  User,
  FileUser,
  Scale,
  Share2,
  Shield,
  ShieldCheck,
  Lightbulb,
  Link,
  RefreshCw,
  Mail,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const icons = {
  FileText,
  User,
  FileUser,
  Scale,
  Share2,
  Shield,
  ShieldCheck,
  Lightbulb,
  Link,
  RefreshCw,
  Mail,
};

type Toc = {
  id: string;
  title: string;
};

type PrivacySection = {
  id: string;
  icon: keyof typeof icons;
  title: string;
  content: React.ReactNode;
};

function AccordionSection({ id, icon, title, content }: PrivacySection) {
  const Icon = icons[icon];
  return (
    <AccordionItem
      id={id}
      value={id}
      className="border rounded-lg px-6 bg-card"
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-semibold">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-foreground/80 leading-relaxed pt-4">
        {content}
      </AccordionContent>
    </AccordionItem>
  );
}

const TermsPage = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const toc: Toc[] = [
    { id: "information", title: "The Information We Collect" },
    { id: "use", title: "How We Use Your Information" },
    { id: "basis", title: "Legal Basis for Processing (GDPR/NDPR Compliance)" },
    { id: "sharing", title: "Data Sharing and Disclosure" },
    { id: "retention", title: "Data Retention" },
    { id: "security", title: "Data Security" },
    { id: "rights", title: "Your Rights" },
    { id: "links", title: "Third-Party Links" },
    { id: "updates", title: "Updates to This Policy" },
    { id: "contact", title: "Contact Information" },
  ];

  const sections: PrivacySection[] = [
    {
      id: "information",
      icon: "User",
      title: "1. The Information We Collect",
      content: (
        <p>
          When you sign in using either your name and email, Google, or
          Microsoft, we only receive your name and email address.
        </p>
      ),
    },
    {
      id: "use",
      icon: "FileUser",
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="mb-3">We use the collected information to:</p>
          <ul className="ml-4 space-y-3 list-disc list-inside">
            <li>Create and manage your user account</li>
            <li>Provide access to our services and features</li>
            <li>
              Communicate with you about important updates or support issues
            </li>
            <li>Ensure account security and prevent unauthorized access</li>
          </ul>
          <p className="mt-3">
            We do <span className="font-bold">not</span> sell, rent, or trade
            your personal information.
          </p>
        </>
      ),
    },
    {
      id: "basis",
      icon: "Scale",
      title: "3. Legal Basis for Processing (GDPR/NDPR Compliance)",
      content: (
        <>
          <p className="mb-3">
            We process your personal data based on one or more of the following
            legal grounds:
          </p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>
              <span className="font-bold">Consent:</span> You voluntarily
              provide your data by signing in.
            </li>
            <li>
              <span className="font-bold">Legal Interest:</span> To manage your
              account and maintain platform security.
            </li>
            <li>
              <span className="font-bold">Legal Obligation:</span> When required
              to comply with applicable laws.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      icon: "Share2",
      title: "4. Data Sharing and Disclosure",
      content: (
        <>
          <p className="mb-3">
            We may share your information only in the following cases:
          </p>
          <ul className="ml-4 space-y-3 list-disc list-inside">
            <li>
              <span className="font-bold">With service providers:</span> Such as
              Google and Microsoft, to facilitate authentication.
            </li>
            <li>
              <span className="font-bold">For legal reasons:</span> If required
              by law, court order, or government regulation.
            </li>
            <li>
              <span className="font-bold">For security purposes:</span> To
              detect and prevent fraud or unauthorized access.
            </li>
          </ul>
          <p className="mt-3">
            We do <span className="font-bold">not</span> share your information
            with advertisers or unrelated third parties.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      icon: "Shield",
      title: "5. Data Retention",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            We retain your personal data only as long as necessary to provide
            our services or as required by law.
          </li>
          <li>
            If you delete your account, we will remove your personal information
            from our systems within a reasonable timeframe.
          </li>
        </ul>
      ),
    },
    {
      id: "security",
      icon: "ShieldCheck",
      title: "6. Data Security",
      content: (
        <p>
          We implement industry-standard security measures to protect your
          personal information from loss, misuse, or unauthorized access.
          However, we do not guarantee absolute security.
        </p>
      ),
    },
    {
      id: "rights",
      icon: "Lightbulb",
      title: "7. Your Rights",
      content: (
        <>
          <p className="mb-3">
            Depending on your location, you have the right to:
          </p>
          <ul className="ml-4 space-y-3 list-disc list-inside">
            <li>Access and request a copy of your personal data</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw your consent at any time</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p className="mt-3">
            To exercise your rights, you can contact us using the details below.
          </p>
        </>
      ),
    },
    {
      id: "links",
      icon: "Link",
      title: "8. Third Party Links",
      content: (
        <p>
          Our platform may contain links to external websites. We are not
          responsible for the privacy practices or content of those sites.
        </p>
      ),
    },
    {
      id: "updates",
      icon: "RefreshCw",
      title: "9. Updates to This Policy",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>We may update this Privacy Policy occasionally.</li>
          <li>
            When we do, we will revise the “Last Updated” date above and, if
            necessary, notify users through the website.
          </li>
        </ul>
      ),
    },
    {
      id: "contact",
      icon: "Mail",
      title: "10. Contact Information",
      content: (
        <p>
          If you have questions or requests about this Privacy Policy, please
          contact us via the Contact page on the Platform.
        </p>
      ),
    },
  ];

  return (
    <section id="main-content">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Saerv Privacy Policy
            </h1>
          </div>
          <div className="flex flex-col gap-2 text-foreground/80">
            <p className="text-sm">
              <span className="font-semibold">Effective / Last Updated:</span>{" "}
              October 17, 2025
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent>
            <p className="text-foreground leading-relaxed">
              Welcome to our platform (&quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;). We value your privacy and are committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and protect your data when you use our
              website or services. By accessing or using our platform, you agree
              to this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground/80">
              Table of Contents
            </h2>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              {toc.map((i) => {
                return (
                  <li key={i.id}>
                    <span
                      className="cursor-pointer hover:underline hover:underline-offset-2"
                      onClick={() => scrollToSection(i.id)}
                    >
                      {i.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        {/* Accordion Sections */}
        <Accordion type="multiple" className="space-y-4">
          {sections.map((section) => (
            <AccordionSection key={section.id} {...section} />
          ))}
        </Accordion>

        {/* Footer */}
        <Card className="mt-8 bg-muted/50">
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              By using Saerv, you acknowledge that you have read, understood,
              and accept these privacy policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TermsPage;
