import Link from "next/link";
import { ArrowLeft, ExternalLink, HeartHandshake } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  lessonsCreatedThisMonth,
  monthlyCosts,
  monthlyDonations,
} from "@/lib/support-config";

const donationUrl = process.env.NEXT_PUBLIC_MERCADOPAGO_DONATION_URL?.trim();
const donationProgress = Math.min(
  100,
  Math.max(0, monthlyCosts > 0 ? (monthlyDonations / monthlyCosts) * 100 : 0),
);

function formatClp(value: number) {
  return `$${new Intl.NumberFormat("es-CL").format(value)}`;
}

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-6 md:px-8 md:py-8">
        <Link
          href="/student/dashboard"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <header className="max-w-3xl">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HeartHandshake className="size-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Support the project
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
            Support Bright Bytes
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Bright Bytes is free to use. If you&apos;d like to help us keep the
            platform running, you can support the project here.
          </p>
        </header>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">This month at a glance</CardTitle>
            <CardDescription>
              A simple look at the learning we create and the costs your support helps cover.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Lessons created this month</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{lessonsCreatedThisMonth}</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Spent this month</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">
                {formatClp(monthlyCosts)} <span className="text-sm font-medium text-muted-foreground">CLP</span>
              </p>
            </div>
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-muted-foreground">Donations this month</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">
                {formatClp(monthlyDonations)} <span className="text-sm font-medium text-muted-foreground">/ {formatClp(monthlyCosts)} CLP</span>
              </p>
              <Progress
                value={donationProgress}
                className="mt-4"
                aria-label={`${Math.round(donationProgress)}% of monthly costs covered`}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round(donationProgress)}% of this month&apos;s costs covered
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardContent className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold">Make a contribution</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                You&apos;ll continue securely on Mercado Pago. Bright Bytes does not collect or store your banking details.
              </p>
            </div>
            {donationUrl ? (
              <a
                href={donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "lg", className: "w-full gap-2 px-6 sm:w-auto" })}
              >
                Donate with Mercado Pago <ExternalLink />
              </a>
            ) : (
              <div className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" disabled>
                  Donate with Mercado Pago
                </Button>
                <p className="mt-2 text-xs text-muted-foreground sm:text-right">
                  The donation link is not available yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mx-auto max-w-2xl pb-2 text-center text-xs leading-5 text-muted-foreground">
          Every contribution helps cover hosting, infrastructure and the tools used to keep Bright Bytes available. Thank you for supporting the project.
        </p>
      </div>
    </main>
  );
}