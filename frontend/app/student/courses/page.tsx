"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStudentCourses, type StudentCourse } from "@/lib/api";

export default function CoursesPage() {
  
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStudentCourses().then(setCourses).catch(() => setError("We couldn't load your courses. Please sign in again or retry."))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-muted/30">
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8">
      <section><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bright Bytes Courses</p>
        <h1 className="mt-1 text-3xl font-bold">Your learning path</h1>
        <p className="mt-2 text-sm text-muted-foreground">Every published lesson from your teacher, with progress saved automatically.</p>
      </section>
      {loading && <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading courses...</CardContent></Card>}
      {error && <Card className="border-red-200"><CardContent className="p-6 text-sm text-red-600">{error}</CardContent></Card>}
      {!loading && !error && courses.length === 0 && <Card><CardContent className="p-6">No published courses yet.</CardContent></Card>}
      {courses.map(course => {
        const completed = course.lessons.filter(lesson => lesson.completed).length;
        const progress = course.lessons.length ? Math.round(completed / course.lessons.length * 100) : 0;
        const next = course.lessons.find(lesson => !lesson.completed) ?? course.lessons[0];
        return <Card key={course.id}>
          <CardHeader><div className="flex items-center justify-between gap-4"><div><Badge>{course.level}</Badge><CardTitle className="mt-3 text-2xl">{course.title}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{course.description}</p></div>
            <BookOpen className="h-8 w-8 text-muted-foreground" /></div></CardHeader>
          <CardContent className="space-y-5">
            <div><div className="mb-2 flex justify-between text-xs"><span>{completed} of {course.lessons.length} lessons completed</span><strong>{progress}%</strong></div><Progress value={progress} /></div>
            <div className="divide-y rounded-xl border">{course.lessons.map(lesson => <Link key={lesson.id} href={`/student/lessons/${lesson.id}`} className="flex items-center justify-between gap-4 p-4 transition hover:bg-muted/50">
              <div className="flex items-center gap-3">{lesson.completed ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]">{lesson.order}</span>}<div><p className="text-sm font-medium">{lesson.title}</p><p className="text-xs text-muted-foreground">{lesson.grammarPoint}</p></div></div><ArrowRight className="h-4 w-4" />
            </Link>)}</div>
            {next && <Link className={buttonVariants()} href={`/student/lessons/${next.id}`}>Continue course <ArrowRight /></Link>}
          </CardContent>
        </Card>;
      })}
    </div>
  </main>;
}