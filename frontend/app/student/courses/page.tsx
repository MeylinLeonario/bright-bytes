"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  Sparkles,
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

const courses = [
  {
    level: "A1",
    title: "English Foundations",
    description:
      "Build your first English sentences and learn essential vocabulary for everyday situations.",
    lessons: null,
    status: "coming-soon",
  },
  {
    level: "A2",
    title: "Everyday English",
    description:
      "Learn to communicate about daily life, experiences, plans and the world around you.",
    lessons: 30,
    completedLessons: 12,
    progress: 40,
    status: "available",
  },
  {
    level: "B1",
    title: "Independent English",
    description:
      "Express your ideas with more confidence and communicate in increasingly complex situations.",
    lessons: null,
    status: "coming-soon",
  },
  {
    level: "B2",
    title: "Confident English",
    description:
      "Develop the fluency and precision needed for academic, professional and social communication.",
    lessons: null,
    status: "coming-soon",
  },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 md:px-6">
        {/* HEADER */}
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Bright Bytes Courses
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Learn English, one level at a time
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Follow the CEFR learning path from your first English sentences
            to confident independent communication.
          </p>
        </section>

        {/* CURRENT COURSE */}
        <section>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>Current course</Badge>

                      <Badge variant="outline">
                        A2
                      </Badge>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold">
                      Everyday English
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      You&apos;ve completed 12 of 30 lessons.
                    </p>

                    <div className="mt-4 max-w-2xl">
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Course progress
                        </span>

                        <span className="font-medium">
                          40%
                        </span>
                      </div>

                      <Progress value={40} />
                    </div>
                  </div>
                </div>

                <Button className="gap-2">
                  Continue course
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* LEARNING PATH */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Your learning path
            </h2>

            <p className="text-sm text-muted-foreground">
              Explore all Bright Bytes English levels.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course) => {
              const available = course.status === "available";

              return (
                <Card
                  key={course.level}
                  className={
                    available
                      ? "relative"
                      : "relative bg-muted/40"
                  }
                >
                  <CardHeader className="px-5 pb-3 pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={
                            available
                              ? "flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
                              : "flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-sm font-bold text-muted-foreground"
                          }
                        >
                          {course.level}
                        </div>

                        <div>
                          <CardTitle className="text-lg">
                            {course.title}
                          </CardTitle>

                          <CardDescription>
                            CEFR Level {course.level}
                          </CardDescription>
                        </div>
                      </div>

                      {available ? (
                        <Badge className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Available
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="gap-1"
                        >
                          <Clock3 className="h-3 w-3" />
                          Coming soon
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 pb-5">
                    <p className="min-h-10 text-sm text-muted-foreground">
                      {course.description}
                    </p>

                    {available ? (
                      <>
                        <div className="mt-5">
                          <div className="mb-1.5 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {course.completedLessons} of{" "}
                              {course.lessons} lessons
                            </span>

                            <span className="font-medium">
                              {course.progress}%
                            </span>
                          </div>

                          <Progress value={course.progress ?? 0} />
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            {course.lessons} lessons
                          </div>

                          <Button variant="outline" size="sm">
                            View course
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-5 flex items-center justify-between border-t pt-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Sparkles className="h-4 w-4" />
                          Currently being created
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="gap-2"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          Not available
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* SMALL MESSAGE */}
        <section>
          <Card className="border-dashed">
            <CardContent className="flex items-start gap-3 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  More English is on the way!
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  We&apos;re currently creating the A1, B1 and B2 courses.
                  They&apos;ll become available here once they&apos;re ready.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}