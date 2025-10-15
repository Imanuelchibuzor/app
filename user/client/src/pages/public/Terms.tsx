import React, { useState, useRef, useEffect } from "react";

// === Icon Components (Emulating Lucide/Shadcn Icons) ===

/** Icon for the Header */
const ScrollText = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 10s-5 0-5 3 2 5 5 5 5-2 5-5-2-3-5-3z" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" />
    <path d="M12 2v20" />
    <path d="M2 12h20" />
  </svg>
);

/** Icon for Chevron Down (Accordion) */
const ChevronDown = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// === Reusable Components ===

// Utility to generate unique IDs for ARIA attributes
let idCounter = 0;
const generateId = (prefix) => `${prefix}-${idCounter++}`;

/**
 * Custom Accordion Component (mimicking shadcn/ui functionality)
 */
const Accordion = ({ title, children, sectionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const headerId = generateId("header");
  const panelId = generateId("panel");

  // Reset ID counter for predictable rendering on re-runs
  useEffect(() => {
    idCounter = 0;
  }, []);

  return (
    <div className="border-b border-gray-200">
      <h2 id={headerId} className="w-full">
        <button
          className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="text-lg">{title}</span>
          <ChevronDown
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-180 text-indigo-600" : "rotate-0"
            }`}
          />
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={`overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          maxHeight: isOpen
            ? `${contentRef.current ? contentRef.current.scrollHeight : 0}px`
            : "0px",
        }}
      >
        <div
          ref={contentRef}
          className="px-4 pb-6 pt-2 text-gray-700 text-base leading-relaxed"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// === Terms Content Data ===

const termsData = [
  {
    id: "definitions",
    title: "1. Definitions",
    content: (
      <>
        <p className="mb-2">For convenience:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            **“Vendor”** means a user who lists or sells digital products on the
            Platform.
          </li>
          <li>
            **“Affiliate”** means a user who promotes vendor products via an
            affiliate link.
          </li>
          <li>
            **“Products”** means digital goods listed for sale on the Platform.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "acceptance",
    title: "2. Acceptance of Terms & Changes",
    content: (
      <>
        <p>
          By accessing or using the Platform you accept and agree to these Terms
          and our Privacy Policy. We may revise these Terms at any time. For
          material changes we will provide in-platform notice. Continued use
          after changes constitutes acceptance of the revised Terms.
        </p>
      </>
    ),
  },
  {
    id: "registration",
    title: "3. Account Registration & Security",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
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
    id: "listing",
    title: "4. Product Listing & Approval Process",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          Vendors may submit digital products for listing. Submissions are
          subject to an AI-assisted review and manual moderation to verify
          authenticity and compliance with Platform policies.
        </li>
        <li>
          Products must not contain illegal content, materially harmful content,
          explicit adult content (unless specifically permitted and properly
          labeled under Platform rules), or copyrighted or trademarked material
          without authorization.
        </li>
        <li>
          If a product is rejected, we will notify the vendor and provide the
          reason for rejection.
        </li>
        <li>
          Saerv reserves the right to remove or disable access to any product at
          any time if it violates these Terms or applicable law, even after
          approval.
        </li>
      </ul>
    ),
  },
  {
    id: "responsibilities",
    title: "5. User Responsibilities & Prohibited Activities",
    content: (
      <>
        <p className="mb-2">Users must not:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            Post or submit harmful, fraudulent, misleading, or illegal content.
          </li>
          <li>
            Use automated tools, bots, or scripts to scrape, mine, or otherwise
            interfere with the Platform.
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
        <p className="mt-2">
          Violations may result in removal of content, account suspension, or
          termination.
        </p>
      </>
    ),
  },
  {
    id: "ownership",
    title: "6. Content Ownership & Intellectual Property",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          Saerv retains ownership of the Platform, including its code, design,
          and functionality (excluding user content).
        </li>
        <li>
          By submitting content, vendors grant Saerv a non-exclusive, worldwide,
          royalty-free license to use, reproduce, distribute, and display that
          content as reasonably required to operate and promote the Platform.
        </li>
        <li>
          Vendors retain ownership of their products but must ensure they do not
          infringe third-party rights.
        </li>
      </ul>
    ),
  },
  {
    id: "affiliate",
    title: "7. Affiliate Program",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          Users may join the affiliate program and promote products using unique
          affiliate links.
        </li>
        <li>
          Commissions are calculated based on vendor-set rates and are credited
          to the affiliate’s in-Platform wallet after a successful, qualifying
          transaction, subject to Platform rules and verification.
        </li>
      </ul>
    ),
  },
  {
    id: "billing",
    title: "8. Subscriptions & Billing",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          Saerv offers subscription tiers (displayed in-app and subject to
          change): Starter — ₦0/month, Pro — ₦1,000/month, Premium —
          ₦10,000/month. We may add, remove, or change plans, features, and
          prices; material changes will be communicated in-app.
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
          required by law or the Platform’s refund policy.
        </li>
        <li>
          If a renewal attempt fails, the account may be downgraded to Starter.
          Downgrades take effect at the end of the current paid period unless
          otherwise specified. You retain access to paid features until the paid
          period ends.
        </li>
        <li>
          Existing affiliate promotions and commissions earned prior to a
          downgrade will be honored according to Platform rules. After
          downgrading to Starter, merchants may be restricted from creating new
          promotions or publishing products beyond Starter limits. If a merchant
          has more published products or active promotions than Starter permits
          at the time of downgrade, withdrawals may be restricted until the
          subscription is upgraded or otherwise reconciled.
        </li>
      </ul>
    ),
  },
  {
    id: "payouts",
    title: "9. Withdrawals & Payouts",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          Withdrawals require account setup and verification. Minimum withdrawal
          amounts and per-plan withdrawal fees apply; these are shown in-app.
          (Platform and payout processing fees are included in the stated
          per-plan fee.)
        </li>
        <li>
          Payouts are processed in Naira (₦) and paid to the merchant’s
          connected bank account.
        </li>
        <li>
          Processing schedule: Pro and Premium subscribers receive payouts
          instantly (within minutes); Starter subscribers are paid on Fridays.
          Withdrawal requests submitted after 23:59 (UTC) on Thursday are
          processed in the next Friday payout cycle.
        </li>
        <li>
          International vendors may receive payouts only if they have an
          eligible Nigerian bank account or other supported payout method as
          listed in-app.
        </li>
        <li>
          Taxes on earnings are the user’s responsibility; Saerv does not
          withhold income or sales taxes unless legally required.
        </li>
      </ul>
    ),
  },
  {
    id: "refunds",
    title: "10. Refunds & Cancellations",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          Sales are final unless a refund is approved under the Platform’s
          refund policy (for example, where a product is defective or materially
          misrepresented).
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
    title: "11. AI Review Limitations",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
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
    title: "12. Limitation of Liability",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          To the maximum extent permitted by law, Saerv and its affiliates are
          not liable for indirect, incidental, special, or consequential damages
          arising from use of, or inability to use, the Platform.
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
    title: "13. Termination & Suspension",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          Saerv may suspend or terminate accounts, content, or access at any
          time for violations of these Terms or for harmful activities, with or
          without prior notice.
        </li>
        <li>
          Upon termination, licenses granted under these Terms terminate and the
          user must cease use of the Platform.
        </li>
      </ul>
    ),
  },
  {
    id: "governing-law",
    title: "14. Governing Law & Dispute Resolution",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>These Terms are governed by the laws of Nigeria.</li>
        <li>
          Disputes will be resolved through binding arbitration under the rules
          of a recognized arbitration body or in the courts of Nigeria, in
          accordance with applicable law.
        </li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "15. Contact Information",
    content: (
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>
          If you have questions about these Terms, please contact us via the
          Contact page on the Platform.
        </li>
      </ul>
    ),
  },
];

