"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type CourseStatus = "Published" | "Draft" | "In progress";

type Course = {
  id: string;
  level: string;
  title: string;
  description: string;
  lessons: number;
  students: number;
  status: CourseStatus;
};

type ApiCourse = {
  id: string;
  level: string;
  title: string;
  description: string;
  isPublished: boolean;
  lessonCount: number;
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);
  const [editError, setEditError] = useState("");

  const [newCourse, setNewCourse] = useState({
    level: "A2",
    title: "Everyday English",
    description:
      "Learn to communicate about daily life, experiences, plans and the world around you.",
    isPublished: false,
  });

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await apiFetch<ApiCourse[]>("/api/admin/courses");

        setCourses(
          data.map((course) => ({
            id: course.id,
            level: course.level,
            title: course.title,
            description: course.description,
            lessons: course.lessonCount,
            students: 0,
            status: course.isPublished ? "Published" : "In progress",
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Could not load courses.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const query = search.toLowerCase();

    return (
      course.title.toLowerCase().includes(query) ||
      course.level.toLowerCase().includes(query)
    );
  });

  const handleCreateCourse = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setCreating(true);
    setCreateError("");

    try {
      const course = await apiFetch<ApiCourse>("/api/admin/courses", {
        method: "POST",
        body: JSON.stringify(newCourse),
      });

      setCourses((currentCourses) => [
        {
          id: course.id,
          level: course.level,
          title: course.title,
          description: course.description,
          lessons: course.lessonCount,
          students: 0,
          status: course.isPublished ? "Published" : "In progress",
        },
        ...currentCourses,
      ]);

      setShowCreateForm(false);
      setNewCourse({
        level: "",
        title: "",
        description: "",
        isPublished: false,
      });
    } catch (err) {
      console.error(err);
      setCreateError(
        "No pudimos crear el curso. Revisa los datos e inténtalo de nuevo."
      );
    } finally {
      setCreating(false);
    }
  };

  const openEditForm = (course: Course) => {
    setOpenMenu(null);
    setEditingCourse(course);
    setEditedTitle(course.title);
    setEditError("");
  };

  const handleEditCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCourse) return;

    setSavingTitle(true);
    setEditError("");

    try {
      const updatedCourse = await apiFetch<ApiCourse>(
        `/api/admin/courses/${editingCourse.id}`,
        { method: "PATCH", body: JSON.stringify({ title: editedTitle }) }
      );

      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course.id === updatedCourse.id
            ? { ...course, title: updatedCourse.title }
            : course
        )
      );
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
      setEditError("No pudimos cambiar el nombre. Inténtalo de nuevo.");
    } finally {
      setSavingTitle(false);
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    setCourses((currentCourses) =>
      currentCourses.filter((course) => course.id !== id)
    );

    setOpenMenu(null);
  };

  const handlePublicationChange = async (course: Course) => {
    const isPublished = course.status !== "Published";

    setUpdatingCourseId(course.id);

    try {
      await apiFetch(`/api/admin/courses/${course.id}/publication`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished }),
      });

      setCourses((currentCourses) =>
        currentCourses.map((currentCourse) =>
          currentCourse.id === course.id
            ? {
                ...currentCourse,
                status: isPublished ? "Published" : "In progress",
              }
            : currentCourse
        )
      );

      setOpenMenu(null);
    } catch (err) {
      console.error(err);

      window.alert(
        "No pudimos actualizar la publicación del curso. Inténtalo de nuevo."
      );
    } finally {
      setUpdatingCourseId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-6 py-8 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl text-sm font-medium text-muted-foreground">
          Loading courses...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background px-6 py-8 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <BookOpen size={17} />
              Admin workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Courses
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Create, organize and manage every Bright English course from one
              place.
            </p>
          </div>

          <button
            onClick={() => {
              setCreateError("");
              setShowCreateForm(true);
            }}
            className="flex w-fit items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Plus size={18} />
            Crear nuevo curso
          </button>

        </section>

        {/* STATS */}
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

        {/* SEARCH */}
        <section className="mb-6 flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-input bg-muted py-3 pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-4 focus:ring-ring/20"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {filteredCourses.length}{" "}
            {filteredCourses.length === 1 ? "course" : "courses"}
          </p>
        </section>

        {/* COURSES TABLE */}
        <section className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="hidden grid-cols-[1.5fr_100px_120px_130px_130px_70px] gap-4 border-b border-border bg-muted/60 px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground lg:grid">
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
                onEdit={openEditForm}
                onPublicationChange={handlePublicationChange}
                isUpdating={updatingCourseId === course.id}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Search size={24} />
              </div>

              <h2 className="font-semibold text-foreground">
                No courses found
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Try searching by course name or CEFR level.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* CREATE COURSE MODAL */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-5">
          <form
            onSubmit={handleCreateCourse}
            className="w-full max-w-lg rounded-3xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Nuevo curso
                </span>

                <h2 className="mt-3 text-2xl font-bold text-popover-foreground">
                  Crear un nuevo curso
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Define el nivel y el nombre del curso. Después podrás entrar y agregar sus lecciones.
                </p>
              </div>

              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <label className="mt-6 block text-sm font-semibold text-foreground">
              Nivel

              <input
                required
                maxLength={10}
                placeholder="Ej. B1"
                value={newCourse.level}
                onChange={(event) =>
                  setNewCourse((course) => ({
                    ...course,
                    level: event.target.value.toUpperCase(),
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
              />
            </label>

            <label className="mt-5 block text-sm font-semibold text-foreground">
              Nombre del curso

              <input
                required
                maxLength={120}
                value={newCourse.title}
                onChange={(event) =>
                  setNewCourse((course) => ({
                    ...course,
                    title: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
              />
            </label>

            <label className="mt-5 block text-sm font-semibold text-foreground">
              Descripción

              <textarea
                required
                maxLength={500}
                rows={4}
                value={newCourse.description}
                onChange={(event) =>
                  setNewCourse((course) => ({
                    ...course,
                    description: event.target.value,
                  }))
                }
                className="mt-2 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
              />
            </label>

            <label className="mt-5 flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <input
                type="checkbox"
                checked={newCourse.isPublished}
                onChange={(event) =>
                  setNewCourse((course) => ({
                    ...course,
                    isPublished: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-primary"
              />

              Publicar el curso al crearlo
            </label>

            {createError && (
              <p className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {createError}
              </p>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                Cancelar
              </button>

              <button
                disabled={creating}
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {creating ? "Creando..." : "Crear curso"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-5">
          <form
            onSubmit={handleEditCourse}
            className="w-full max-w-lg rounded-3xl border border-border bg-popover p-6 text-popover-foreground shadow-2xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Nivel {editingCourse.level}
                </span>
                <h2 className="mt-3 text-2xl font-bold">Editar nombre del curso</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  El nuevo nombre se mostrará a administradores y estudiantes.
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setEditingCourse(null)}
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-accent"
              >
                <X size={20} />
              </button>
            </div>

            <label className="mt-6 block text-sm font-semibold text-foreground">
              Nombre del curso
              <input
                required
                autoFocus
                maxLength={120}
                value={editedTitle}
                onChange={(event) => setEditedTitle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
              />
            </label>

            {editError && (
              <p className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {editError}
              </p>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                disabled={savingTitle}
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                {savingTitle ? "Guardando..." : "Guardar nombre"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function CourseRow({
  course,
  openMenu,
  setOpenMenu,
  onDelete,
  onPublicationChange,
  isUpdating,
  onEdit
}: {
  course: Course;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onDelete: (id: string) => void;
  onPublicationChange: (course: Course) => void;
  isUpdating: boolean;
  onEdit: (course: Course) => void;
}) {
  return (
    <article className="relative border-b border-border p-5 transition last:border-b-0 hover:bg-accent/50 lg:grid lg:grid-cols-[1.5fr_100px_120px_130px_130px_70px] lg:items-center lg:gap-4 lg:px-6">

      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
          {course.level}
        </div>

        <div>
          <Link
            href={`/admin/courses/${course.id}`}
            className="font-bold text-card-foreground transition hover:text-primary"
          >
            {course.title}
          </Link>

          <p className="mt-1 max-w-lg text-sm leading-5 text-muted-foreground">
            {course.description}
          </p>
        </div>
      </div>

      <div className="mt-5 lg:mt-0">
        <MobileLabel>Level</MobileLabel>

        <span className="font-semibold text-foreground">
          {course.level}
        </span>
      </div>

      <div className="mt-4 lg:mt-0">
        <MobileLabel>Lessons</MobileLabel>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Layers3 size={16} />
          {course.lessons}
        </div>
      </div>

      <div className="mt-4 lg:mt-0">
        <MobileLabel>Students</MobileLabel>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Users size={16} />
          {course.students}
        </div>
      </div>

      <div className="mt-4 lg:mt-0">
        <MobileLabel>Status</MobileLabel>
        <StatusBadge status={course.status} />
      </div>

      <div className="absolute right-5 top-5 lg:static">
        <button
          onClick={() =>
            setOpenMenu(openMenu === course.id ? null : course.id)
          }
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
        >
          <MoreVertical size={19} />
        </button>

        {openMenu === course.id && (
          <div className="absolute right-5 top-14 z-20 w-48 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl lg:right-6 lg:top-16">

            <button
              type="button"
              onClick={() => onEdit(course)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <Pencil size={16} />
              Editar nombre
            </button>

            <Link
              href={`/admin/courses/${course.id}`}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <BookOpen size={16} />
              Manage lessons
            </Link>

            <ActionButton icon={<Copy size={16} />}>
              Duplicate
            </ActionButton>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onPublicationChange(course)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-wait disabled:opacity-60"
            >
              {course.status === "Published" ? (
                <Archive size={16} />
              ) : (
                <Eye size={16} />
              )}

              {isUpdating
                ? "Actualizando..."
                : course.status === "Published"
                  ? "Despublicar curso"
                  : "Publicar curso"}
            </button>

            <div className="my-1 border-t border-border" />

            <button
              onClick={() => onDelete(course.id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/10"
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
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
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

function StatusBadge({ status }: { status: CourseStatus }) {
  const styles: Record<CourseStatus, string> = {
    Published: "bg-primary/10 text-primary",
    Draft: "bg-muted text-muted-foreground",
    "In progress": "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function MobileLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground lg:hidden">
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
    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
      {icon}
      {children}
    </button>
  );
}