"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Mic, PenLine, Play, Sparkles, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { completeStudentLesson, getStudentLesson, type StudentLesson } from "@/lib/api";

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<StudentLesson | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStudentLesson(lessonId).then(setLesson).catch(() => setError("We couldn't load this lesson. It may not be published yet."));
  }, [lessonId]);

  const playAudio = (url: string | null) => { if (url) new Audio(url).play(); };
  const complete = async () => {
    if (!lesson || lesson.completed) return;
    setSaving(true); setError("");
    try {
      await completeStudentLesson(lesson.id);
      setLesson({ ...lesson, completed: true });
      if (lesson.nextLessonId) router.push(`/student/lessons/${lesson.nextLessonId}`);
    } catch { setError("Your progress couldn't be saved. Please retry."); }
    finally { setSaving(false); }
  };

  if (error && !lesson) return <main className="mx-auto max-w-3xl p-8"><p className="rounded-xl border border-red-200 p-5 text-red-600">{error}</p><Link href="/student/courses" className={buttonVariants({ variant: "outline", className: "mt-4" })}>Back to courses</Link></main>;
  if (!lesson) return <main className="mx-auto max-w-3xl p-8 text-sm text-muted-foreground">Loading lesson...</main>;

  return <main className="min-h-screen bg-muted/30"><div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-6">
    <section><Link href="/student/courses" className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-3" })}><ArrowLeft /> Back to course</Link>
      <div className="mt-4 flex items-center gap-2"><Badge>{lesson.courseTitle}</Badge><Badge variant="outline">Lesson {lesson.order}</Badge>{lesson.completed && <Badge className="bg-emerald-600"><CheckCircle2 /> Completed</Badge>}</div>
      <h1 className="mt-3 text-3xl font-bold">{lesson.title}</h1><p className="mt-1 text-muted-foreground">{lesson.grammarPoint}</p>
    </section>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Sparkles /> Grammar point</CardTitle><CardDescription>{lesson.grammarPoint}</CardDescription></CardHeader><CardContent><div className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{lesson.grammarExplanation}</div></CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Vocabulary</CardTitle><CardDescription>{lesson.vocabulary.length} useful words for this lesson</CardDescription></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{lesson.vocabulary.map(item => <div key={item.id} className="rounded-xl border p-4"><div className="flex justify-between"><strong>{item.word}</strong>{item.audioUrl && <Button aria-label={`Play ${item.word}`} variant="ghost" size="icon-sm" onClick={() => playAudio(item.audioUrl)}><Volume2 /></Button>}</div><p className="text-xs text-muted-foreground">{item.meaning}</p><Separator className="my-3"/><p className="text-xs leading-5">{item.example}</p></div>)}</div></CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Read & listen</CardTitle></CardHeader><CardContent className="space-y-4">{lesson.readings.map((reading, index) => <div key={reading.id} className="rounded-xl border p-5"><div className="flex justify-between"><div><p className="text-xs text-muted-foreground">READING {index + 1}</p><h3 className="font-semibold">{reading.title}</h3></div>{reading.audioUrl && <Button variant="outline" size="sm" onClick={() => playAudio(reading.audioUrl)}><Play /> Listen</Button>}</div><p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{reading.text}</p></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><PenLine /> Writing practice</CardTitle><CardDescription>Use today&apos;s grammar and vocabulary.</CardDescription></CardHeader><CardContent><p className="rounded-xl bg-muted p-4 text-sm">{lesson.writingPrompt}</p><Textarea className="mt-4 min-h-40" placeholder="Start writing here..." /></CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Mic /> Speaking practice</CardTitle></CardHeader><CardContent><p className="rounded-xl bg-muted p-4 text-sm">{lesson.speakingPrompt}</p><p className="mt-3 text-xs text-muted-foreground">Practice aloud, then complete the lesson when you feel ready.</p></CardContent></Card>
    {error && <p className="text-sm text-red-600">{error}</p>}
    <section className="flex justify-between pb-8">{lesson.previousLessonId ? <Link className={buttonVariants({ variant: "outline" })} href={`/student/lessons/${lesson.previousLessonId}`}><ArrowLeft /> Previous</Link> : <span />}
      {lesson.completed ? (lesson.nextLessonId ? <Link className={buttonVariants()} href={`/student/lessons/${lesson.nextLessonId}`}>Next lesson <ArrowRight /></Link> : <Link className={buttonVariants()} href="/student/dashboard">View progress <ArrowRight /></Link>) : <Button disabled={saving} onClick={complete}>{saving ? "Saving..." : "Complete lesson"}<ArrowRight /></Button>}
    </section>
  </div></main>;
}