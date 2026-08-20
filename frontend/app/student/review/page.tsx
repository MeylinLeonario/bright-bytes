"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Layers3, RotateCcw, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getReviewLessons, type ReviewLesson } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function QuickReviewPage() {
  const [lessons, setLessons] = useState<ReviewLesson[]>([]);
  const [selected, setSelected] = useState<ReviewLesson | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviewLessons().then(setLessons).catch((error) => console.error("Error loading review lessons:", error)).finally(() => setLoading(false));
  }, []);

  function chooseLesson(lesson: ReviewLesson) { setSelected(lesson); setIndex(0); setFlipped(false); setDone(false); }
  function nextCard() {
    if (!selected) return;
    if (index === selected.vocabulary.length - 1) setDone(true);
    else { setIndex(index + 1); setFlipped(false); }
  }

  const word = selected?.vocabulary[index];

  return <main className="min-h-screen bg-muted/30">
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
      <Link href="/student/dashboard" className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-3 mb-5" })}><ArrowLeft /> Dashboard</Link>
      <header className="mb-8"><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Quick review</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Refresh your vocabulary</h1><p className="mt-2 text-muted-foreground">Choose a lesson. We’ll take care of the words.</p></header>

      {!selected ? <section>
        <div className="mb-4 flex items-center gap-2"><Layers3 className="size-5 text-primary" /><h2 className="font-semibold">Choose a completed lesson</h2></div>
        {loading ? <p className="text-sm text-muted-foreground">Loading your lessons...</p> : lessons.length === 0 ? <Card><CardContent className="p-8 text-center"><Sparkles className="mx-auto mb-3 size-7 text-primary" /><h2 className="font-semibold">Your first review is almost here</h2><p className="mt-1 text-sm text-muted-foreground">Complete a lesson with vocabulary to unlock its flashcards.</p><Link href="/student/courses" className={buttonVariants({ className: "mt-5" })}>Explore lessons</Link></CardContent></Card> :
        <div className="grid gap-3 sm:grid-cols-2">{lessons.map((lesson) => <button key={lesson.id} onClick={() => chooseLesson(lesson)} className="group rounded-xl border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">{lesson.courseTitle} · Lesson {lesson.order}</p><h3 className="mt-1 font-semibold">{lesson.title}</h3><p className="mt-3 text-sm text-muted-foreground">{lesson.vocabulary.length} flashcards · about 2 min</p></div><ArrowRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" /></div></button>)}</div>}
      </section> : done ? <Card className="mx-auto max-w-xl border-primary/20 text-center shadow-sm"><CardContent className="p-10"><div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-7" /></div><h2 className="mt-5 text-2xl font-bold">Review complete!</h2><p className="mt-2 text-muted-foreground">You refreshed {selected.vocabulary.length} words from {selected.title}.</p><div className="mt-6 flex justify-center gap-2"><Button variant="outline" onClick={() => chooseLesson(selected)}><RotateCcw /> Again</Button><Button onClick={() => setSelected(null)}>Choose another lesson</Button></div></CardContent></Card> : <section className="mx-auto max-w-xl">
        <div className="mb-5 flex items-center justify-between"><Button variant="ghost" size="sm" className="-ml-3" onClick={() => setSelected(null)}><ArrowLeft /> Change lesson</Button><span className="text-xs text-muted-foreground">{index + 1} of {selected.vocabulary.length}</span></div>
        <Progress value={((index + 1) / selected.vocabulary.length) * 100} className="mb-5 h-1.5" />
        <button className="block w-full text-left [perspective:1000px]" onClick={() => setFlipped(!flipped)} aria-label={flipped ? "Show word" : "Reveal answer"}>
          <Card className={cn("min-h-[340px] border-primary/20 shadow-lg transition duration-300", flipped && "bg-primary text-primary-foreground")}><CardHeader><CardDescription className={flipped ? "text-primary-foreground/65" : ""}>{flipped ? "Meaning" : "Word"}</CardDescription></CardHeader><CardContent className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center"><CardTitle className="text-4xl">{flipped ? word?.meaning : word?.word}</CardTitle>{flipped && word?.example && <p className="mt-6 max-w-sm text-sm italic text-primary-foreground/75">“{word.example}”</p>}<p className={cn("mt-auto pt-8 text-xs", flipped ? "text-primary-foreground/60" : "text-muted-foreground")}>Tap the card to {flipped ? "see the word" : "reveal the meaning"}</p></CardContent></Card>
        </button>
        <Button className="mt-5 w-full" size="lg" onClick={nextCard} disabled={!flipped}>{index === selected.vocabulary.length - 1 ? "Finish review" : "Next word"}<ArrowRight /></Button>
      </section>}
    </div>
  </main>;
}