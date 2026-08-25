"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Flame, Gauge, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStudentDashboard, type StudentDashboardData } from "@/lib/api";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export default function ProgressPage() {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard()
      .then(setData)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const last30Days = useMemo(() => {
    const activityByDate = new Map(
      (data?.studyActivity ?? []).map((activity) => [activity.date.slice(0, 10), activity.intensity]),
    );
    const today = new Date();

    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today.getTime() - (29 - index) * DAY_IN_MS);
      const key = date.toISOString().slice(0, 10);
      return { key, label: date.toLocaleDateString("es", { day: "numeric", month: "short" }), intensity: activityByDate.get(key) ?? 0 };
    });
  }, [data]);

  if (loading) {
    return <main className="min-h-screen bg-muted/30 p-8 text-center text-muted-foreground">Cargando tu progreso…</main>;
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-muted/30 p-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-card p-6 text-center">
          <h1 className="text-xl font-black">No pudimos cargar tu progreso</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error || "No hay información disponible."}</p>
          <Link href="/student/dashboard" className={`${buttonVariants({ variant: "outline" })} mt-5`}>Volver al dashboard</Link>
        </div>
      </main>
    );
  }

  const studyDays = last30Days.filter((day) => day.intensity > 0).length;
  const courseProgress = Math.max(0, Math.min(100, data.courseProgress));

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:px-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-primary">Tu progreso</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Cada Byte cuenta.</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Estas cifras se actualizan con tus lecciones, vocabulario y actividad guardados.
            </p>
          </div>
          <Link href="/student/dashboard" className={buttonVariants({ variant: "outline" })}>Volver al dashboard</Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {[
            ["Racha actual", `${data.streak} días`, Flame],
            ["Palabras aprendidas", data.wordsLearned.toLocaleString(), BookOpen],
            ["Lecciones completadas", data.lessonsCompleted.toLocaleString(), CheckCircle2],
            ["Progreso del curso", `${courseProgress}%`, Gauge],
          ].map(([label, value, Icon]) => (
            <Card key={label as string}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-1 pt-4">
                <CardTitle className="text-sm font-medium">{label as string}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-5 pb-4"><div className="text-2xl font-bold">{value as string}</div></CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
          <Card>
            <CardHeader>
              <CardTitle>Actividad de los últimos 30 días</CardTitle>
              <CardDescription>{studyDays} días con actividad registrada.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {last30Days.map((day) => (
                  <div
                  key={day.key}
                    title={`${day.label}: ${day.intensity ? `intensidad ${day.intensity}` : "sin actividad"}`}
                    aria-label={`${day.label}: ${day.intensity ? "con actividad" : "sin actividad"}`}
                    className={`aspect-square rounded-md ${day.intensity === 3 ? "bg-primary" : day.intensity === 2 ? "bg-primary/70" : day.intensity === 1 ? "bg-primary/40" : "border bg-muted"}`}
                  />
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-6 text-sm">
                <span><b>{data.streak}</b> días de racha actual</span>
                <span><b>{data.thisWeekLessonsCompleted}</b> lecciones esta semana</span>
                <span><b>{data.bestWeekLessons}</b> mejor semana</span>
              </div>
            </CardContent>
          </Card>
          <Card>
          <CardHeader>
              <CardTitle>{data.courseTitle}</CardTitle>
              <CardDescription>Nivel {data.courseLevel}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between"><b className="text-3xl">{data.courseLessonsCompleted}/{data.totalCourseLessons}</b><b>{courseProgress}%</b></div>
              <Progress value={courseProgress} className="mt-4" />
              <p className="mt-4 text-sm text-muted-foreground">
                {data.lessonsRemaining > 0 ? `Te faltan ${data.lessonsRemaining} lecciones para terminar este curso.` : "Completaste todas las lecciones disponibles."}
              </p>
              {data.continueLesson && (
                <Link href={`/student/lessons/${data.continueLesson.id}`} className={`${buttonVariants()} mt-5 w-full gap-2`}>
                  Continuar aprendiendo <ArrowRight className="size-4" />
                </Link>
              )}
            </CardContent>
          </Card>
        </section>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Trophy className="size-5 text-primary" />
            <div><CardTitle>Actividad reciente</CardTitle><CardDescription>Tus últimas lecciones completadas.</CardDescription></div>
          </CardHeader>
          <CardContent>
            {data.recentActivity.length ? (
              <div className="grid gap-3 md:grid-cols-3">
                {data.recentActivity.map((activity) => (
                  <Link key={`${activity.lessonId}-${activity.completedAt}`} href={`/student/lessons/${activity.lessonId}`} className="rounded-xl border p-4 transition-colors hover:bg-muted/50">
                    <p className="font-bold">{activity.lessonTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Completada el {new Date(activity.completedAt).toLocaleDateString("es")}</p>
                  </Link>
                ))}
              </div>
              ) : <p className="text-sm text-muted-foreground">Completa una lección para empezar a construir tu historial.</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}