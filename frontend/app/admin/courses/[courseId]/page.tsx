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
      <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl text-sm font-medium text-slate-500">
          Loading course...
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
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
      setPublicationError("No pudimos actualizar la publicación del curso. Inténtalo de nuevo.");
    } finally {
      setPublishing(false);
    }
  };


  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/courses"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to courses
        </Link>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-purple-100 text-xl font-bold text-purple-600">
                {course.level}
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-600">
                    Course {course.level}
                  </span>

                  <StatusBadge
                    status={course.isPublished ? "Published" : "Draft"}
                  />
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {course.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={publishing}
                onClick={handlePublicationChange}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-wait disabled:opacity-60 ${
                  course.isPublished
                    ? "bg-slate-600 hover:bg-slate-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                <Upload size={17} />
                {publishing
                  ? "Actualizando..."
                  : course.isPublished
                    ? "Despublicar curso"
                    : "Publicar curso"}
              </button>
              <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                <Eye size={17} />
                Preview
              </button>

              <button className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                <Pencil size={17} />
                Edit course
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
          {publicationError && (
            <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {publicationError}
            </p>
          )}
        </section>

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
            label="Course progress"
            value={`${progress}%`}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600">
                  Course content
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Lessons
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Manage all lessons inside this course.
                </p>
              </div>

              <Link
                href={`/admin/courses/lessons/new?courseId=${courseId}`}
                className="flex w-fit items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                <Plus size={17} />
                Add lesson
              </Link>
            </div>

            <div className="mb-6 rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  Published content
                </p>

                <span className="text-sm font-bold text-slate-800">
                  {publishedLessons}/{totalLessons}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {course.lessons.length > 0 && (
              <div className="mb-6 space-y-3">
                {course.lessons
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {lesson.order}. {lesson.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {lesson.grammarPoint}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          lesson.isPublished
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {lesson.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            <Link
              href={`/admin/courses/lessons?courseId=${courseId}`}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 p-5 transition hover:border-purple-200 hover:bg-purple-50/40"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <FileText size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Manage lessons
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Create, edit, reorder and publish lessons.
                  </p>
                </div>
              </div>

              <span className="text-sm font-semibold text-purple-600 transition group-hover:translate-x-1">
                Open →
              </span>
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-purple-600">
              Course details
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Information
            </h2>

            <div className="mt-6 space-y-5">
              <InfoRow label="Level" value={course.level} />
              <InfoRow
                label="Status"
                value={course.isPublished ? "Published" : "Draft"}
              />
              <InfoRow label="Lessons" value={totalLessons.toString()} />
              <InfoRow label="Published" value={publishedLessons.toString()} />
              <InfoRow label="Students enrolled" value="0" />
            </div>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
        {icon}
      </div>

      <p className="text-2xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-sm font-medium text-slate-400">
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
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "Published";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        published
          ? "bg-emerald-50 text-emerald-600"
          : "bg-amber-50 text-amber-600"
      }`}
    >
      {status}
    </span>
  );
}