// === Main Terms and Conditions Component ===

const TermsAndConditionsPage = () => {
  const tableOfContentsRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);

  // Set up intersection observers for scroll tracking and TOC highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -50% 0px", // When the section reaches the middle of the viewport
        threshold: 0.5,
      }
    );

    termsData.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* === Left Column: Sticky Table of Contents (TOC) === */}
        <nav
          ref={tableOfContentsRef}
          className="lg:w-1/4 sticky top-4 self-start bg-white p-6 rounded-xl shadow-lg border border-gray-200 hidden lg:block"
          aria-label="Table of Contents"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
            Contents
          </h2>
          <ul className="space-y-2 text-sm">
            {termsData.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left transition-colors duration-150 p-1 rounded-md ${
                    activeSection === item.id
                      ? "text-indigo-600 font-bold bg-indigo-50 border-l-4 border-indigo-600 pl-3"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-100 pl-3"
                  }`}
                >
                  {item.title.split(". ")[1] || item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* === Right Column: Main Terms Content === */}
        <main className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 lg:p-12 border border-gray-200">
            {/* Header */}
            <header className="text-center mb-10">
              <ScrollText className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
                Saerv — Terms and Conditions
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Effective / Last updated: **October 15, 2025**
              </p>
              <div className="border border-indigo-200 bg-indigo-50 p-4 rounded-lg text-indigo-800 font-medium">
                <p>
                  Please read these Terms and Conditions ("Terms") carefully. By
                  accessing or using Saerv (the “Platform”, “we”, “us”, or
                  “our”), you agree to be bound by these Terms and our Privacy
                  Policy. If you do not agree, do not use the Platform.
                </p>
              </div>
            </header>

            {/* Accordion Sections */}
            <div className="mt-8 space-y-2" role="list">
              {termsData.map((item, index) => (
                <div
                  key={item.id}
                  id={item.id}
                  className="accordion-section-target scroll-mt-20"
                >
                  <Accordion
                    title={item.title}
                    sectionId={item.id}
                    // Open the first section by default for initial visibility
                    defaultOpen={index === 0}
                  >
                    {item.content}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
