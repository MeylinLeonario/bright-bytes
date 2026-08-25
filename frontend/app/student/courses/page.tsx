"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Flag, LockKeyhole, Map } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { enrollInStudentCourse, getStudentCourses, type StudentCourse } from "@/lib/api";

const MAP_SIZE = 10;
const COURSE_SIZE = 40;
const mapNames = ["Primeros pasos", "Nuevas rutas", "Conversaciones", "Destino final"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    getStudentCourses().then(setCourses).catch(() => setError("No pudimos cargar tus cursos. Inténtalo nuevamente.")).finally(() => setLoading(false));
  }, []);

  async function enroll(courseId: string) {
    setEnrolling(courseId);

    try {
      await enrollInStudentCourse(courseId);
      setCourses((items) => items.map((course) => course.id === courseId ? { ...course, enrolled: true } : course));
    } catch {
      setError("No pudimos inscribirte en este curso. Inténtalo nuevamente.");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Camino de aprendizaje</p>
            <h1 className="mt-2 text-3xl font-black">Tus cursos</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Cada curso contiene 40 lecciones organizadas en cuatro mapas cortos. Completa diez lecciones para llegar al siguiente punto de control.</p>
          </div>
          <Link href="/student/dashboard" className={buttonVariants({ variant: "outline" })}>Volver al inicio</Link>
        </header>

        {loading && <Card><CardContent className="p-6 text-sm text-muted-foreground">Cargando cursos...</CardContent></Card>}
        {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && courses.length === 0 && <Card><CardContent className="p-6">Aún no hay cursos publicados.</CardContent></Card>}

        <div className="space-y-7">
          {courses.map((course) => {
            const completed = course.lessons.filter((lesson) => lesson.completed).length;
            const displayedTotal = Math.max(COURSE_SIZE, course.lessons.length);
            return (
              <Card key={course.id} className="overflow-hidden border-primary/15">
                <div className="flex flex-col gap-5 border-b bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Badge>{course.level}</Badge>
                    <h2 className="mt-3 text-2xl font-black">{course.title}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  <div className="min-w-52">
                    <div className="mb-2 flex justify-between text-xs font-bold"><span>{completed} de {displayedTotal}</span><span>{Math.round(completed / displayedTotal * 100)}%</span></div>
                    <Progress value={completed / displayedTotal * 100} />
                  </div>
                </div>

                <CardContent className="p-6">
                  {!course.enrolled ? (
                    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed p-5 sm:flex-row sm:items-center">
                      <div><b>El recorrido está listo</b><p className="text-sm text-muted-foreground">Inscríbete para desbloquear el primer mapa.</p></div>
                      <button className={buttonVariants()} disabled={enrolling === course.id} onClick={() => enroll(course.id)}>{enrolling === course.id ? "Inscribiendo..." : "Inscribirme"}<ArrowRight /></button>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {mapNames.map((name, mapIndex) => {
                        const start = mapIndex * MAP_SIZE;
                        const lessons = course.lessons.slice(start, start + MAP_SIZE);
                        const mapCompleted = lessons.filter((lesson) => lesson.completed).length;
                        const unlocked = start === 0 || completed >= start;
                        return (
                          <section key={name} className={`rounded-2xl border p-5 ${unlocked ? "bg-card" : "bg-muted/40 text-muted-foreground"}`}>
                            <div className="mb-5 flex items-center justify-between">
                              <div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-xl ${unlocked ? "bg-primary/10 text-primary" : "bg-muted"}`}>{unlocked ? <Map className="size-5" /> : <LockKeyhole className="size-5" />}</span><div><p className="text-xs font-black uppercase tracking-wider">Mapa {mapIndex + 1}</p><h3 className="font-bold">{name}</h3></div></div>
                              <span className="text-xs font-bold">{mapCompleted}/{MAP_SIZE}</span>
                            </div>
                            <div className="relative flex items-center justify-between before:absolute before:left-4 before:right-4 before:top-1/2 before:h-0.5 before:bg-border">
                              {Array.from({ length: MAP_SIZE }, (_, index) => {
                                const lesson = lessons[index];
                                const order = start + index + 1;
                                const done = lesson?.completed;
                                const available = unlocked && lesson && (done || order === completed + 1 || order <= completed + 1);
                                const node = <span className={`relative z-10 grid size-8 place-items-center rounded-full border-2 text-[10px] font-black ${done ? "border-primary bg-primary text-white" : available ? "border-primary bg-white text-primary" : "border-border bg-muted text-muted-foreground"}`}>{done ? <Check className="size-4" /> : index === 9 ? <Flag className="size-3.5" /> : order}</span>;
                                return available ? <Link key={order} href={`/student/lessons/${lesson.id}`} aria-label={`Abrir lección ${order}`}>{node}</Link> : <span key={order}>{node}</span>;
                              })}
                            </div>
                            <p className="mt-4 text-xs text-muted-foreground">Lecciones {start + 1}–{start + MAP_SIZE} · {indexLabel(mapIndex)}</p>
                          </section>
                        );
                      })}
                    </div>
                  )}
                  </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function indexLabel(index: number) {
  return index === 3 ? "Cierre del curso" : "Punto de control al final";
}