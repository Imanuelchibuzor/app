"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
              Saerv — global platform for digital publications.
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl lg:text-2xl text-pretty">
              For creators, affiliates, and buyers of digital publications.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          aria-hidden="true"
        />
      </section>

      {/* Belief Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Our belief
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
              Great work shouldn't hide. Talent shouldn't be shelved away.
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl text-pretty">
              Saerv creates synergy — connecting creators who make digital
              publications (eBooks, templates, guides) with affiliates who want
              to promote them, and the buyers who want them — while removing the
              platform friction that gets in the way.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              The problem we solve
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Creators can make excellent products but struggle to sell or
                    promote them.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Promoters are great at distribution but can't easily find
                    high-quality digital products to promote.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Many marketplaces are clunky, unfriendly to creators, or
                    make promotion and payouts needlessly complex.
                  </p>
                </CardContent>
              </Card>
            </div>
            <p className="mt-8 text-center text-lg font-medium text-foreground">
              These gaps waste time, money, and opportunity. Saerv bridges them.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Globe className="h-4 w-4" aria-hidden="true" />
              Our mission
            </div>
            <p className="text-lg text-muted-foreground md:text-xl leading-relaxed text-pretty">
              To build a global, creator-first platform that simplifies selling,
              amplifies promotion, and gives buyers a safe, delightful way to
              discover and purchase digital publications — all while keeping
              pricing fair and payouts transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Synergy Section */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              How we create synergy
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Zap className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                    Creators
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Publish fast and control distribution (download vs
                    access-only).
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Users
                      className="h-7 w-7 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                    Promoters
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Generate shareable affiliate assets and unique links in one
                    click.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <ShoppingCart
                      className="h-7 w-7 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-card-foreground">
                    Buyers
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Find curated products, pay securely, and access purchases
                    instantly.
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="mt-8 text-center text-muted-foreground">
              Saerv handles review, conversion tracking, and payouts so every
              role benefits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-card p-8 text-center md:p-12">
                <h2 className="mb-4 text-xl font-bold text-card-foreground md:text-2xl text-balance">
                  Ready to publish or promote digital publications?
                </h2>
                <Button size="lg" className="mt-4">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <div className="rounded-2xl bg-muted/50 p-8 text-center md:p-12">
                <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl text-balance">
                  Just exploring? Discover digital publications on Saerv.
                </h2>
                <Button
                  size="lg"
                  variant="outline"
                  className="mt-4 bg-transparent"
                >
                  Browse Publications
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
