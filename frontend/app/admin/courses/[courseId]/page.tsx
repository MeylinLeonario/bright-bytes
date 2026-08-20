"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Pencil,
  Eye,
  Layers3,
  Users,
  Plus,
  MoreVertical,
  FileText,
  CheckCircle2,
  Upload,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type Lesson = {
  id: string;
  title: string;
  grammarPoint: string;
  grammarExplanation: string;
  order: number;
  isPublished: boolean;
};

type Course = {
  id: string;
  level: string;
  title: string;
  description: string;
  isPublished: boolean;
  studentCount: number;
  lessons: Lesson[];
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publicationError, setPublicationError] = useState("");

  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await apiFetch<Course>(
          `/api/admin/courses/${courseId}`
        );

        setCourse(data);
      } catch (err) {
        console.error(err);
        setError("Could not load course.");
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-8 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl text-sm font-medium text-muted-foreground">
          Loading course...
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-background px-6 py-8 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error || "Course not found."}
        </div>
      </main>
    );
  }

  const totalLessons = course.lessons.length;

  const publishedLessons = course.lessons.filter(
    (lesson) => lesson.isPublished
  ).length;

  const progress =
    totalLessons === 0
      ? 0
      : Math.round((publishedLessons / totalLessons) * 100);

  const handlePublicationChange = async () => {
    setPublishing(true);
    setPublicationError("");

    try {
      const isPublished = !course.isPublished;

      await apiFetch(`/api/admin/courses/${course.id}/publication`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished }),
      });

      setCourse({ ...course, isPublished });
    } catch (err) {
      console.error(err);
      setPublicationError(
        "No pudimos actualizar la publicación del curso. Inténtalo de nuevo."
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (deletingLessonId) return;

    const confirmed = window.confirm(
      `¿Seguro que quieres borrar la lección “${lesson.title}”? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setDeletingLessonId(lesson.id);
    setLessonError("");

    try {
      await apiFetch(`/api/admin/lessons/${lesson.id}`, {
        method: "DELETE",
      });

      setCourse((current) =>
        current
          ? {
              ...current,
              lessons: current.lessons
                .filter((item) => item.id !== lesson.id)
                .map((item) =>
                  item.order > lesson.order
                    ? { ...item, order: item.order - 1 }
                    : item
                ),
            }
          : current
      );
    } catch (err) {
      console.error(err);
      setLessonError(
        "No pudimos borrar la lección. Inténtalo de nuevo."
      );
    } finally {
      setDeletingLessonId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/admin/courses"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Back to courses
        </Link>

        {/* COURSE HEADER */}
        <section className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-xl font-bold text-primary">
                {course.level}
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Course {course.level}
                  </span>

                  <StatusBadge
                    status={course.isPublished ? "Published" : "Draft"}
                  />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-card-foreground md:text-4xl">
                  {course.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                disabled={publishing}
                onClick={handlePublicationChange}
                className={
                  course.isPublished
                    ? "flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/80 disabled:cursor-wait disabled:opacity-60"
                    : "flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
                }
              >
                <Upload size={17} />

                {publishing
                  ? "Actualizando..."
                  : course.isPublished
                    ? "Despublicar curso"
                    : "Publicar curso"}
              </button>

              <button className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-card-foreground transition hover:bg-accent hover:text-accent-foreground">
                <Eye size={17} />
                Preview
              </button>

              <button className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                <Pencil size={17} />
                Edit course
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {publicationError && (
            <p className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {publicationError}
            </p>
          )}
        </section>

        {/* STATS */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Layers3 size={20} />}
            label="Total lessons"
            value={totalLessons.toString()}
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Published lessons"
            value={publishedLessons.toString()}
          />

          <StatCard
            icon={<Users size={20} />}
            label="Students"
            value="0"
          />

          <StatCard
            icon={<BookOpen size={20} />}
            label="Progreso del curso"
            value={`${progress}%`}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">

          {/* LESSONS */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-primary">
                  Course content
                </p>

                <h2 className="mt-1 text-xl font-bold text-card-foreground">
                  Lessons
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage all lessons inside this course.
                </p>
              </div>

              <Link
                href={`/admin/courses/lessons/new?courseId=${courseId}`}
                className="flex w-fit items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <Plus size={17} />
                Add lesson
              </Link>
            </div>

            {/* PROGRESS */}
            <div className="mb-6 rounded-2xl bg-muted p-4">
              <div className="mb-2 flex items-center justify-between">

                <p className="text-sm font-semibold text-muted-foreground">
                  Published content
                </p>

                <span className="text-sm font-bold text-foreground">
                  {publishedLessons}/{totalLessons}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {lessonError && (
              <p
                role="alert"
                className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
              >
                {lessonError}
              </p>
            )}

            {course.lessons.length > 0 && (
              <div className="mb-6 space-y-3">
                {course.lessons
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {lesson.order}. {lesson.title}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {lesson.grammarPoint}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            lesson.isPublished
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {lesson.isPublished ? "Published" : "Draft"}
                        </span>

                        <Link
                          href={`/admin/courses/lessons/${lesson.id}`}
                          aria-label={`Edit ${lesson.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(lesson)}
                          disabled={deletingLessonId !== null}
                          aria-label={`Borrar ${lesson.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-destructive/20 text-destructive transition hover:bg-destructive/10 disabled:cursor-wait disabled:opacity-50"
                        >
                          {deletingLessonId === lesson.id ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <Link
              href={`/admin/courses/lessons?courseId=${courseId}`}
              className="group flex items-center justify-between rounded-2xl border border-border p-5 transition hover:border-primary/30 hover:bg-accent"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="font-bold text-card-foreground">
                    Manage lessons
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Create, edit, reorder and publish lessons.
                  </p>
                </div>
              </div>

              <span className="text-sm font-semibold text-primary transition group-hover:translate-x-1">
                Open →
              </span>
            </Link>
          </div>

          {/* COURSE DETAILS */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

            <p className="text-sm font-semibold text-primary">
              Course details
            </p>

            <h2 className="mt-1 text-xl font-bold text-card-foreground">
              Information
            </h2>

            <div className="mt-6 space-y-5">
              <InfoRow label="Level" value={course.level} />

              <InfoRow
                label="Status"
                value={course.isPublished ? "Published" : "Draft"}
              />

              <InfoRow
                label="Lessons"
                value={totalLessons.toString()}
              />

              <InfoRow
                label="Published"
                value={publishedLessons.toString()}
              />

              <InfoRow
                label="Students enrolled"
                value="0"
              />
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground">
                <Pencil size={16} />
                Edit course information
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-2xl font-bold text-card-foreground">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "Published";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        published
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}