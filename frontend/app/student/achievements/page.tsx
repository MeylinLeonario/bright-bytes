"use client";

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";
import { Award, Check } from "lucide-react";
import { getStudentAchievements, type StudentAchievement } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getStudentAchievements()
      .then(setAchievements)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(achievements.map((item) => item.category))],
    [achievements],
  );
const earned = achievements.filter((item) => item.progress >= item.target).length;
  const completion = achievements.length ? (earned / achievements.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-primary">
              Colección personal
            </p>
            <h1 className="mt-2 text-3xl font-black">Logros</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu progreso se calcula con las lecciones y prácticas guardadas.
            </p>
          </div>
          <Link href="/student/dashboard" className={buttonVariants({ variant: "outline" })}>
            Volver al inicio
          </Link>
        </header>

        {loading && <p className="mt-8 text-muted-foreground">Cargando tus logros…</p>}
        {error && (
          <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="font-bold text-destructive">No pudimos cargar tus logros.</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="my-7 rounded-2xl border bg-card p-5">
              <div className="mb-2 flex justify-between text-sm">
                <b>{earned} de {achievements.length} desbloqueados</b>
                <span className="text-muted-foreground">{Math.round(completion)}%</span>
              </div>
              <Progress value={completion} />
            </section>
            {
              categories.map((category) => (
              <section key={category} className="mb-8">
                <h2 className="mb-3 text-lg font-black">{category}</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {achievements.filter((item) => item.category === category).map((item) => {
                    const complete = item.progress >= item.target;
                    return (
                      <article
                        key={item.id}
                        className={`rounded-2xl border p-4 ${complete ? "border-primary/30 bg-primary/5" : "bg-card"}`}
                      >
                        <div className="flex gap-3">
                          <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${complete ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                            {complete ? <Check /> : <Award />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between gap-2">
                              <h3 className="font-bold">{item.title}</h3>
                              <span className="text-xs font-bold text-muted-foreground">
                                {Math.min(item.progress, item.target)}/{item.target}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                            <Progress className="mt-3 h-1.5" value={(item.progress / item.target) * 100} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </main>
  );
}