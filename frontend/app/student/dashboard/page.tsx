"use client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, Building2, Check, ChevronRight, Coffee, Coins, Crown, Flag, Flame, Gift, LockKeyhole, Map, Medal, MessageCircle, Rocket, ShoppingBag, Sparkles, Sun, Target, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser, getStudentDashboard, type CurrentUser, type StudentDashboardData } from "@/lib/api";

const levels = ["A2.1", "A2.2", "A2.3", "A2.4", "A2.5"];
const path = [
  ["Daily routines", Sun], ["Past adventures", Map], ["At the café", Coffee],
  ["Checkpoint", Flag], ["Future plans", Rocket], ["Around the city", Building2],
  ["Your opinions", MessageCircle], ["Mystery reward", Gift],
] as const;

export default function StudentDashboard() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
      useEffect(() => { Promise.all([getCurrentUser(), getStudentDashboard()]).then(([u, d]) => { setUser(u); setData(d); }).catch(console.error).finally(() => setLoading(false)); }, []);
  const done = data?.courseLessonsCompleted ?? 0, total = data?.totalCourseLessons || 40;
  const xp = data?.xp ?? done * 100, bytes = data?.bytes ?? done * 20;
  const today = data?.todayLessonsCompleted ?? 0, week = data?.thisWeekLessonsCompleted ?? 0;
  const level = Math.min(4, Math.floor(done / 8)), name = loading ? "..." : user?.name?.split(" ")[0] ?? "learner";
  const start = Math.max(0, Math.floor(done / 4) * 4 - 1), checkpoint = Math.min(total, Math.ceil((done + 1) / 10) * 10);
  const achievements = useMemo(() => [
    [Flame, "On fire", (data?.streak ?? 0) >= 3, "bg-chart-2/10 text-chart-2"],
    [Crown, "Perfect start", done >= 1, "bg-chart-2/10 text-chart-2"],
    [Medal, "Word collector", (data?.wordsLearned ?? 0) >= 50, "bg-primary/10 text-primary"],
    [Trophy, "Checkpoint hero", done >= 10, "bg-primary/10 text-primary"],
  ] as const, [data, done]);

  return <main className="min-h-screen bg-muted/30 text-slate-900"><div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
    <nav className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-white px-4 py-3 shadow-sm">
      <Link href="/student/dashboard" className="flex items-center gap-2 font-black text-primary"><span className="grid size-9 place-items-center rounded-xl bg-primary text-white">B</span> Bright Bytes</Link>
      <div className="flex items-center gap-3 sm:gap-5"><b className="flex items-center gap-1 text-chart-2"><Flame className="size-5 fill-chart-2/40" />{data?.streak ?? 0}</b><b className="flex items-center gap-1 text-primary"><Zap className="size-5" />{xp.toLocaleString()} <small>XP</small></b><b className="flex items-center gap-1 text-chart-2"><Coins className="size-5" />{bytes}</b><Link href="/student/profile" className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-chart-2 font-bold text-white">{name[0]}</Link></div>
    </nav>
    <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-bold text-primary">WELCOME BACK, {name.toUpperCase()}!</p><h1 className="mt-1 text-3xl font-black sm:text-4xl">Ready for today&apos;s adventure?</h1><p className="mt-2 text-slate-500">Small steps, big progress. Keep your streak alive!</p></div><span className="w-fit rounded-full bg-chart-2/10 px-4 py-2 text-sm font-bold text-chart-2">{data?.streak ?? 0} days strong</span></header>

    <section className="mb-6 grid gap-4 md:grid-cols-3">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-chart-2 text-white shadow-lg shadow-primary/20 md:col-span-2"><CardContent className="relative flex flex-col justify-between gap-6 p-7 sm:flex-row sm:items-center"><div className="absolute -right-10 -top-12 size-44 rounded-full bg-white/10" /><div className="relative"><p className="flex items-center gap-2 text-sm font-bold text-primary-foreground/80"><Target className="size-5" /> TODAY&apos;S GOAL</p><h2 className="mt-2 text-2xl font-black">Complete 2 Bytes today</h2><p className="mt-1 text-primary-foreground/80">{today >= 2 ? "Goal crushed! Bonus unlocked" : `${2 - today} more to unlock your +50 XP bonus`}</p><div className="mt-4 flex items-center gap-3"><div className="h-3 w-56 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-chart-2/30" style={{ width: `${Math.min(100, today * 50)}%` }} /></div><b>{Math.min(today, 2)}/2</b></div></div>{data?.continueLesson ? <Link href={`/student/lessons/${data.continueLesson.id}`} className={buttonVariants({ size: "lg", className: "relative gap-2 bg-white text-primary hover:bg-primary/5" })}>Start learning <ArrowRight /></Link> : <Link href="/student/courses" className={buttonVariants({ className: "bg-white text-primary" })}>Explore lessons</Link>}</CardContent></Card>
      <Card className="border-chart-2/20 bg-gradient-to-br from-chart-2/5 to-chart-2/10"><CardContent className="p-6"><div className="flex justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-white text-2xl"><Flag className="size-5" /></span><b className="text-xs text-chart-2">MILESTONE</b></div><h2 className="mt-4 text-lg font-black">Next checkpoint</h2><p className="text-sm text-slate-600">Lesson {checkpoint} · {checkpoint - done} to go</p><Progress value={(done % 10) * 10} className="mt-3 bg-white" /><p className="mt-3 flex items-center gap-1 text-xs font-bold text-chart-2"><Gift className="size-4" /> Mystery reward waiting!</p></CardContent></Card>
    </section>

    <section className="grid items-start gap-6 lg:grid-cols-[1fr_330px]"><Card className="border-primary/10"><CardContent className="p-5 sm:p-7"><div className="flex justify-between"><div><p className="text-xs font-black tracking-widest text-primary">YOUR LEARNING PATH</p><h2 className="mt-1 text-2xl font-black">{data?.courseTitle ?? "English A2"}</h2></div><div className="text-right"><b className="text-primary">{done}/{total}</b><p className="text-xs text-slate-400">lessons</p></div></div>
      <div className="relative mt-7 space-y-3 before:absolute before:bottom-7 before:left-[27px] before:top-7 before:w-1 before:bg-primary/10">{path.map(([title, PathIcon], i) => { const order = start + i + 1, complete = order <= done, current = order === done + 1, locked = order > done + 1, special = title === "Checkpoint" || title === "Mystery reward"; return <div key={`${title}-${order}`} className={`relative flex items-center gap-4 rounded-2xl border p-3 ${current ? "border-primary/40 bg-primary/5 shadow-md" : special ? "border-chart-2/20 bg-chart-2/5" : "border-transparent"}`}><div className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border-4 border-white text-xl shadow-sm ${complete ? "bg-primary text-white" : current ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>{complete ? <Check strokeWidth={3} /> : locked ? <LockKeyhole className="size-5" /> : <PathIcon className="size-5" />}</div><div className="flex-1"><b className={locked ? "text-slate-400" : ""}>{title}</b>{title === "Mystery reward" && <span className="ml-2 rounded-full bg-chart-2/10 px-2 py-1 text-[9px] font-black text-chart-2">SURPRISE</span>}<p className="text-xs text-slate-400">{complete ? "Completed · +100 XP" : current ? `Lesson ${order} · Up next` : special ? "Big reward ahead" : `Lesson ${order}`}</p></div>{current && data?.continueLesson ? <Link aria-label="Open lesson" href={`/student/lessons/${data.continueLesson.id}`} className="grid size-9 place-items-center rounded-full bg-primary text-white"><ChevronRight /></Link> : <PathIcon className="size-5 text-muted-foreground" />}</div>; })}</div>
      <Link href="/student/courses" className="mt-5 flex justify-center gap-2 rounded-xl border border-primary/20 py-3 text-sm font-bold text-primary">View all {total} lessons <ArrowRight className="size-4" /></Link>
    </CardContent></Card>

    <aside className="space-y-4"><Card className="border-primary/20 bg-primary/5"><CardContent className="p-5"><div className="flex justify-between"><div><p className="text-xs font-black text-primary">LEVEL PROGRESS</p><h2 className="mt-1 text-2xl font-black">{levels[level]}</h2></div><span className="grid size-12 place-items-center rounded-2xl bg-primary/50 text-white"><Rocket /></span></div><Progress value={((done % 8) / 8) * 100} className="mt-4 bg-white" /><div className="mt-2 flex justify-between text-xs text-primary"><span>{done % 8}/8 lessons</span><b>{level < 4 ? `${levels[level + 1]} next` : "Top level!"}</b></div></CardContent></Card>
      <Card className="border-chart-2/20"><CardContent className="p-5"><div className="flex justify-between"><div><p className="text-xs font-black text-chart-2">WEEKLY CHALLENGE</p><h2 className="mt-1 font-black">Complete 7 lessons</h2></div><Trophy className="size-8 text-chart-2/70" /></div><div className="mt-4 flex gap-1">{Array.from({ length: 7 }, (_, i) => <span key={i} className={`h-2 flex-1 rounded-full ${i < week ? "bg-chart-2/40" : "bg-chart-2/10"}`} />)}</div><div className="mt-2 flex justify-between text-xs"><span>{Math.min(week, 7)} of 7 complete</span><b className="text-chart-2">+350 XP</b></div>{(data?.bestWeekLessons ?? 0) > 0 && <p className="mt-3 rounded-lg bg-chart-2/5 p-2 text-xs font-semibold text-chart-2">Personal best: {data?.bestWeekLessons} in one week</p>}</CardContent></Card>
      <Card><CardContent className="p-5"><div className="mb-4 flex justify-between"><h2 className="font-black">Achievements</h2><Link href="/student/progress" className="text-xs font-bold text-primary">View all</Link></div><div className="grid grid-cols-4 gap-2">{achievements.map(([Icon, title, earned, color]) => <div key={title} className="text-center"><div className={`mx-auto grid size-11 place-items-center rounded-2xl ${earned ? color : "bg-slate-100 text-slate-300"}`}><Icon className="size-5" /></div><p className="mt-1 truncate text-[9px] font-semibold">{title}</p></div>)}</div></CardContent></Card>
      <Card className="border-chart-2/20 bg-gradient-to-br from-chart-2/5 to-primary/5"><CardContent className="p-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-chart-2/30"><ShoppingBag /></span><div><b>Byte Shop</b><p className="text-xs text-slate-500">You have <strong className="text-chart-2">{bytes} Bytes</strong></p></div></div><Button variant="outline" className="mt-4 w-full border-primary/20 text-primary">Browse rewards <Sparkles /></Button></CardContent></Card>
      {!loading && data?.streak === 0 && <div className="flex gap-3 rounded-2xl bg-primary/10 p-4 text-sm text-primary"><Gift /><div><b>Welcome back bonus!</b><p className="text-xs">Complete a lesson for double XP.</p></div></div>}
      <Link href="/student/review" className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white"><span className="flex gap-3"><BookOpen /><span><b className="block">Quick practice</b><small className="text-slate-400">Earn +25 XP</small></span></span><ArrowRight /></Link>
    </aside></section><footer className="mt-8 text-center text-xs text-slate-400"><Award className="mr-1 inline size-4" />Every lesson earns XP and Bytes. Perfect lessons earn a 50 XP bonus.</footer>
  </div></main>;     
 
}