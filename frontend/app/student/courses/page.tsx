"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  enrollInStudentCourse,
  getStudentCourses,
  type StudentCourse,
} from "@/lib/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(
    null
  );

  useEffect(() => {
    getStudentCourses()
      .then(setCourses)
      .catch(() =>
        setError(
          "No pudimos cargar tus cursos. Vuelve a iniciar sesión o inténtalo nuevamente."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const enroll = async (courseId: string) => {
    setEnrollingCourseId(courseId);
    setError("");

    try {
      await enrollInStudentCourse(courseId);

      setCourses((current) =>
        current.map((course) =>
          course.id === courseId
            ? { ...course, enrolled: true }
            : course
        )
      );
    } catch {
      setError(
        "No pudimos inscribirte en este curso. Inténtalo nuevamente."
      );
    } finally {
      setEnrollingCourseId(null);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8">
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Cursos de Bright Bytes
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Catálogo de cursos
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Elige un curso publicado, inscríbete y completa cada lección
            a tu propio ritmo. A2 es tu nivel inicial predeterminado.
          </p>
        </section>

        {loading && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Cargando cursos...
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200">
            <CardContent className="p-6 text-sm text-red-600">
              {error}
            </CardContent>
          </Card>
        )}

        {!loading && !error && courses.length === 0 && (
          <Card>
            <CardContent className="p-6">
              Aún no hay cursos publicados.
            </CardContent>
          </Card>
        )}

        {courses.map((course) => {
          const completed = course.lessons.filter(
            (lesson) => lesson.completed
          ).length;

          const progress = course.lessons.length
            ? Math.round(
                (completed / course.lessons.length) * 100
              )
            : 0;

          const next =
            course.lessons.find((lesson) => !lesson.completed) ??
            course.lessons[0];

          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex gap-2">
                      <Badge>{course.level}</Badge>

                      {course.enrolled && (
                        <Badge variant="secondary">
                          <CheckCircle2 />
                          Inscrito
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="mt-3 text-2xl">
                      {course.title}
                    </CardTitle>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>

                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span>
                      {completed} de {course.lessons.length} lecciones
                      completadas
                    </span>

                    <strong>{progress}%</strong>
                  </div>

                  <Progress value={progress} />
                </div>

                <div className="divide-y rounded-xl border">
                  {course.lessons.map((lesson) =>
                    course.enrolled ? (
                      <Link
                        key={lesson.id}
                        href={`/student/lessons/${lesson.id}`}
                        className="flex items-center justify-between gap-4 p-4 transition hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]">
                              {lesson.order}
                            </span>
                          )}

                          <div>
                            <p className="text-sm font-medium">
                              {lesson.title}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {lesson.grammarPoint}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between gap-4 p-4 text-muted-foreground"
                      >
                        <div className="flex items-center gap-3">
                          <LockKeyhole className="h-5 w-5" />

                          <div>
                            <p className="text-sm font-medium">
                              {lesson.title}
                            </p>

                            <p className="text-xs">
                              {lesson.grammarPoint}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {course.enrolled && next ? (
                  <Link
                    className={buttonVariants()}
                    href={`/student/lessons/${next.id}`}
                  >
                    Continuar curso
                    <ArrowRight />
                  </Link>
                ) : !course.enrolled ? (
                  <button
                    className={buttonVariants()}
                    disabled={enrollingCourseId === course.id}
                    onClick={() => enroll(course.id)}
                  >
                    {enrollingCourseId === course.id
                      ? "Inscribiendo..."
                      : `Inscribirme en ${course.level}`}

                    <ArrowRight />
                  </button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}