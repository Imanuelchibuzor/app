import {
  FileText,
  Shield,
  UserCheck,
  BookOpen,
  AlertTriangle,
  Copyright,
  Users,
  CreditCard,
  Wallet,
  RefreshCw,
  Bot,
  ShieldAlert,
  XCircle,
  Scale,
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
  Shield,
  UserCheck,
  BookOpen,
  AlertTriangle,
  Copyright,
  Users,
  CreditCard,
  Wallet,
  RefreshCw,
  Bot,
  ShieldAlert,
  XCircle,
  Scale,
  Mail,
};

type Toc = {
  id: string;
  title: string;
};

type TermSection = {
  id: string;
  icon: keyof typeof icons;
  title: string;
  content: React.ReactNode;
};

function AccordionSection({ id, icon, title, content }: TermSection) {
  const Icon = icons[icon];
  return (
    <AccordionItem
      id={id}
      value={id}
      className="border rounded-lg px-3 bg-card"
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
    { id: "definitions", title: "Definitions" },
    { id: "acceptance", title: "Acceptance of Terms & Changes" },
    { id: "registration", title: "Account Registration & Security" },
    { id: "products", title: "Product Listing and Approval Process" },
    {
      id: "responsibilities",
      title: "User Responsibilities & Prohibited Activities",
    },
    { id: "ownership", title: "Content Ownership & Intellectual Property" },
    { id: "affiliate", title: "Affiliate Program" },
    { id: "subscriptions", title: "Subscriptions & Billing" },
    { id: "withdrawals", title: "Withdrawals & Payouts" },
    { id: "refunds", title: "Refunds & Cancellations" },
    { id: "ai-review", title: "AI Review Limitations" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "termination", title: "Termination & Suspension" },
    { id: "governing-law", title: "Governing Law & Dispute Resolution" },
    { id: "contact", title: "Contact Information" },
  ];

  const sections: TermSection[] = [
    {
      id: "definitions",
      icon: "FileText",
      title: "1. Definitions",
      content: (
        <>
          <p className="mb-3">For convenience:</p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>
              <span className="font-semibold text-foreground">"Vendor"</span>{" "}
              means a user who lists or sells digital products on the Platform.
            </li>
            <li>
              <span className="font-semibold text-foreground">"Affiliate"</span>{" "}
              means a user who promotes vendor products via an affiliate link.
            </li>
            <li>
              <span className="font-semibold text-foreground">"Products"</span>{" "}
              means digital goods listed for sale on the Platform.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "acceptance",
      icon: "Shield",
      title: "2. Acceptance of Terms & Changes",
      content: (
        <p>
          By accessing or using the Platform you accept and agree to these
          Terms. We may revise these Terms at any time. For material changes we
          will provide in-platform notice. Continued use after changes
          constitutes acceptance of the revised Terms.
        </p>
      ),
    },
    {
      id: "registration",
      icon: "UserCheck",
      title: "3. Account Registration & Security",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            When creating an account you represent and warrant that all
            information you provide is accurate, current, and complete.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account.
          </li>
          <li>
            You must notify Saerv immediately of any unauthorized use of your
            account or any other breach of security.
          </li>
          <li>
            We may suspend or terminate accounts that contain false, fraudulent,
            or inactive information, or that otherwise violate these Terms.
          </li>
          <li>
            We implement reasonable security measures but cannot guarantee
            absolute protection against unauthorized access.
          </li>
        </ul>
      ),
    },

    {
      id: "products",
      icon: "BookOpen",
      title: "4. Product Listing & Approval Process",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            Vendors may submit digital products for listing. Submissions are
            subject to an AI-assisted review and manual moderation to verify
            authenticity and compliance with Platform policies.
          </li>
          <li>
            Products must not contain illegal content, materially harmful
            content, explicit adult content (unless specifically permitted and
            properly labeled under Platform rules), or copyrighted or
            trademarked material without authorization.
          </li>
          <li>
            If a product is rejected, we will notify the vendor and provide the
            reason for rejection.
          </li>
          <li>
            Saerv reserves the right to remove or disable access to any product
            at any time if it violates these Terms or applicable law, even after
            approval.
          </li>
        </ul>
      ),
    },
    {
      id: "responsibilities",
      icon: "AlertTriangle",
      title: "5. User Responsibilities & Prohibited Activities",
      content: (
        <>
          <p className="mb-3">Users must not:</p>
          <ul className="space-y-2 list-disc list-inside ml-4">
            <li>
              Post or submit harmful, fraudulent, misleading, or illegal
              content.
            </li>
            <li>
              Use automated tools, bots, or scripts to scrape, mine, or
              otherwise interfere with the Platform.
            </li>
            <li>
              Impersonate any person or organization or falsely claim an
              affiliation.
            </li>
            <li>
              Upload content that infringes third-party intellectual property or
              any other rights.
            </li>
          </ul>
          <p className="mt-3">
            Violations may result in removal of content, account suspension, or
            termination.
          </p>
        </>
      ),
    },
    {
      id: "ownership",
      icon: "Copyright",
      title: "6. Content Ownership & Intellectual Property",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            Saerv retains ownership of the Platform, including its code, design,
            and functionality (excluding user content).
          </li>
          <li>
            By submitting content, vendors grant Saerv a non-exclusive,
            worldwide, royalty-free license to use, reproduce, distribute, and
            display that content as reasonably required to operate and promote
            the Platform.
          </li>
          <li>
            Vendors retain ownership of their products but must ensure they do
            not infringe third-party rights.
          </li>
        </ul>
      ),
    },
    {
      id: "affiliate",
      icon: "Users",
      title: "7. Affiliate Program",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            Users may join the affiliate program and promote products using
            unique affiliate links.
          </li>
          <li>
            Commissions are calculated based on vendor-set rates and are
            credited to the affiliate&apos;s in-platform wallet after a
            successful, qualifying transaction, subject to Platform rules and
            verification.
          </li>
        </ul>
      ),
    },
    {
      id: "subscriptions",
      icon: "CreditCard",
      title: "8. Subscription & Billing",
      content: (
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="font-semibold text-foreground mb-2">
              Saerv offers three subscription tiers:
            </p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li>
                <span className="font-semibold">Starter</span> — Free
              </li>
              <li>
                <span className="font-semibold">Pro</span> — ₦1,000/month
              </li>
              <li>
                <span className="font-semibold">Premium</span> — ₦10,000/month
              </li>
            </ul>
          </div>
          <ul className="space-y-3 list-disc list-inside">
            <li>
              We may add, remove, or change plans, features, and prices;
              material changes will be communicated in-app.
            </li>
            <li>
              By subscribing to a paid plan you authorize Saerv (and its payment
              processor) to charge your chosen payment method for recurring
              subscription fees and any applicable taxes or fees. Billing is in
              Naira (₦) unless otherwise stated.
            </li>
            <li>
              Recurring billing continues until you cancel or we terminate the
              subscription. Subscription charges are non-refundable except as
              required by law or the Platform&apos;s refund policy.
            </li>
            <li>
              If a renewal attempt fails, the account may be downgraded to
              Starter. Downgrades take effect at the end of the current paid
              period unless otherwise specified. You retain access to paid
              features until the paid period ends.
            </li>
            <li>
              Existing affiliate promotions and commissions earned prior to a
              downgrade will be honored according to Platform rules. After
              downgrading to Starter, merchants may be restricted from creating
              new promotions or publishing products beyond Starter limits. If a
              merchant has more published products or active promotions than
              Starter permits at the time of downgrade, withdrawals may be
              restricted until the subscription is upgraded.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "withdrawals",
      icon: "Wallet",
      title: "9. Withdrawals & Payouts",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            Withdrawals require account setup and verification. Minimum
            withdrawal amounts and per-plan withdrawal fees apply; these are
            shown in-app. (Platform and payout processing fees are included in
            the stated per-plan fee.)
          </li>
          <li>
            Payouts are processed in Naira (₦) and paid to the merchant&apos;s
            connected bank account.
          </li>
          <li>
            Pro and Premium subscribers receive payouts instantly (within
            minutes); Starter subscribers are paid on Fridays. Withdrawal
            requests submitted after 23:59 (UTC) on Thursday are processed in
            the next Friday payout cycle.
          </li>
          <li>
            International vendors may receive payouts only if they have an
            eligible Nigerian bank account or other supported payout method as
            listed in-app.
          </li>
          <li>
            Taxes on earnings are the user&apos;s responsibility; Saerv does not
            withhold income or sales taxes.
          </li>
        </ul>
      ),
    },
    {
      id: "refunds",
      icon: "RefreshCw",
      title: "10. Refunds & Cancellations",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            Sales are final unless a refund is approved under the
            Platform&apos;s refund policy (for example, where a product is
            defective or materially misrepresented).
          </li>
          <li>
            Refund requests must be submitted within 14 days of purchase and
            include sufficient evidence to support the claim.
          </li>
          <li>
            Saerv reserves sole discretion to approve or deny refund requests in
            accordance with Platform policies.
          </li>
        </ul>
      ),
    },
    {
      id: "ai-review",
      icon: "Bot",
      title: "11. AI Review Limitations",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            Our AI-assisted review tools screen content for explicit material,
            trademark/copyright issues, and other policy violations but are not
            infallible.
          </li>
          <li>
            Saerv disclaims liability for errors or omissions in AI review.
            Vendors remain responsible for ensuring that their products comply
            with applicable laws and Platform policies.
          </li>
        </ul>
      ),
    },
    {
      id: "liability",
      icon: "ShieldAlert",
      title: "12. Limitation of Liability",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            To the maximum extent permitted by law, Saerv and its affiliates are
            not liable for indirect, incidental, special, or consequential
            damages arising from use of, or inability to use, the Platform.
          </li>
          <li>
            Where liability cannot be excluded by law, it is limited to the
            maximum extent permitted by applicable law and jurisdiction.
          </li>
        </ul>
      ),
    },
    {
      id: "termination",
      icon: "XCircle",
      title: "13. Termination & Suspension",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>
            Saerv may suspend or terminate accounts, content, or access at any
            time for violations of these Terms or for harmful activities, with
            or without prior notice.
          </li>
          <li>
            Upon termination, licenses granted under these Terms terminate and
            the user must cease use of the Platform.
          </li>
        </ul>
      ),
    },
    {
      id: "governing-law",
      icon: "Scale",
      title: "14. Governing Law & Dispute Resolution",
      content: (
        <ul className="space-y-3 list-disc list-inside">
          <li>These Terms are governed by the laws of Nigeria.</li>
          <li>
            Disputes will be resolved through binding arbitration under the
            rules of a recognized arbitration body or in the courts of Nigeria,
            in accordance with applicable law.
          </li>
        </ul>
      ),
    },
    {
      id: "contact",
      icon: "Mail",
      title: "15. Contact Information",
      content: (
        <p>
          If you have questions about these Terms, please contact us via the
          Contact page on the Platform.
        </p>
      ),
    },
  ];

  return (
    <section id="main-content">
      <div className="container mx-auto px-2 md:px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground">
              Terms & Conditions
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
              <span className="font-semibold">
                Please read these Terms and Conditions (&quot;Terms&quot;)
                carefully.
              </span>{" "}
              By accessing or using Saerv (the &quot;Platform&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to
              be bound by these Terms. If you do not agree, do not use the
              Platform.
            </p>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground/80">
              Table of Contents
            </h2>
            <ol className="space-y-2 list-decimal list-inside">
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
            <p className="text-muted-foreground text-center">
              By using Saerv, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and Conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TermsPage;
