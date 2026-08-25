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
  Math.max(
    0,
    monthlyCosts > 0 ? (monthlyDonations / monthlyCosts) * 100 : 0,
  ),
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
          Volver al inicio
        </Link>

        <header className="max-w-3xl">
          <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HeartHandshake className="size-5" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Apoya el proyecto
          </p>

          <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-4xl">
            Apoya Bright Bytes
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Bright Bytes es gratuito. Si quieres ayudarnos a mantener la
            plataforma funcionando, puedes apoyar el proyecto aquí.
          </p>
        </header>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">
              Así vamos este mes
            </CardTitle>

            <CardDescription>
              Un pequeño resumen de las lecciones que hemos creado y de los
              costos que tu apoyo nos ayuda a cubrir.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">
                Lecciones creadas este mes
              </p>

              <p className="mt-2 text-2xl font-bold tabular-nums">
                {lessonsCreatedThisMonth}
              </p>
            </div>

            <div className="rounded-xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">
                Gastado este mes
              </p>

              <p className="mt-2 text-2xl font-bold tabular-nums">
                {formatClp(monthlyCosts)}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  CLP
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-muted-foreground">
                Donaciones de este mes
              </p>

              <p className="mt-2 text-2xl font-bold tabular-nums">
                {formatClp(monthlyDonations)}{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  / {formatClp(monthlyCosts)} CLP
                </span>
              </p>

              <Progress
                value={donationProgress}
                className="mt-4"
                aria-label={`${Math.round(
                  donationProgress,
                )}% de los costos mensuales cubiertos`}
              />

              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round(donationProgress)}% de los costos de este mes
                cubiertos
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">

            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold">
                Haz una contribución
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Continuarás de forma segura en Mercado Pago. Bright Bytes no
                recopila ni almacena tus datos bancarios.
              </p>
            </div>

            {donationUrl ? (
              <a
                href={donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  size: "lg",
                  className: "w-full gap-2 px-6 sm:w-auto",
                })}
              >
                Donar con Mercado Pago <ExternalLink />
              </a>
            ) : (
              <div className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled
                >
                  Donar con Mercado Pago
                </Button>

                <p className="mt-2 text-xs text-muted-foreground sm:text-right">
                  El enlace de donación aún no está disponible.
                </p>
              </div>
            )}

          </CardContent>
        </Card>

        <p className="mx-auto max-w-2xl pb-2 text-center text-xs leading-5 text-muted-foreground">
          Cada contribución nos ayuda a cubrir el hosting, la infraestructura
          y las herramientas necesarias para mantener Bright Bytes disponible.
          Gracias por apoyar el proyecto.
        </p>

      </div>
    </main>
  );
}