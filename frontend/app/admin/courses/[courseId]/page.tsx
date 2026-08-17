"use client";

import Link from "next/link";
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
} from "lucide-react";

const course = {
  id: "2",
  level: "A2",
  title: "Everyday English",
  description:
    "Learn to communicate comfortably in everyday situations with practical grammar, vocabulary, reading, writing and speaking practice.",
  status: "Published",
  lessons: 10,
  publishedLessons: 7,
  students: 84,
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const progress =
    course.lessons === 0
      ? 0
      : Math.round((course.publishedLessons / course.lessons) * 100);

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          href="/admin/courses"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to courses
        </Link>

        {/* Header */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-purple-100 text-xl font-bold text-purple-600">
                {course.level}
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-600">
                    Course {courseId}
                  </span>

                  <StatusBadge status={course.status} />
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
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Layers3 size={20} />}
            label="Total lessons"
            value={course.lessons.toString()}
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Published lessons"
            value={course.publishedLessons.toString()}
          />

          <StatCard
            icon={<Users size={20} />}
            label="Students"
            value={course.students.toString()}
          />

          <StatCard
            icon={<BookOpen size={20} />}
            label="Course progress"
            value={`${progress}%`}
          />
        </section>

        {/* Main content */}
        <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Lessons */}
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
                href={`/admin/courses/${courseId}/lessons/new`}
                className="flex w-fit items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                <Plus size={17} />
                Add lesson
              </Link>
            </div>

            {/* Progress */}
            <div className="mb-6 rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  Published content
                </p>

                <span className="text-sm font-bold text-slate-800">
                  {course.publishedLessons}/{course.lessons}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Shortcut */}
            <Link
              href={`/admin/courses/${courseId}/lessons`}
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

          {/* Course info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-purple-600">
              Course details
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Information
            </h2>

            <div className="mt-6 space-y-5">
              <InfoRow label="Level" value={course.level} />

              <InfoRow label="Status" value={course.status} />

              <InfoRow
                label="Lessons"
                value={course.lessons.toString()}
              />

              <InfoRow
                label="Published"
                value={course.publishedLessons.toString()}
              />

              <InfoRow
                label="Students enrolled"
                value={course.students.toString()}
              />
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

      <p className="text-2xl font-bold text-slate-900">
        {value}
      </p>

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
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
      {status}
    </span>
  );
}