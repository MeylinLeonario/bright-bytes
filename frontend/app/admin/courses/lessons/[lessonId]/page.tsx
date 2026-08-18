"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Headphones,
  Languages,
  LoaderCircle,
  Mic,
  PenLine,
  Save,
  Upload,
  Volume2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

type VocabularyItem = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  audioUrl: string | null;
};

type ReadingItem = {
  id: string;
  title: string;
  text: string;
  audioUrl: string | null;
};

type Lesson = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  grammarPoint: string;
  grammarExplanation: string;
  writingPrompt: string;
  speakingPrompt: string;
  order: number;
  isPublished: boolean;
  vocabulary: VocabularyItem[];
  readings: ReadingItem[];
};

export default function EditLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Lesson>(`/api/admin/lessons/${lessonId}`)
      .then(setLesson)
      .catch(() => setError("No pudimos cargar la lección."))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const updateLesson = <K extends keyof Lesson>(field: K, value: Lesson[K]) => {
    setSaved(false);
    setLesson((current) => current ? { ...current, [field]: value } : current);
  };

  const updateVocabulary = (index: number, field: keyof VocabularyItem, value: string | null) => {
    if (!lesson) return;
    const vocabulary = lesson.vocabulary.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateLesson("vocabulary", vocabulary);
  };

  const updateReading = (index: number, field: keyof ReadingItem, value: string | null) => {
    if (!lesson) return;
    const readings = lesson.readings.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item
    );
    updateLesson("readings", readings);
  };

  const uploadAudio = async (file: File | undefined, onChange: (value: string) => void) => {
    if (file) onChange(await fileToDataUrl(file));
  };

  const saveLesson = async () => {
    if (!lesson || saving) return;
    if (!lesson.title.trim()) {
      setError("El título de la lección es obligatorio.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await apiFetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PUT",
        body: JSON.stringify({
          courseId: lesson.courseId,
          title: lesson.title,
          grammarPoint: lesson.grammarPoint,
          grammarExplanation: lesson.grammarExplanation,
          writingPrompt: lesson.writingPrompt,
          speakingPrompt: lesson.speakingPrompt,
          order: lesson.order,
          isPublished: lesson.isPublished,
          vocabulary: lesson.vocabulary,
          readings: lesson.readings,
        }),
      });
      setSaved(true);
      router.refresh();
    } catch (error) {
      const detail = error instanceof Error ? ` ${error.message}` : "";
      setError(`No pudimos guardar los cambios.${detail}`);
      
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageMessage icon={<LoaderCircle className="animate-spin" />} message="Cargando lección..." />;
  if (!lesson) return <PageMessage message={error || "Lección no encontrada."} isError />;

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-7 md:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <Link href={`/admin/courses/${lesson.courseId}`} className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
          <ArrowLeft size={17} /> Volver al curso
        </Link>

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-purple-600">
              <span>{lesson.courseTitle}</span><span className="text-slate-300">/</span><span>Lección {lesson.order}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Editar lección</h1>
            <p className="mt-2 text-sm text-slate-500">Actualiza el contenido que verán tus estudiantes.</p>
          </div>
          <button type="button" onClick={saveLesson} disabled={saving} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
            {saving ? <LoaderCircle size={17} className="animate-spin" /> : saved ? <Check size={17} /> : <Save size={17} />}
            {saving ? "Guardando..." : saved ? "Cambios guardados" : "Guardar cambios"}
          </button>
        </header>

        {error && <p role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}

        <div className="space-y-6">
          <EditorSection icon={<BookOpen size={20} />} title="Información de la lección" description="Nombre, punto gramatical y explicación principal.">
            <div className="grid gap-5">
              <TextInput label="Título" value={lesson.title} onChange={(value) => updateLesson("title", value)} />
              <TextInput label="Punto gramatical" value={lesson.grammarPoint} onChange={(value) => updateLesson("grammarPoint", value)} />
              <TextArea label="Explicación gramatical" rows={7} value={lesson.grammarExplanation} onChange={(value) => updateLesson("grammarExplanation", value)} />
              <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span><strong className="block text-sm text-slate-800">Publicar lección</strong><span className="mt-1 block text-xs text-slate-500">Cuando esté activa, los estudiantes podrán acceder a ella.</span></span>
                <input type="checkbox" checked={lesson.isPublished} onChange={(event) => updateLesson("isPublished", event.target.checked)} className="h-5 w-5 accent-purple-600" />
              </label>
            </div>
          </EditorSection>

          <EditorSection icon={<Languages size={20} />} title="Vocabulario" description="Edita las cinco palabras, sus significados, ejemplos y pronunciación.">
            <div className="space-y-4">{lesson.vocabulary.map((item, index) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <p className="mb-4 font-bold text-slate-800">Palabra {index + 1}</p>
                <div className="grid gap-4 md:grid-cols-2"><TextInput label="Palabra o expresión" value={item.word} onChange={(value) => updateVocabulary(index, "word", value)} /><TextInput label="Significado" value={item.meaning} onChange={(value) => updateVocabulary(index, "meaning", value)} /></div>
                <div className="mt-4"><TextInput label="Frase de ejemplo" value={item.example} onChange={(value) => updateVocabulary(index, "example", value)} /></div>
                <AudioField value={item.audioUrl} onUpload={(file) => uploadAudio(file, (value) => updateVocabulary(index, "audioUrl", value))} onRemove={() => updateVocabulary(index, "audioUrl", null)} />
              </div>
            ))}</div>
          </EditorSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <EditorSection icon={<PenLine size={20} />} title="Práctica escrita" description="Una consigna para aplicar lo aprendido."><TextArea label="Consigna" rows={6} value={lesson.writingPrompt} onChange={(value) => updateLesson("writingPrompt", value)} /></EditorSection>
            <EditorSection icon={<Mic size={20} />} title="Práctica oral" description="Una consigna breve para responder en voz alta."><TextArea label="Consigna" rows={6} value={lesson.speakingPrompt} onChange={(value) => updateLesson("speakingPrompt", value)} /></EditorSection>
          </div>

          <EditorSection icon={<Headphones size={20} />} title="Mini lecturas" description="Edita los tres textos y sus audios de comprensión.">
            <div className="space-y-5">{lesson.readings.map((reading, index) => (
              <div key={reading.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <p className="mb-4 font-bold text-slate-800">Lectura {index + 1}</p>
                <div className="space-y-4"><TextInput label="Título" value={reading.title} onChange={(value) => updateReading(index, "title", value)} /><TextArea label="Texto" rows={7} value={reading.text} onChange={(value) => updateReading(index, "text", value)} /><AudioField value={reading.audioUrl} onUpload={(file) => uploadAudio(file, (value) => updateReading(index, "audioUrl", value))} onRemove={() => updateReading(index, "audioUrl", null)} /></div>
              </div>
            ))}</div>
          </EditorSection>

          <div className="flex justify-end pb-10"><button type="button" onClick={saveLesson} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"><Save size={17} />{saving ? "Guardando..." : "Guardar cambios"}</button></div>
        </div>
      </div>
    </main>
  );
}

