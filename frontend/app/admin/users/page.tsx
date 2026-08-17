"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Users,
  Flame,
  BookOpen,
  Mail,
  Clock3,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  level: string;
  streak: number;
  lessonsCompleted: number;
  activityScore: number;
  lastActive: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Sofía Martínez",
    email: "sofia.martinez@email.com",
    level: "A2",
    streak: 24,
    lessonsCompleted: 18,
    activityScore: 96,
    lastActive: "Today",
  },
  {
    id: 2,
    name: "Daniel Rojas",
    email: "daniel.rojas@email.com",
    level: "A2",
    streak: 17,
    lessonsCompleted: 15,
    activityScore: 88,
    lastActive: "Today",
  },
  {
    id: 3,
    name: "Camila Torres",
    email: "camila.torres@email.com",
    level: "A2",
    streak: 11,
    lessonsCompleted: 12,
    activityScore: 76,
    lastActive: "Yesterday",
  },
  {
    id: 4,
    name: "Martín Silva",
    email: "martin.silva@email.com",
    level: "A2",
    streak: 7,
    lessonsCompleted: 9,
    activityScore: 61,
    lastActive: "2 days ago",
  },
  {
    id: 5,
    name: "Valentina Pérez",
    email: "valentina.perez@email.com",
    level: "A2",
    streak: 3,
    lessonsCompleted: 6,
    activityScore: 43,
    lastActive: "4 days ago",
  },
  {
    id: 6,
    name: "Tomás Herrera",
    email: "tomas.herrera@email.com",
    level: "A2",
    streak: 0,
    lessonsCompleted: 2,
    activityScore: 16,
    lastActive: "12 days ago",
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const users = useMemo(() => {
    return [...initialUsers]
      .filter((user) => {
        const query = search.toLowerCase();

        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.activityScore - a.activityScore);
  }, [search]);

  const activeToday = initialUsers.filter(
    (user) => user.lastActive === "Today"
  ).length;

  const averageStreak = Math.round(
    initialUsers.reduce((total, user) => total + user.streak, 0) /
      initialUsers.length
  );

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-600">
            <Users size={17} />
            Admin workspace
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Users
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            See who is learning consistently and how active your students are.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users size={20} />}
            label="Total students"
            value={initialUsers.length.toString()}
          />

          <StatCard
            icon={<Flame size={20} />}
            label="Active today"
            value={activeToday.toString()}
          />

          <StatCard
            icon={<Flame size={20} />}
            label="Average streak"
            value={`${averageStreak} days`}
          />
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
              placeholder="Search students..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <p className="text-sm font-medium text-slate-400">
            Sorted by activity
          </p>
        </section>

        {/* Users */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="hidden grid-cols-[60px_1.4fr_1.7fr_90px_110px_130px_120px] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 lg:grid">
            <span>#</span>
            <span>Student</span>
            <span>Email</span>
            <span>Level</span>
            <span>Streak</span>
            <span>Lessons</span>
            <span>Last active</span>
          </div>

          {users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              position={index + 1}
            />
          ))}

          {users.length === 0 && (
            <div className="py-20 text-center">
              <Search
                size={28}
                className="mx-auto mb-4 text-slate-300"
              />

              <h2 className="font-semibold text-slate-800">
                No students found
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Try searching by name or email.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function UserRow({
  user,
  position,
}: {
  user: User;
  position: number;
}) {
  return (
    <article className="border-b border-slate-100 p-5 transition last:border-b-0 hover:bg-slate-50/60 lg:grid lg:grid-cols-[60px_1.4fr_1.7fr_90px_110px_130px_120px] lg:items-center lg:gap-4 lg:px-6">
      {/* Rank */}
      <div className="mb-4 lg:mb-0">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
            position === 1
              ? "bg-amber-100 text-amber-700"
              : position === 2
              ? "bg-slate-200 text-slate-600"
              : position === 3
              ? "bg-orange-100 text-orange-700"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {position}
        </div>
      </div>

      {/* Student */}
      <div>
        <p className="font-bold text-slate-900">
          {user.name}
        </p>

        <div className="mt-1 lg:hidden">
          <ActivityBadge score={user.activityScore} />
        </div>
      </div>

      {/* Email */}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 lg:mt-0">
        <Mail size={15} className="text-slate-300" />
        {user.email}
      </div>

      {/* Level */}
      <div className="mt-4 lg:mt-0">
        <span className="inline-flex rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-bold text-purple-600">
          {user.level}
        </span>
      </div>

      {/* Streak */}
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700 lg:mt-0">
        <Flame size={16} className="text-orange-500" />
        {user.streak} days
      </div>

      {/* Lessons */}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 lg:mt-0">
        <BookOpen size={16} className="text-purple-400" />
        {user.lessonsCompleted}
      </div>

      {/* Last active */}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-400 lg:mt-0">
        <Clock3 size={15} />
        {user.lastActive}
      </div>
    </article>
  );
}

function ActivityBadge({ score }: { score: number }) {
  let styles = "bg-slate-100 text-slate-500";

  if (score >= 80) {
    styles = "bg-emerald-50 text-emerald-600";
  } else if (score >= 50) {
    styles = "bg-amber-50 text-amber-600";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${styles}`}
    >
      {score}% activity
    </span>
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