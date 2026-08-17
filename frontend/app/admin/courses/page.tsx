"use client";

import { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreVertical,
  Users,
  Layers3,
  Eye,
  Copy,
  Archive,
} from "lucide-react";

type CourseStatus = "Published" | "Draft" | "In progress";

type Course = {
  id: number;
  level: string;
  title: string;
  description: string;
  lessons: number;
  students: number;
  status: CourseStatus;
};

const initialCourses: Course[] = [
  {
    id: 1,
    level: "A1",
    title: "English Foundations",
    description:
      "Build the essential foundations of English through simple grammar, vocabulary and communication.",
    lessons: 10,
    students: 0,
    status: "In progress",
  },
  {
    id: 2,
    level: "A2",
    title: "Everyday English",
    description:
      "Learn to communicate comfortably in everyday situations with practical grammar and vocabulary.",
    lessons: 10,
    students: 84,
    status: "Published",
  },
  {
    id: 3,
    level: "B1",
    title: "Independent English",
    description:
      "Develop confidence expressing ideas, experiences and opinions in English.",
    lessons: 0,
    students: 0,
    status: "In progress",
  },
  {
    id: 4,
    level: "B2",
    title: "Confident English",
    description:
      "Strengthen fluency, accuracy and communication for more complex situations.",
    lessons: 0,
    students: 0,
    status: "In progress",
  },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filteredCourses = courses.filter((course) => {
    const query = search.toLowerCase();

    return (
      course.title.toLowerCase().includes(query) ||
      course.level.toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    setCourses((currentCourses) =>
      currentCourses.filter((course) => course.id !== id)
    );

    setOpenMenu(null);
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-600">
              <BookOpen size={17} />
              Admin workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Courses
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Create, organize and manage every Bright English course from one
              place.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">
            <Plus size={18} />
            Add course
          </button>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total courses"
            value={courses.length.toString()}
            icon={<BookOpen size={20} />}
          />

          <StatCard
            label="Published"
            value={courses
              .filter((course) => course.status === "Published")
              .length.toString()}
            icon={<Eye size={20} />}
          />

          <StatCard
            label="Total lessons"
            value={courses
              .reduce((total, course) => total + course.lessons, 0)
              .toString()}
            icon={<Layers3 size={20} />}
          />

          <StatCard
            label="Students enrolled"
            value={courses
              .reduce((total, course) => total + course.students, 0)
              .toString()}
            icon={<Users size={20} />}
          />
        </section>

        {/* Search / filters */}
        <section className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <p className="text-sm text-slate-400">
            {filteredCourses.length}{" "}
            {filteredCourses.length === 1 ? "course" : "courses"}
          </p>
        </section>

        {/* Course table */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.5fr_100px_120px_130px_130px_70px] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 lg:grid">
            <span>Course</span>
            <span>Level</span>
            <span>Lessons</span>
            <span>Students</span>
            <span>Status</span>
            <span />
          </div>

          <div>
            {filteredCourses.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
                <Search size={24} />
              </div>

              <h2 className="font-semibold text-slate-800">
                No courses found
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Try searching by course name or CEFR level.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CourseRow({
  course,
  openMenu,
  setOpenMenu,
  onDelete,
}: {
  course: Course;
  openMenu: number | null;
  setOpenMenu: (id: number | null) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <article className="relative border-b border-slate-100 p-5 transition last:border-b-0 hover:bg-slate-50/70 lg:grid lg:grid-cols-[1.5fr_100px_120px_130px_130px_70px] lg:items-center lg:gap-4 lg:px-6">
      {/* Course */}
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 font-bold text-purple-600">
          {course.level}
        </div>

        <div>
          <h2 className="font-bold text-slate-900">{course.title}</h2>

          <p className="mt-1 max-w-lg text-sm leading-5 text-slate-400">
            {course.description}
          </p>
        </div>
      </div>

      {/* Level */}
      <div className="mt-5 lg:mt-0">
        <MobileLabel>Level</MobileLabel>

        <span className="font-semibold text-slate-700">{course.level}</span>
      </div>

      {/* Lessons */}
      <div className="mt-4 lg:mt-0">
        <MobileLabel>Lessons</MobileLabel>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Layers3 size={16} className="text-slate-400" />
          {course.lessons}
        </div>
      </div>

      {/* Students */}
      <div className="mt-4 lg:mt-0">
        <MobileLabel>Students</MobileLabel>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Users size={16} className="text-slate-400" />
          {course.students}
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 lg:mt-0">
        <MobileLabel>Status</MobileLabel>

        <StatusBadge status={course.status} />
      </div>

      {/* Actions */}
      <div className="absolute right-5 top-5 lg:static">
        <button
          onClick={() =>
            setOpenMenu(openMenu === course.id ? null : course.id)
          }
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <MoreVertical size={19} />
        </button>

        {openMenu === course.id && (
          <div className="absolute right-5 top-14 z-20 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl lg:right-6 lg:top-16">
            <ActionButton icon={<Pencil size={16} />}>Edit course</ActionButton>

            <ActionButton icon={<BookOpen size={16} />}>
              Manage lessons
            </ActionButton>

            <ActionButton icon={<Copy size={16} />}>
              Duplicate
            </ActionButton>

            <ActionButton icon={<Archive size={16} />}>
              Unpublish
            </ActionButton>

            <div className="my-1 border-t border-slate-100" />

            <button
              onClick={() => onDelete(course.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete course
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-slate-900">{value}</p>

      <p className="mt-1 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: CourseStatus }) {
  const styles: Record<CourseStatus, string> = {
    Published: "bg-emerald-50 text-emerald-600",
    Draft: "bg-amber-50 text-amber-600",
    "In progress": "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function MobileLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400 lg:hidden">
      {children}
    </p>
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