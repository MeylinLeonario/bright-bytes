"use client";

import { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
  GripVertical,
  FileText,
  Headphones,
  Mic,
  PenLine,
  Languages,
  Copy,
} from "lucide-react";

type LessonStatus = "Published" | "Draft" | "Hidden";

type Lesson = {
  id: number;
  number: number;
  title: string;
  grammar: string;
  vocabulary: number;
  readings: number;
  status: LessonStatus;
};

const initialLessons: Lesson[] = [
  {
    id: 1,
    number: 1,
    title: "Great places to be",
    grammar: "Present simple vs present continuous",
    vocabulary: 5,
    readings: 3,
    status: "Published",
  },
  {
    id: 2,
    number: 2,
    title: "People and routines",
    grammar: "Adverbs of frequency",
    vocabulary: 5,
    readings: 3,
    status: "Published",
  },
  {
    id: 3,
    number: 3,
    title: "Talking about the past",
    grammar: "Past simple",
    vocabulary: 5,
    readings: 3,
    status: "Published",
  },
  {
    id: 4,
    number: 4,
    title: "Life experiences",
    grammar: "Present perfect",
    vocabulary: 5,
    readings: 3,
    status: "Draft",
  },
  {
    id: 5,
    number: 5,
    title: "Plans and possibilities",
    grammar: "Be going to",
    vocabulary: 5,
    readings: 3,
    status: "Hidden",
  },
];

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filteredLessons = lessons.filter((lesson) => {
    const query = search.toLowerCase();

    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.grammar.toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) return;

    setLessons((current) =>
      current.filter((lesson) => lesson.id !== id)
    );

    setOpenMenu(null);
  };

  const toggleVisibility = (id: number) => {
    setLessons((current) =>
      current.map((lesson) => {
        if (lesson.id !== id) return lesson;

        return {
          ...lesson,
          status:
            lesson.status === "Published"
              ? "Hidden"
              : "Published",
        };
      })
    );

    setOpenMenu(null);
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">

        {/* Course breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">
          <span>Courses</span>
          <span>/</span>
          <span className="font-medium text-slate-600">
            A2 · Everyday English
          </span>
        </div>

        {/* Header */}
        <section className="mb-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-600">
              <BookOpen size={17} />
              Course content
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Lessons
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Create, organize and manage the lessons inside Everyday English.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">
            <Plus size={18} />
            Add lesson
          </button>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total lessons"
            value={lessons.length.toString()}
          />

          <StatCard
            label="Published"
            value={lessons
              .filter((lesson) => lesson.status === "Published")
              .length.toString()}
          />

          <StatCard
            label="Drafts"
            value={lessons
              .filter((lesson) => lesson.status === "Draft")
              .length.toString()}
          />

          <StatCard
            label="Course completion"
            value={`${Math.round(
              (lessons.filter(
                (lesson) => lesson.status === "Published"
              ).length /
                10) *
                100
            )}%`}
          />
        </section>

        {/* Lesson structure reminder */}
        <section className="mb-8 rounded-3xl border border-purple-100 bg-purple-50/60 p-5">
          <p className="mb-4 text-sm font-bold text-purple-700">
            Every lesson includes
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Feature icon={<BookOpen size={16} />} label="Grammar" />
            <Feature icon={<Languages size={16} />} label="5 words" />
            <Feature icon={<Languages size={16} />} label="Translator" />
            <Feature icon={<PenLine size={16} />} label="Writing" />
            <Feature icon={<Mic size={16} />} label="Speaking" />
            <Feature icon={<Headphones size={16} />} label="3 readings" />
          </div>
        </section>

        {/* Search */}
        <section className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lessons..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <p className="text-sm text-slate-400">
            {filteredLessons.length} lessons
          </p>
        </section>

        {/* Lessons */}
        <section className="overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm">
          {filteredLessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onDelete={handleDelete}
              onToggleVisibility={toggleVisibility}
            />
          ))}

          {filteredLessons.length === 0 && (
            <div className="flex flex-col items-center py-20 text-center">
              <Search className="mb-4 text-slate-300" size={28} />

              <h2 className="font-semibold text-slate-800">
                No lessons found
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Try another lesson title or grammar point.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function LessonRow({
  lesson,
  openMenu,
  setOpenMenu,
  onDelete,
  onToggleVisibility,
}: {
  lesson: Lesson;
  openMenu: number | null;
  setOpenMenu: (id: number | null) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
}) {
  return (
    <article className="relative border-b border-slate-100 p-5 transition last:border-b-0 hover:bg-slate-50/60 md:p-6">
      <div className="flex items-start gap-4">

        {/* Drag */}
        <button className="mt-3 hidden cursor-grab text-slate-300 hover:text-slate-500 md:block">
          <GripVertical size={19} />
        </button>

        {/* Number */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-sm font-bold text-purple-600">
          {lesson.number}
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Lesson {lesson.number}
              </p>

              <h2 className="text-lg font-bold text-slate-900">
                {lesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={lesson.status} />

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenu(
                      openMenu === lesson.id ? null : lesson.id
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <MoreVertical size={19} />
                </button>

                {openMenu === lesson.id && (
                  <div className="absolute right-0 top-11 z-30 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <ActionButton
                      icon={<Eye size={16} />}
                    >
                      Preview lesson
                    </ActionButton>

                    <ActionButton
                      icon={<Pencil size={16} />}
                    >
                      Edit lesson
                    </ActionButton>

                    <ActionButton
                      icon={<Copy size={16} />}
                    >
                      Duplicate lesson
                    </ActionButton>

                    <button
                      onClick={() =>
                        onToggleVisibility(lesson.id)
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      {lesson.status === "Published" ? (
                        <>
                          <EyeOff size={16} />
                          Hide from students
                        </>
                      ) : (
                        <>
                          <Eye size={16} />
                          Publish lesson
                        </>
                      )}
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => onDelete(lesson.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete lesson
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grammar */}
          <div className="mt-5 flex items-center gap-2 text-sm">
            <FileText size={16} className="text-purple-500" />

            <span className="font-medium text-slate-500">
              Grammar:
            </span>

            <span className="text-slate-700">
              {lesson.grammar}
            </span>
          </div>

          {/* Content summary */}
          <div className="mt-4 flex flex-wrap gap-2">
            <ContentBadge
              icon={<Languages size={14} />}
              label={`${lesson.vocabulary} vocabulary words`}
            />

            <ContentBadge
              icon={<PenLine size={14} />}
              label="Writing"
            />

            <ContentBadge
              icon={<Mic size={14} />}
              label="Speaking"
            />

            <ContentBadge
              icon={<Headphones size={14} />}
              label={`${lesson.readings} mini readings`}
            />

            <ContentBadge
              icon={<Languages size={14} />}
              label="Translator"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-purple-700">
      {icon}
      {label}
    </div>
  );
}

function ContentBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-500">
      {icon}
      {label}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: LessonStatus;
}) {
  const styles: Record<LessonStatus, string> = {
    Published: "bg-emerald-50 text-emerald-600",
    Draft: "bg-amber-50 text-amber-600",
    Hidden: "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
      {icon}
      {children}
    </button>
  );
}