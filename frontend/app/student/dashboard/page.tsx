"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Flame, HeartHandshake, Pencil, Quote, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DAILY_QUOTES } from "@/lib/daily-quotes";
import { getCurrentUser, getStudentDashboard, updateWeeklyGoal, type CurrentUser, type StudentDashboardData } from "@/lib/api";
import { StreakCalendar } from "./streak-calendar";

export default function StudentDashboard() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    Promise.all([getCurrentUser(), getStudentDashboard()])
      .then(([currentUser, data]) => {
        setUser(currentUser);
        setDashboard(data);
        setQuoteIndex(Math.floor(Math.random() * DAILY_QUOTES.length));
      })
      .catch((error) => console.error("Error loading dashboard:", error))
      .finally(() => setLoading(false));
  }, []);

  const completedThisWeek = useMemo(
    () => dashboard?.weeklyGoal.filter((day) => day.completed).length ?? 0,
    [dashboard]
  );
  const goal = dashboard?.weeklyGoalDays ?? 5;
  const [english, spanish] = DAILY_QUOTES[quoteIndex];

  async function setGoal(days: number) {
    if (!dashboard) return;
    setSavingGoal(true);
    try {
      await updateWeeklyGoal(days);
      setDashboard({ ...dashboard, weeklyGoalDays: days });
      setEditingGoal(false);
    } catch (error) {
      console.error("Error updating weekly goal:", error);
    } finally { setSavingGoal(false); }
  }

  return (
    <main className="min-h-screen bg-muted/30">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 md:px-8 md:py-7">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Student dashboard</p>
             <h1 className="mt-1.5 text-3xl font-bold tracking-tight">Good morning, {loading ? "..." : user?.name?.split(" ")[0] ?? "student"} <span aria-hidden>👋</span></h1>
             <p className="mt-1 text-sm text-muted-foreground">A little English today can take you somewhere new tomorrow.</p>
          </div>
          <Badge variant="secondary" className="w-fit gap-1.5 rounded-full px-3 py-1.5"><Flame className="size-3.5 text-primary" /> {dashboard?.streak ?? 0} day streak</Badge>
        </header>
      <section className="grid gap-4 lg:grid-cols-[1.5fr_.5fr]">
          <Card className="relative overflow-hidden border-primary/20 shadow-sm before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary">
            <CardHeader className="flex-row items-start justify-between gap-4 pb-2 pl-6">
        <div><CardDescription className="font-medium">Continua aprendiendo</CardDescription><CardTitle className="mt-1 text-2xl">{loading ? "Loading your lesson..." : dashboard?.continueLesson?.title ?? "You’re all caught up!"}</CardTitle></div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"><BookOpen className="size-5" strokeWidth={2.25} /></div>
            </CardHeader>
            <CardContent className="pl-6">
              {dashboard?.continueLesson ? <>
                <p className="text-sm text-muted-foreground">Lesson {dashboard.continueLesson.order} · {dashboard.continueLesson.grammarPoint}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3"><Link href={`/student/lessons/${dashboard.continueLesson.id}`} className={buttonVariants({ size: "lg", className: "gap-2 px-6" })}>Continue lesson <ArrowRight /></Link><span className="text-xs text-muted-foreground">Retoma donde lo dejaste</span></div>
              </> : <div className="flex flex-wrap items-center gap-3"><p className="text-sm text-muted-foreground">Explore your courses and choose your next challenge.</p><Link href="/student/courses" className={buttonVariants({ className: "gap-2" })}>Choose a lesson <ArrowRight /></Link></div>}
    
                </CardContent>
          </Card>
          <Card className="border-chart-2/20 bg-gradient-to-br from-card to-chart-1/10 shadow-sm">
            <CardHeader className="pb-2"><div className="mb-3 flex size-9 items-center justify-center rounded-full bg-chart-2/10 text-chart-2"><Quote className="size-4" /></div><CardDescription>Phrase of the day</CardDescription><CardTitle className="text-xl leading-snug">“{english}”</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{spanish}</p></CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="overflow-hidden border-primary/20 bg-foreground text-background shadow-sm md:col-span-2">
            <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-background/60">Repaso rápido · 1–2 min</p><h2 className="mt-1 text-xl font-semibold">Recuerda las palabras de ayer.</h2><p className="mt-1 text-sm text-background/65"> Escoge una lección completada y practica su vocabulario.</p></div></div>
              <Link href="/student/review" className={buttonVariants({ size: "lg", className: "shrink-0 gap-2 bg-chart-2 px-6 text-white hover:bg-chart-2/80" })}>Start review <ArrowRight /></Link>
            </CardContent>
          </Card>
          <Card className="shadow-sm"><CardHeader className="pb-2"><CardDescription>Course progress</CardDescription><CardTitle className="text-xl">{dashboard?.courseTitle ?? "English"}</CardTitle></CardHeader><CardContent><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>{dashboard?.courseLessonsCompleted ?? 0} of {dashboard?.totalCourseLessons ?? 0} lessons</span><span className="font-semibold text-foreground">{dashboard?.courseProgress ?? 0}%</span></div><Progress value={dashboard?.courseProgress ?? 0} /><Link href="/student/courses" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">View course <ArrowRight className="size-3.5" /></Link></CardContent></Card>
        </section>

        <section className="grid items-start gap-4 lg:grid-cols-[1.5fr_.5fr]">
          <Card className="shadow-sm">
            <CardHeader className="flex-row items-start justify-between pb-2">
              <div><CardTitle className="flex items-center gap-2 text-lg"><Flame className="size-5 text-primary" /> Racha de aprendizaje</CardTitle><CardDescription className="mt-1"> Tu actividad las últimas 13 semanas</CardDescription></div>
              <span className="text-2xl font-bold text-primary">{dashboard?.streak ?? 0}<span className="ml-1 text-xs font-normal text-muted-foreground">days</span></span>
            </CardHeader>

            <CardContent className="pb-4">
              <StreakCalendar activity={dashboard?.studyActivity ?? []} />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
                <span>Cada pedacito de práctica cuenta.</span>
                <div className="flex items-center gap-2"><span>Less</span><span className="size-3 rounded-[3px] bg-muted" /><span className="size-3 rounded-[3px] bg-primary/25" /><span className="size-3 rounded-[3px] bg-primary/65" /><span className="size-3 rounded-[3px] bg-primary" /><span>More</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex-row items-start justify-between pb-2"><div><CardDescription>Weekly goal</CardDescription><CardTitle className="mt-1 text-xl">{completedThisWeek} / {goal} days completed</CardTitle></div><Target className="size-5 text-chart-2" /></CardHeader>
            <CardContent className="pb-4">
              <Progress value={Math.min(100, (completedThisWeek / goal) * 100)} className="h-2" />
              <div className="mt-3 flex justify-between gap-1">{(dashboard?.weeklyGoal ?? []).slice(0, 7).map((day) => <div key={day.day} className="flex flex-col items-center gap-2"><div className={`flex size-7 items-center justify-center rounded-full text-xs ${day.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{day.completed ? <Check className="size-3.5" /> : day.day.slice(0, 1)}</div></div>)}</div>
              {editingGoal ? <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Choose weekly goal">{[2,3,4,5,6,7].map((days) => <Button key={days} size="xs" variant={days === goal ? "default" : "outline"} disabled={savingGoal} onClick={() => setGoal(days)}>{days} days</Button>)}</div> : <Button variant="ghost" size="sm" className="mt-2 -ml-3 text-muted-foreground" onClick={() => setEditingGoal(true)}><Pencil /> Edit goal</Button>}
              </CardContent>
          </Card>
          </section>
          <Card size="sm" className="border-dashed bg-card/70 shadow-none">
          <CardContent className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HeartHandshake className="size-4" />
              </div>
              <div>
                <h2 className="font-semibold">Apoya a Bright Bytes</h2>
                <p className="text-sm text-muted-foreground">Ayúdanos a que el aprendizaje siga siendo gratuito.</p>
              </div>
            </div>
            <Link
              href="/student/support"
              className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-3 text-primary sm:ml-0" })}
            >
              Ver cómo estamos<ArrowRight />
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}