"use client";

import {
  BookOpen,
  CheckCircle2,
  Flame,
  Gauge,
  Sparkles,
  TrendingUp,
  Target,
  ArrowUpRight,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const last30Days = [
  true, true, false, true, true, true, true,
  true, false, false, true, true, true, false,
  true, true, true, true, false, true, true,
  true, true, false, true, true, true, true,
  false, true,
];

const recentWords = [
  "experience",
  "travel",
  "visit",
  "try",
  "never",
];

const masteryAreas = [
  {
    name: "Grammar",
    value: 74,
  },
  {
    name: "Vocabulary",
    value: 68,
  },
  {
    name: "Reading & listening",
    value: 79,
  },
  {
    name: "Writing",
    value: 61,
  },
  {
    name: "Speaking",
    value: 57,
  },
];

const abilities = [
  "Talk about your daily routine and habits.",
  "Describe past experiences using common verb forms.",
  "Ask for and understand simple directions.",
  "Write a short paragraph about yourself and your experiences.",
  "Understand short A2 readings about familiar topics.",
  "Speak for 1–2 minutes about familiar experiences and plans.",
];

export default function ProgressPage() {
  const studyDays = last30Days.filter(Boolean).length;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:px-6">
        {/* HEADER */}
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your progress
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Your English is growing. Here&apos;s the proof.
          </h1>

          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            Your progress is more than a streak or a score. Every lesson,
            word and practice activity adds something you can actually do
            in English.
          </p>
        </section>

        {/* MAIN STATS */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* STREAK */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-1 pt-4">
              <CardTitle className="text-sm font-medium">
                Current streak
              </CardTitle>

              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold">12 days</div>

              <p className="mt-1 text-xs text-muted-foreground">
                You&apos;ve kept showing up
              </p>
            </CardContent>
          </Card>

          {/* WORDS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-1 pt-4">
              <CardTitle className="text-sm font-medium">
                Words learned
              </CardTitle>

              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold">184</div>

              <p className="mt-1 text-xs text-muted-foreground">
                +25 this month
              </p>
            </CardContent>
          </Card>

          {/* LESSONS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-1 pt-4">
              <CardTitle className="text-sm font-medium">
                Lessons completed
              </CardTitle>

              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold">24</div>

              <p className="mt-1 text-xs text-muted-foreground">
                6 lessons remaining
              </p>
            </CardContent>
          </Card>

          {/* MASTERY */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-1 pt-4">
              <CardTitle className="text-sm font-medium">
                A2 mastery
              </CardTitle>

              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold">68%</div>

              <p className="mt-1 text-xs text-muted-foreground">
                Of the material you&apos;ve studied
              </p>
            </CardContent>
          </Card>
        </section>

        {/* PROGRESS THIS MONTH */}
        <section>
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">
                    Your progress this month
                  </CardTitle>

                  <CardDescription>
                    Compare where you were 30 days ago with where you are today.
                  </CardDescription>
                </div>

                <Badge className="gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Moving forward
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="grid gap-4 lg:grid-cols-3">
                {/* BEFORE */}
                <div className="rounded-xl border p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    30 days ago
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lessons
                      </span>
                      <span className="font-semibold">12</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Course words
                      </span>
                      <span className="font-semibold">109</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        A2 mastery
                      </span>
                      <span className="font-semibold">43%</span>
                    </div>
                  </div>
                </div>

                {/* GROWTH */}
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Your growth
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Lessons completed
                      </span>

                      <Badge variant="secondary" className="gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        +12
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        New words
                      </span>

                      <Badge variant="secondary" className="gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        +75
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Mastery
                      </span>

                      <Badge variant="secondary" className="gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        +25 pts
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* TODAY */}
                <div className="rounded-xl border p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Today
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lessons
                      </span>
                      <span className="font-semibold">24</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Course words
                      </span>
                      <span className="font-semibold">184</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        A2 mastery
                      </span>
                      <span className="font-semibold">68%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-dashed p-4">
                <p className="text-sm font-medium">
                  Your English today is not the same as it was a month ago.
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  You&apos;ve completed 12 more lessons, encountered 75 more
                  course words and expanded the range of things you can express
                  and understand in English.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* WHAT YOU CAN DO NOW */}
        <section>
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />

                <CardTitle className="text-lg">
                  What you can do now
                </CardTitle>
              </div>

              <CardDescription>
                Concrete English abilities you&apos;ve already practiced.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="grid gap-3 md:grid-cols-2">
                {abilities.map((ability) => (
                  <div
                    key={ability}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <p className="text-sm leading-6">
                      {ability}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 30 DAY STREAK */}
        <section>
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">
                    Your last 30 days
                  </CardTitle>

                  <CardDescription>
                    Every square represents one day you could choose to study.
                  </CardDescription>
                </div>

                <Badge variant="secondary">
                  {studyDays} study days
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="grid max-w-2xl grid-cols-10 gap-2">
                {last30Days.map((studied, index) => (
                  <div
                    key={index}
                    title={`Day ${index + 1}`}
                    className={
                      studied
                        ? "aspect-square rounded-md bg-primary"
                        : "aspect-square rounded-md border bg-muted"
                    }
                  />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Study days
                  </span>

                  <span className="ml-2 font-semibold">
                    {studyDays}/30
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    Longest streak
                  </span>

                  <span className="ml-2 font-semibold">
                    9 days
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    Current streak
                  </span>

                  <span className="ml-2 font-semibold">
                    12 days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* VOCABULARY + COURSE */}
        <section className="grid gap-4 lg:grid-cols-2">
          {/* VOCABULARY */}
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />

                <CardTitle className="text-lg">
                  Vocabulary growth
                </CardTitle>
              </div>

              <CardDescription>
                Words you&apos;ve encountered and practiced.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    Total
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    184
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    +25
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    +5
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-medium">
                  Recently learned
                </p>

                <div className="flex flex-wrap gap-2">
                  {recentWords.map((word) => (
                    <Badge key={word} variant="secondary">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* COURSE PROGRESS */}
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <CardTitle className="text-lg">
                Progreso del curso
              </CardTitle>

              <CardDescription>
                English A2 · Everyday English
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    24 / 30
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    lessons completed
                  </p>
                </div>

                <span className="text-lg font-semibold">
                  80%
                </span>
              </div>

              <Progress value={80} className="mt-4" />

              <div className="mt-5 rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">
                  You&apos;re 6 lessons away from finishing A2.
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Most of this level is already behind you. The remaining
                  lessons will reinforce and expand what you&apos;ve built.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* MASTERY */}
        <section>
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />

                    <CardTitle className="text-lg">
                      Your A2 mastery
                    </CardTitle>
                  </div>

                  <CardDescription className="mt-1">
                    How confidently you&apos;re using the material
                    you&apos;ve studied.
                  </CardDescription>
                </div>

                <Badge>68%</Badge>
              </div>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* MAIN SCORE */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-muted p-6 text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-background bg-card shadow-sm">
                    <div>
                      <p className="text-3xl font-bold">
                        68%
                      </p>

                      <p className="text-xs text-muted-foreground">
                        mastery
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-medium">
                    You&apos;re building real control
                  </p>

                  <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                    This score reflects how well you&apos;re handling the
                    English you have actually studied so far.
                  </p>
                </div>

                {/* BREAKDOWN */}
                <div className="space-y-5 lg:col-span-2">
                  {masteryAreas.map((area) => (
                    <div key={area.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {area.name}
                        </span>

                        <span className="text-muted-foreground">
                          {area.value}%
                        </span>
                      </div>

                      <Progress value={area.value} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* NEXT MILESTONE */}
        <section>
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />

                <CardTitle className="text-lg">
                  Your next milestone
                </CardTitle>
              </div>

              <CardDescription>
                You control what happens next.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="grid gap-5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        A2 course completion
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        80%
                      </p>
                    </div>

                    <p className="text-sm font-medium">
                      6 lessons left
                    </p>
                  </div>

                  <Progress value={80} className="mt-3" />

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Complete the next 6 lessons and you&apos;ll finish your
                    current A2 path.
                  </p>
                </div>

                <div className="rounded-xl bg-muted p-4">
                  <p className="text-sm font-medium">
                    Focus next
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      Complete 3 more lessons
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      Learn 15 new words
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      Finish 2 speaking practices
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* EXPLANATION */}
        <section>
          <Card className="border-dashed">
            <CardContent className="p-4">
              <p className="text-sm font-medium">
                Your progress belongs to you.
              </p>

              <p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">
                Bright Bytes tracks what you study, practice and complete so
                you can see the difference over time. Your mastery score is
                about the material you&apos;ve worked on, not a vague promise
                about your overall English level.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}