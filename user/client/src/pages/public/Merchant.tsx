import {
  Activity,
  Bot,
  Check as CheckIcon,
  CircleQuestionMark,
  Globe,
  Share2,
} from "lucide-react";

// shadcn components (assumes your project has these at these paths)
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Benefit = {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const benefits: Benefit[] = [
  {
    title: "AI Review System",
    description:
      "Fast, reliable product approvals powered by intelligent review models.",
    Icon: Bot,
  },
  {
    title: "Affiliate Program",
    description:
      "Let affiliates promote your products — or join as an affiliate and earn by promoting others.",
    Icon: Share2,
  },
  {
    title: "Live Dashboard",
    description: "Monitor sales, conversions, and earnings from anywhere.",
    Icon: Activity,
  },
  {
    title: "For Everyone",
    description:
      "Solo creators, digital agencies, and affiliates — Saerv makes selling seamless.",
    Icon: Globe,
  },
];

const plans = [
  {
    name: "Starter",
    price: "₦0",
    period: "/ month",
    isPopular: false,
    features: [
      "Add up to 5 products",
      "Allow up to 10 promoted products",
      "Minimum withdrawal: ₦2,500",
      "Platform fee on withdrawal: 10% (of withdrawn amount)",
      "Payout timeline: every Friday",
    ],
    buttonText: "Start Free",
  },
  {
    name: "Pro",
    price: "₦1,000",
    period: "/ month",
    isPopular: true,
    features: [
      "Add up to 25 products",
      "Allow up to 50 promoted products",
      "Minimum withdrawal: ₦1,000",
      "Platform fee on withdrawal: 10% (of withdrawn amount)",
      "Payout timeline: instant (within minutes)",
    ],
    buttonText: "Get Pro",
  },
  {
    name: "Premium",
    price: "₦10,000",
    period: "/ month",
    isPopular: false,
    features: [
      "Unlimited product listings",
      "Unlimited promotions",
      "Minimum withdrawal: ₦1,000",
      "Platform fee on withdrawal: 5% (of withdrawn amount)",
      "Payout timeline: instant (within minutes)",
    ],
    buttonText: "Get Premium",
  },
];

const faqs = [
  {
    q: "What happens if a subscription payment fails?",
    a: "If a subscription renewal fails, your account will be automatically downgraded to the Starter plan.",
  },
  {
    q: "If I cancel my subscription, when does the downgrade take effect?",
    a: "You keep access to your current plan until the end of the paid period. After the paid period ends, your account is automatically set to Starter.",
  },
  {
    q: "If I downgrade my plan, what happens to my listings and promotions?",
    a: "Your existing listings and promotions remain active, but you won’t be able to publish new products or create new promotions beyond the limits of the lower plan.",
  },
  {
    q: "Can I withdraw money if my listings/promotions exceed my current plan limits?",
    a: "Withdrawals will be disabled if your account exceeds the limits of your current plan. You must upgrade to a plan that covers your current listings and promotions to re-enable withdrawals.",
  },
  {
    q: "Is there a refund policy for subscriptions?",
    a: "Subscription fees are generally non-refundable except where required by law or at Saerv’s discretion. Please contact support for special cases.",
  },
];

function FAQItem({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((f, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border-b border-muted-foreground/20 last:border-b-0"
        >
          <AccordionTrigger className="flex items-center py-4 text-left font-medium text-lg hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer">
            <span className="text-foreground/80">{f.q}</span>
          </AccordionTrigger>

          <AccordionContent className="text-base text-muted-foreground py-3">
            {f.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const MerchantPage = () => {
  const handleSubscriptionClick = (planName: string) => {
    // wire this to your subscription flow
    console.log(`Attempting to subscribe to ${planName}`);
  };

  return (
    <main className="min-h-screen p-2 md:p-6 sm:p-10 bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-16 lg:space-y-20">
        <header className="text-center" aria-labelledby="merchant-title">
          <h1
            id="merchant-title"
            className="text-3xl md:text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-foreground"
          >
            Start Selling or Promoting on{" "}
            <span className="text-primary">Saerv</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Whether you're a creator or an affiliate, Saerv gives you everything
            you need to sell eBooks, templates, guides and more. Join today, and
            start earning.
          </p>
        </header>

        <section aria-labelledby="why-join-heading" className="space-y-6">
          <h2
            id="why-join-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground"
          >
            Why Join Us?
          </h2>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none"
            aria-hidden={false}
          >
            {benefits.map((b) => (
              <li key={b.title} className="h-full">
                <Card
                  className={
                    "h-full flex flex-col rounded-xl p-6 shadow-sm transform-gpu transition-transform duration-200 hover:shadow-md hover:scale-105 focus-within:scale-105 bg-card border"
                  }
                  tabIndex={
                    0
                  } /* make card keyboard-focusable for focus styling */
                >
                  <CardHeader className="p-0 mb-3 flex justify-center">
                    <div className="p-3 rounded-full bg-muted inline-flex items-center justify-center">
                      <b.Icon className="w-6 h-6" aria-hidden />
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 text-center flex-1 flex flex-col items-center justify-start">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {b.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="plans-heading" className="space-y-4 pt-8">
          <h2
            id="plans-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground"
          >
            Ready to join?
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-6">
            Choose the plan that fits your needs.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <article
                key={plan.name}
                aria-labelledby={`plan-${plan.name}`}
                tabIndex={0}
                className={`flex flex-col rounded-xl border p-6 shadow-sm transform-gpu transition-transform duration-200 hover:shadow-md focus-within:scale-105 hover:scale-105 ${
                  plan.isPopular
                    ? "scale-105 border-primary/70 bg-card"
                    : "bg-card"
                }`}
              >
                <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-center">
                    <h3
                      id={`plan-${plan.name}`}
                      className="text-2xl font-bold tracking-tight text-foreground"
                    >
                      {plan.name}
                    </h3>
                    {plan.isPopular && (
                      <Badge className="uppercase" aria-hidden>
                        Popular
                      </Badge>
                    )}
                  </div>

                  <p className="mt-2">
                    <span className="text-3xl font-extrabold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-lg font-medium text-muted-foreground">
                      {plan.period}
                    </span>
                  </p>

                  <ul
                    className="space-y-3 mt-6 pb-6 border-b border-muted-foreground"
                    aria-label={`${plan.name} features`}
                  >
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckIcon
                          className="flex-shrink-0 w-5 h-5 text-primary mt-1 mr-2"
                          aria-hidden
                        />
                        <span className="text-base text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => handleSubscriptionClick(plan.name)}
                    className="w-full"
                    aria-label={`${plan.buttonText} for ${plan.name}`}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="faq-heading"
          className="pt-12 pb-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-10">
            <CircleQuestionMark className="w-6 h-6" />
            <h2
              id="faq-heading"
              className="text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground"
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="rounded-xl p-6 shadow-lg border bg-card">
            <FAQItem faqs={faqs} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default MerchantPage;
