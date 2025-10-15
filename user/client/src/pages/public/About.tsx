import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen p-6 sm:p-10 bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-20 lg:space-y-24">
        {/* Hero Section */}
        <header className="text-center pb-6" aria-labelledby="merchant-title">
          <h1
            id="merchant-title"
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-foreground text-balance"
          >
            <span className="text-primary">Saerv</span> - Global Platform For
            Digital Publications
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            For creators, affiliates, and buyers — simple publishing, fair
            payouts, and delightful discovery.
          </p>
        </header>

        {/* Belief & Mission Section */}
        <section
          aria-labelledby="belief-mission-heading"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          <h2 id="belief-mission-heading" className="sr-only">
            Our Belief and Mission
          </h2>

          <div className="border bg-card p-8 rounded-xl shadow-sm">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary px-4 py-2 text-sm font-medium rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 mr-2" aria-hidden="true" /> Our
              Belief
            </Badge>
            <p className="text-base text-muted-foreground md:text-lg leading-relaxed text-pretty">
              Great work shouldn't hide behind barriers. Talented creators
              deserve visibility, and collaboration creates opportunities that
              amplify success for everyone involved.
            </p>
          </div>

          <div className="border bg-card p-8 rounded-xl shadow-sm">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary px-4 py-2 text-sm font-medium rounded-full mb-6"
            >
              <Globe className="h-4 w-4 mr-2" aria-hidden="true" /> Our Mission
            </Badge>
            <p className="text-base text-muted-foreground md:text-lg leading-relaxed text-pretty">
              Build a global platform that simplifies selling, amplifies
              promotion, and gives buyers a safe way to discover digital
              publications — with fair pricing and transparent payouts.
            </p>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section aria-labelledby="problem-solution-heading">
          <div className="text-center mb-12">
            <h2
              id="problem-solution-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance"
            >
              Problems We Solve
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              We bridge the gaps between creators, promoters, and buyers with
              practical solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Card 1: Creators */}
            <article>
              <Card className="h-full bg-card transform-gpu transition-transform duration-200 hover:scale-105">
                <CardContent className="p-8 space-y-6 text-center">
                  <div className="flex-shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-7 w-7 text-primary" aria-hidden />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      For Creators
                    </h3>

                    <div className="space-y-6 text-left">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          The Problem
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          Creators make excellent products but struggle to sell
                          or promote them effectively.
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-primary mb-1">
                          Our Solution
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          Publish fast with full control over distribution.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>

            {/* Card 2: Promoters */}
            <article>
              <Card className="h-full bg-card transform-gpu transition-transform duration-200 hover:scale-105">
                <CardContent className="p-8 space-y-6 text-center">
                  <div className="flex-shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <TrendingUp className="h-7 w-7 text-primary" aria-hidden />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      For Promoters
                    </h3>

                    <div className="space-y-6 text-left">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          The Problem
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          Promoters excel at distribution but can't easily find
                          quality digital products to promote.
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-primary mb-1">
                          Our Solution
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          Find quality products and generate shareable affiliate
                          assets in one click.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>

            {/* Card 3: Buyers & Platform */}
            <article>
              <Card className="h-full bg-card transform-gpu transition-transform duration-200 hover:scale-105">
                <CardContent className="p-8 space-y-6 text-center">
                  <div className="flex-shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="h-7 w-7 text-primary" aria-hidden />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      For Buyers
                    </h3>

                    <div className="space-y-6 text-left">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          The Problem
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          Many marketplaces are clunky, unfriendly, or make
                          purchases and access needlessly complex.
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-primary mb-1">
                          Our Solution
                        </p>
                        <p className="text-base text-foreground leading-relaxed">
                          Find curated products, pay securely, and access
                          purchases instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-card border border-border p-10 text-center shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-card-foreground md:text-2xl text-balance">
                  Ready to publish or promote digital publications?
                </h2>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Join creators and promoters who are already growing their
                  reach.
                </p>
                <Button
                  size="lg"
                  className="mt-2"
                  onClick={() => navigate("/merchant")}
                >
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="rounded-2xl bg-muted/50 border border-border p-10 text-center shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl text-balance">
                  Just exploring? Discover digital publications on Saerv.
                </h2>
                <p className="text-muted-foreground mb-6 text-pretty">
                  Browse curated content from talented creators worldwide.
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="mt-2 bg-transparent"
                  onClick={() => navigate("/")}
                >
                  Browse Publications
                  <ShoppingCart className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;
