"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Mic, Pause, PenLine, Play, RefreshCw, Sparkles, Square, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MiniTranslator } from "./mini-translator";

import { completeStudentLesson, correctStudentExercise, correctStudentSpeakingExercise, getStudentLesson, type ExerciseCorrection, type StudentLesson } from "@/lib/api";

function CorrectionResult({ result }: { result: ExerciseCorrection }) {
  return <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4"><div><p className="text-xs font-semibold uppercase text-emerald-700">Corrected answer</p><p className="mt-1 whitespace-pre-line text-sm leading-6">{result.correctedText}</p></div><Separator /><div><p className="text-xs font-semibold uppercase text-emerald-700">Teacher feedback</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{result.feedback}</p></div></div>;}
function WritingPractice({ prompt, initialAttempts }: { prompt: string; initialAttempts: number }) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [text, setText] = useState("");
  const [attempts, setAttempts] = useState(initialAttempts);
  const [result, setResult] = useState<ExerciseCorrection | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;


  const submit = async () => {
    if (!text.trim() || words > 200 || attempts >= 2) return;
    setLoading(true); setError("");
    try {
      const correction = await correctStudentExercise(lessonId, "writing", text);
      setResult(correction); setAttempts(correction.attemptNumber);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We couldn't correct this answer.");
    } finally { setLoading(false); }
  };

  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><PenLine /> Writing practice</CardTitle><CardDescription>Use today&apos;s grammar and vocabulary · {2 - attempts} of 2 reviews remaining</CardDescription></CardHeader><CardContent className="space-y-4">
    <p className="rounded-xl bg-muted p-4 text-sm">{prompt}</p>
    <div><Textarea value={text} onChange={event => setText(event.target.value)} disabled={attempts >= 2 || loading} className="min-h-40" placeholder="Start writing here..." /><div className="mt-2 flex justify-between text-xs"><span className={words > 200 ? "text-red-600" : "text-muted-foreground"}>{words}/200 words</span><span className="text-muted-foreground">Maximum 200 words</span></div></div>
    <Button onClick={submit} disabled={!text.trim() || words > 200 || attempts >= 2 || loading}>{loading ? "Reviewing..." : attempts >= 2 ? "No reviews remaining" : "Review with AI"}<Sparkles /></Button>
    {error && <p className="text-sm text-red-600">{error}</p>}
    {result && <CorrectionResult result={result} />}
  </CardContent></Card>;
}

