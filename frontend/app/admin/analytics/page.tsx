"use client";

import {
  Users,
  BookOpen,
  Flame,
  Clock3,
  TrendingUp,
  UserRound,
  Languages,
  Activity,
} from "lucide-react";

const ageRanges = [
  { label: "13–17", value: 8 },
  { label: "18–24", value: 34 },
  { label: "25–34", value: 42 },
  { label: "35–44", value: 27 },
  { label: "45–54", value: 16 },
  { label: "55+", value: 9 },
];

const levelDistribution = [
  { label: "A1", value: 14 },
  { label: "A2", value: 68 },
  { label: "B1", value: 11 },
  { label: "B2", value: 7 },
];

const activityByDay = [
  { day: "Mon", users: 61 },
  { day: "Tue", users: 75 },
  { day: "Wed", users: 69 },
  { day: "Thu", users: 82 },
  { day: "Fri", users: 73 },
  { day: "Sat", users: 91 },
  { day: "Sun", users: 86 },
];

const coursePerformance = [
  {
    course: "A2 · Everyday English",
    students: 84,
    completion: 71,
    averageLessons: 6.8,
  },
  {
    course: "A1 · English Foundations",
    students: 21,
    completion: 42,
    averageLessons: 3.4,
  },
  {
    course: "B1 · Independent English",
    students: 13,
    completion: 18,
    averageLessons: 1.9,
  },
];

export default function AdminAnalyticsPage() {
  const totalAgeUsers = ageRanges.reduce(
    (total, item) => total + item.value,
    0
  );

  const maxAgeValue = Math.max(...ageRanges.map((item) => item.value));
  const maxActivity = Math.max(
    ...activityByDay.map((item) => item.users)
  );

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-600">
            <Activity size={17} />
            Admin workspace
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Analytics
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
            Understand who is using Bright English, how they learn and where
            students are making progress.
          </p>
        </section>

        {/* Main stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Users size={20} />}
            label="Total students"
            value="136"
            detail="+18 this month"
          />

          <StatCard
            icon={<Activity size={20} />}
            label="Monthly active users"
            value="104"
            detail="76% of students"
          />

          <StatCard
            icon={<BookOpen size={20} />}
            label="Lessons completed"
            value="892"
            detail="+124 this week"
          />

          <StatCard
            icon={<Flame size={20} />}
            label="Average streak"
            value="8.4 days"
            detail="Top streak: 31 days"
          />
        </section>

        {/* Demographics */}
        <section className="mb-6 grid gap-6 xl:grid-cols-2">
          {/* Age */}
          <DashboardCard
            title="Age distribution"
            description="See which age groups are using the platform."
            icon={<UserRound size={19} />}
          >
            <div className="space-y-5">
              {ageRanges.map((range) => {
                const percentage = Math.round(
                  (range.value / totalAgeUsers) * 100
                );

                return (
                  <div key={range.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        {range.label}
                      </span>

                      <span className="text-sm text-slate-400">
                        {range.value} students · {percentage}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{
                          width: `${
                            (range.value / maxAgeValue) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardCard>

          {/* Level */}
          <DashboardCard
            title="English level"
            description="Current CEFR level distribution across students."
            icon={<Languages size={19} />}
          >
            <div className="grid grid-cols-2 gap-4">
              {levelDistribution.map((level) => (
                <div
                  key={level.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 font-bold text-purple-600">
                    {level.label}
                  </div>

                  <p className="text-2xl font-bold text-slate-900">
                    {level.value}%
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    of students
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </section>

        {/* Activity */}
        <section className="mb-6 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <DashboardCard
            title="Weekly activity"
            description="Number of active students by day."
            icon={<TrendingUp size={19} />}
          >
            <div className="flex h-72 items-end gap-3">
              {activityByDay.map((day) => (
                <div
                  key={day.day}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="mb-2 text-center text-xs font-semibold text-slate-500">
                    {day.users}
                  </div>

                  <div className="flex flex-1 items-end">
                    <div
                      className="w-full rounded-t-xl bg-purple-500"
                      style={{
                        height: `${
                          (day.users / maxActivity) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-center text-xs font-semibold text-slate-400">
                    {day.day}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Learning behavior */}
          <DashboardCard
            title="Learning behaviour"
            description="A quick overview of how students study."
            icon={<Clock3 size={19} />}
          >
            <div className="space-y-5">
              <MetricRow
                label="Average session"
                value="18 min"
              />

              <MetricRow
                label="Lessons per active student"
                value="3.7 / week"
              />

              <MetricRow
                label="Students active 3+ days/week"
                value="62%"
              />

              <MetricRow
                label="Students with 7+ day streak"
                value="41%"
              />

              <MetricRow
                label="Returning students"
                value="74%"
              />

              <MetricRow
                label="Most active hour"
                value="20:00"
              />
            </div>
          </DashboardCard>
        </section>

        {/* Courses */}
        <section className="mb-6">
          <DashboardCard
            title="Course performance"
            description="Compare engagement and completion between courses."
            icon={<BookOpen size={19} />}
          >
            <div className="overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Course</span>
                  <span>Students</span>
                  <span>Completion</span>
                  <span>Avg. lessons</span>
                </div>

                {coursePerformance.map((course) => (
                  <div
                    key={course.course}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-slate-100 py-5 last:border-b-0"
                  >
                    <span className="font-semibold text-slate-800">
                      {course.course}
                    </span>

                    <span className="text-sm text-slate-500">
                      {course.students}
                    </span>

                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-700">
                        {course.completion}%
                      </p>

                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-purple-500"
                          style={{
                            width: `${course.completion}%`,
                          }}
                        />
                      </div>
                    </div>

                    <span className="text-sm text-slate-500">
                      {course.averageLessons}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DashboardCard>
        </section>

        {/* Retention + demographics */}
        <section className="grid gap-6 xl:grid-cols-3">
          <SmallInsightCard
            title="7-day retention"
            value="68%"
            description="Students who return within seven days."
          />

          <SmallInsightCard
            title="30-day retention"
            value="51%"
            description="Students who remain active after one month."
          />

          <SmallInsightCard
            title="Lesson completion"
            value="73%"
            description="Started lessons that are completed."
          />
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
        {icon}
      </div>

      <p className="text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-xs font-medium text-slate-400">
        {detail}
      </p>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <div className="mb-7 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <div>
          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function SmallInsightCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}