function EditorSection({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7"><div className="mb-6 flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">{icon}</div><div><h2 className="text-lg font-bold text-slate-900">{title}</h2><p className="mt-1 text-sm leading-5 text-slate-400">{description}</p></div></div>{children}</section>;
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100" /></label>;
}

function TextArea({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-100" /></label>;
}

function AudioField({ value, onUpload, onRemove }: { value: string | null; onUpload: (file: File | undefined) => void; onRemove: () => void }) {
  return <div className="mt-4 flex flex-wrap items-center gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-purple-300 hover:text-purple-600"><Upload size={16} />{value ? "Cambiar audio" : "Subir audio"}<input type="file" accept="audio/*" className="hidden" onChange={(event) => onUpload(event.target.files?.[0])} /></label>{value && <><audio controls src={value} className="h-9 max-w-64" /><button type="button" onClick={onRemove} className="inline-flex items-center gap-1 text-xs font-semibold text-red-500"><Volume2 size={14} />Quitar</button></>}</div>;
}

function PageMessage({ message, icon, isError = false }: { message: string; icon?: React.ReactNode; isError?: boolean }) {
  return <main className="grid min-h-screen place-items-center bg-[#faf9f7] p-6"><div className={`flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 text-sm font-medium shadow-sm ${isError ? "border-red-200 text-red-600" : "border-slate-200 text-slate-500"}`}>{icon}{message}</div></main>;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
}