function SpeakingPractice({ prompt, initialAttempts }: { prompt: string; initialAttempts: number }) {
  const { lessonId } = useParams<{ lessonId: string }>();
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recordingStartedAt = useRef(0);
  const recordingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [attempts, setAttempts] = useState(initialAttempts);
  const [result, setResult] = useState<ExerciseCorrection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    stream.current?.getTracks().forEach(track => track.stop());
    if (recordingTimer.current) clearTimeout(recordingTimer.current);
  }, []);
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const startRecording = async () => {
    setError(""); setResult(null);
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus"]
        .find(type => MediaRecorder.isTypeSupported(type));
      const nextRecorder = new MediaRecorder(
        stream.current,
        preferredMimeType ? { mimeType: preferredMimeType } : undefined,
      );
      chunks.current = [];
      nextRecorder.ondataavailable = event => { if (event.data.size) chunks.current.push(event.data); };
      nextRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: nextRecorder.mimeType || "audio/webm" });
        setDurationSeconds(Math.min(90, (Date.now() - recordingStartedAt.current) / 1000));
        setAudio(blob); setAudioUrl(URL.createObjectURL(blob));
        stream.current?.getTracks().forEach(track => track.stop());
        if (recordingTimer.current) clearTimeout(recordingTimer.current);
      };
      recorder.current = nextRecorder;
      recordingStartedAt.current = Date.now();
      nextRecorder.start(); setRecording(true);
      recordingTimer.current = setTimeout(() => {
        if (nextRecorder.state === "recording") {
          nextRecorder.stop();
          setRecording(false);
        }
      }, 90_000);
    } catch { setError("Microphone access is required to record your speaking practice."); }
  };
  const stopRecording = () => { recorder.current?.stop(); setRecording(false); };
  const review = async () => {
    if (!audio || attempts >= 2) return;
    setLoading(true); setError("");
    try { const correction = await correctStudentSpeakingExercise(lessonId, audio, durationSeconds); setResult(correction); setAttempts(correction.attemptNumber); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "We couldn't review this recording."); }
    finally { setLoading(false); }
  };

  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Mic /> Speaking practice</CardTitle><CardDescription>Maximum recording: 1 minute 30 seconds · {2 - attempts} of 2 reviews remaining</CardDescription></CardHeader><CardContent className="space-y-4">
    <p className="rounded-xl bg-muted p-4 text-sm">{prompt}</p>
    {audioUrl && !recording && <audio className="w-full" controls src={audioUrl}>Your browser does not support audio playback.</audio>}
    <div className="flex flex-wrap gap-2">
      {recording ? <Button variant="destructive" onClick={stopRecording}><Square /> Stop recording</Button> : !audio && <Button variant="outline" onClick={startRecording} disabled={loading}><Mic /> Start recording</Button>}
      {audio && !recording && <Button onClick={review} disabled={loading || attempts >= 2}>{loading ? "Transcribing and reviewing..." : attempts >= 2 ? "No reviews remaining" : "Review with AI"}<Sparkles /></Button>}
      {audio && !recording && <Button variant="ghost" onClick={startRecording} disabled={loading}><RefreshCw /> Record again</Button>}
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
    {result && <CorrectionResult result={result} />}
    
    </CardContent></Card>;
}

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<StudentLesson | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const activeAudio = useRef<HTMLAudioElement | null>(null);
  const activeAudioId = useRef<string | null>(null);

  useEffect(() => {
    getStudentLesson(lessonId).then(setLesson).catch(() => setError("We couldn't load this lesson. It may not be published yet."));
  }, [lessonId]);

  useEffect(() => () => {
    activeAudio.current?.pause();
    activeAudio.current = null;
    activeAudioId.current = null;
  }, []);
  const toggleAudio = (id: string, url: string | null) => {
    if (!url) return;

    if (activeAudioId.current === id && activeAudio.current) {
      if (!activeAudio.current.paused) {
        activeAudio.current.pause();
        setPlayingAudioId(null);
        return;
      }

      void activeAudio.current.play()
        .then(() => {
          if (activeAudioId.current === id) setPlayingAudioId(id);
        })
        .catch(() => {
          if (activeAudioId.current === id) setPlayingAudioId(null);
        });
      return;
    }

    activeAudio.current?.pause();
    const nextAudio = new Audio(url);
    activeAudio.current = nextAudio;
    activeAudioId.current = id;
    const clearPlayingAudio = () => {
      if (activeAudioId.current === id) setPlayingAudioId(null);
    };
    nextAudio.addEventListener("ended", clearPlayingAudio, { once: true });
    nextAudio.addEventListener("error", clearPlayingAudio, { once: true });
    void nextAudio.play()
      .then(() => {
        if (activeAudioId.current === id) setPlayingAudioId(id);
      })
      .catch(clearPlayingAudio);
  };
  
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
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Vocabulary</CardTitle><CardDescription>{lesson.vocabulary.length} useful words for this lesson</CardDescription></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{lesson.vocabulary.map(item => { const audioId = `vocabulary-${item.id}`; const isPlaying = playingAudioId === audioId; return <div key={item.id} className="rounded-xl border p-4"><div className="flex justify-between"><strong>{item.word}</strong>{item.audioUrl && <Button aria-label={`${isPlaying ? "Pause" : "Play"} ${item.word}`} aria-pressed={isPlaying} variant="ghost" size="icon-sm" onClick={() => toggleAudio(audioId, item.audioUrl)}>{isPlaying ? <Pause /> : <Volume2 />}</Button>}</div><p className="text-xs text-muted-foreground">{item.meaning}</p><Separator className="my-3"/><p className="text-xs leading-5">{item.example}</p></div>; })}</div></CardContent></Card>
    <MiniTranslator />
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen /> Read & listen</CardTitle></CardHeader><CardContent className="space-y-4">{lesson.readings.map((reading, index) => { const audioId = `reading-${reading.id}`; const isPlaying = playingAudioId === audioId; return <div key={reading.id} className="rounded-xl border p-5"><div className="flex justify-between"><div><p className="text-xs text-muted-foreground">READING {index + 1}</p><h3 className="font-semibold">{reading.title}</h3></div>{reading.audioUrl && <Button aria-label={`${isPlaying ? "Pause" : "Play"} ${reading.title}`} aria-pressed={isPlaying} variant="outline" size="sm" onClick={() => toggleAudio(audioId, reading.audioUrl)}>{isPlaying ? <><Pause /> Pause</> : <><Play /> Listen</>}</Button>}</div><p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{reading.text}</p></div>; })}</CardContent></Card>
    <WritingPractice prompt={lesson.writingPrompt} initialAttempts={lesson.writingAttemptsUsed} />
    <SpeakingPractice prompt={lesson.speakingPrompt} initialAttempts={lesson.speakingAttemptsUsed} />
    {error && <p className="text-sm text-red-600">{error}</p>}
    <section className="flex justify-between pb-8">{lesson.previousLessonId ? <Link className={buttonVariants({ variant: "outline" })} href={`/student/lessons/${lesson.previousLessonId}`}><ArrowLeft /> Previous</Link> : <span />}
      {lesson.completed ? (lesson.nextLessonId ? <Link className={buttonVariants()} href={`/student/lessons/${lesson.nextLessonId}`}>Next lesson <ArrowRight /></Link> : <Link className={buttonVariants()} href="/student/dashboard">View progress <ArrowRight /></Link>) : <Button disabled={saving} onClick={complete}>{saving ? "Saving..." : "Complete lesson"}<ArrowRight /></Button>}
    </section>
  </div></main>;
}