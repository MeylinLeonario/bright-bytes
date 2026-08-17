"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";
import type { CurrentUser } from "@/lib/api";

const weekDays = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: false },
  { day: "Thu", completed: true },
  { day: "Fri", completed: false },
];

const recentActivity = [
  {
    lesson: "Asking for directions",
    date: "Yesterday",
  },
  {
    lesson: "Present continuous",
    date: "Aug 14",
  },
  {
    lesson: "Daily routines",
    date: "Aug 13",
  },
];

export default function StudentDashboard() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("Error loading current user:", error);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:px-6">
        {/* HEADER */}
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Student dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Good morning, {loadingUser ? "..." : user?.name ?? "student"} 👋
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Ready for another Bright Byte?
          </p>
        </section>

        {/* STATS */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* STREAK */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pb-1 pt-4">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>

              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="px-5 pb-4">
              <div className="text-2xl font-bold">12 days</div>

              <p className="mt-1 text-xs text-muted-foreground">
                Keep your streak alive
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
                Across your courses
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
                Vocabulary practiced
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CONTINUE LEARNING */}
        <section>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <Badge variant="secondary">Continue learning</Badge>

                  <p className="mt-3 text-xs text-muted-foreground">
                    Unit 3 · Lesson 4
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Present Perfect
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Continue practicing experiences, completed actions and
                    common Present Perfect structures.
                  </p>

                  <div className="mt-4 max-w-2xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Lesson progress
                      </span>

                      <span className="font-medium">72%</span>
                    </div>

                    <Progress value={72} />
                  </div>
                </div>

                <Button className="gap-2 lg:self-end">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* COURSE + WEEKLY GOAL */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* CURRENT COURSE */}
          <Card className="lg:col-span-2">
            <CardHeader className="px-5 pb-3 pt-5">
              <CardDescription>Your current course</CardDescription>

              <CardTitle className="text-xl">English A2 → B1</CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      12 of 30 lessons completed
                    </span>

                    <span className="font-medium">40%</span>
                  </div>

                  <Progress value={40} />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      18 lessons remaining
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Keep going — you are making progress.
                    </p>
                  </div>

                  <Button variant="outline" size="sm">
                    View course
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WEEKLY GOAL */}
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <CardDescription>Weekly goal</CardDescription>

              <CardTitle className="text-xl">3 / 5 days</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 px-5 pb-5">
              {weekDays.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span className="text-sm font-medium">{item.day}</span>

                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* RECENT ACTIVITY + ACHIEVEMENT */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* RECENT ACTIVITY */}
          <Card className="lg:col-span-2">
            <CardHeader className="px-5 pb-3 pt-5">
              <CardTitle className="text-lg">Recent activity</CardTitle>

              <CardDescription>
                Your most recently completed lessons
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 px-5 pb-5">
              {recentActivity.map((activity) => (
                <div
                  key={activity.lesson}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {activity.lesson}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Lesson completed
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {activity.date}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ACHIEVEMENT */}
          <Card>
            <CardHeader className="px-5 pb-2 pt-5">
              <CardDescription>Latest achievement</CardDescription>

              <CardTitle className="text-xl">7 day streak</CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Trophy className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Consistency champion
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    You studied English for seven days in a row.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}