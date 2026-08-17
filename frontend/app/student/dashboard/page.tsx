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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { getCurrentUser, getStudentDashboard } from "@/lib/api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { CurrentUser, StudentDashboardData } from "@/lib/api";


export default function StudentDashboard() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

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

  useEffect(() => {
    getStudentDashboard()
      .then(setDashboard)
      .catch((error) => {
        console.error("Error loading student dashboard:", error);
      })
      .finally(() => {
        setLoadingDashboard(false);
      });
  }, []);

  const formatActivityDate = (completedAt: string) => {
    const date = new Date(completedAt);
    const today = new Date();

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const differenceInDays = Math.round(
      (todayOnly.getTime() - dateOnly.getTime()) / 86400000
    );

    if (differenceInDays === 0) return "Today";
    if (differenceInDays === 1) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

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
              <div className="text-2xl font-bold">
                {loadingDashboard
                  ? "..."
                  : `${dashboard?.streak ?? 0} ${
                      dashboard?.streak === 1 ? "day" : "days"
                    }`}
              </div>

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
              <div className="text-2xl font-bold">
                {loadingDashboard ? "..." : dashboard?.lessonsCompleted ?? 0}
              </div>

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
              <div className="text-2xl font-bold">
                {loadingDashboard ? "..." : dashboard?.wordsLearned ?? 0}
              </div>

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

                  {loadingDashboard ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Loading your next lesson...
                    </p>
                  ) : dashboard?.continueLesson ? (
                    <>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Lesson {dashboard.continueLesson.order}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold">
                        {dashboard.continueLesson.title}
                      </h2>

                      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                        Grammar focus: {dashboard.continueLesson.grammarPoint}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-3 text-xl font-semibold">
                        Course complete
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        You have completed every published lesson in this course.
                      </p>
                    </>
                  )}
                </div>
                {dashboard?.continueLesson && <Link className={buttonVariants({ className: "gap-2 lg:self-end" })} href={`/student/lessons/${dashboard.continueLesson.id}`}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Link>}
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

              <CardTitle className="text-xl">
                {loadingDashboard
                  ? "Loading course..."
                  : dashboard?.courseTitle || "English A2"}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {loadingDashboard
                        ? "Loading progress..."
                        : `${dashboard?.courseLessonsCompleted ?? 0} of ${
                            dashboard?.totalCourseLessons ?? 0
                          } lessons completed`}
                    </span>

                    <span className="font-medium">
                      {loadingDashboard
                        ? "..."
                        : `${dashboard?.courseProgress ?? 0}%`}
                    </span>
                  </div>

                  <Progress value={dashboard?.courseProgress ?? 0} />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {loadingDashboard
                        ? "Loading..."
                        : `${dashboard?.lessonsRemaining ?? 0} lessons remaining`}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Keep going — you are making progress.
                    </p>
                  </div>
                  <Link className={buttonVariants({ variant: "outline", size: "sm" })} href="/student/courses">View course</Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WEEKLY GOAL */}
          <Card>
            <CardHeader className="px-5 pb-3 pt-5">
              <CardDescription>Weekly goal</CardDescription>

              <CardTitle className="text-xl">
                {loadingDashboard
                  ? "..."
                  : `${
                      dashboard?.weeklyGoal.filter((day) => day.completed)
                        .length ?? 0
                    } / ${dashboard?.weeklyGoal.length ?? 5} days`}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 px-5 pb-5">
              {(dashboard?.weeklyGoal ?? []).map((item) => (
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
              {(dashboard?.recentActivity ?? []).map((activity) => (
                <div
                  key={activity.lessonId}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {activity.lessonTitle}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Lesson completed
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {formatActivityDate(activity.completedAt)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ACHIEVEMENT */}
          <Card>
            <CardHeader className="px-5 pb-2 pt-5">
              <CardDescription>Latest achievement</CardDescription>

              <CardTitle className="text-xl">
                {loadingDashboard
                  ? "..."
                  : dashboard?.latestAchievement?.title ?? "Keep going"}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Trophy className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {dashboard?.latestAchievement
                      ? "Consistency champion"
                      : "Your next achievement is waiting"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {dashboard?.latestAchievement?.description ??
                      "Study on consecutive days to unlock a streak achievement."}
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