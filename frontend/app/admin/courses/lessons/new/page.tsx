"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  Languages,
  Mic,
  PenLine,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

type VocabularyItem = {
  id: number;
  word: string;
  meaning: string;
  example: string;
  audio: File | null;
};

type ReadingItem = {
  id: number;
  title: string;
  text: string;
  audio: File | null;
};

export default function NewLessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [title, setTitle] = useState("");
  const [grammarPoint, setGrammarPoint] = useState("");
  const [grammarExplanation, setGrammarExplanation] = useState("");

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([
    createVocabularyItem(1),
    createVocabularyItem(2),
    createVocabularyItem(3),
    createVocabularyItem(4),
    createVocabularyItem(5),
  ]);

  const [writingPrompt, setWritingPrompt] = useState("");
  const [speakingPrompt, setSpeakingPrompt] = useState("");

  const [readings, setReadings] = useState<ReadingItem[]>([
    createReadingItem(1),
    createReadingItem(2),
    createReadingItem(3),
  ]);

  const updateVocabulary = (
    id: number,
    field: keyof VocabularyItem,
    value: string | File | null
  ) => {
    setVocabulary((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const updateReading = (
    id: number,
    field: keyof ReadingItem,
    value: string | File | null
  ) => {
    setReadings((current) =>
      current.map((reading) =>
        reading.id === id
          ? {
              ...reading,
              [field]: value,
            }
          : reading
      )
    );
  };

  const handleSave = () => {
    const lesson = {
      courseId,
      title,
      grammarPoint,
      grammarExplanation,
      vocabulary,
      writingPrompt,
      speakingPrompt,
      readings,
    };

    console.log("Lesson:", lesson);
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/admin/courses/${courseId}/lessons`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to lessons
        </Link>

        {/* Header */}
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-purple-600">
              Course {courseId}
            </p>

            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Create lesson
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Build all the content students will see in this lesson.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="flex w-fit items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Save size={17} />
            Save lesson
          </button>
        </section>

        <div className="space-y-6">
          {/* Basic info */}
          <Section
            title="Lesson information"
            description="Basic information about this lesson."
            icon={<BookOpen size={20} />}
          >
            <div className="grid gap-5">
              <InputField
                label="Lesson title"
                placeholder="e.g. Great places to be"
                value={title}
                onChange={setTitle}
              />

              <InputField
                label="Grammar point"
                placeholder="e.g. Present simple vs present continuous"
                value={grammarPoint}
                onChange={setGrammarPoint}
              />

              <TextAreaField
                label="Grammar explanation"
                placeholder="Write the grammar explanation students will study..."
                value={grammarExplanation}
                onChange={setGrammarExplanation}
                rows={8}
              />
            </div>
          </Section>

          {/* Vocabulary */}
          <Section
            title="Vocabulary"
            description="Add the five vocabulary words for this lesson. Each word can have its own pronunciation audio."
            icon={<Languages size={20} />}
          >
            <div className="space-y-5">
              {vocabulary.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <p className="font-bold text-slate-800">
                      Word {index + 1}
                    </p>

                    <Headphones size={18} className="text-purple-500" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Word / expression"
                      placeholder="e.g. crowded"
                      value={item.word}
                      onChange={(value) =>
                        updateVocabulary(item.id, "word", value)
                      }
                    />

                    <InputField
                      label="Meaning"
                      placeholder="e.g. lleno de personas"
                      value={item.meaning}
                      onChange={(value) =>
                        updateVocabulary(item.id, "meaning", value)
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <InputField
                      label="Example sentence"
                      placeholder="e.g. The city centre is very crowded today."
                      value={item.example}
                      onChange={(value) =>
                        updateVocabulary(item.id, "example", value)
                      }
                    />
                  </div>

                  <div className="mt-4">
                    <AudioUploader
                      label="Pronunciation audio"
                      file={item.audio}
                      onChange={(file) =>
                        updateVocabulary(item.id, "audio", file)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Writing */}
          <Section
            title="Writing exercise"
            description="Give the student a short task to practice written English."
            icon={<PenLine size={20} />}
          >
            <TextAreaField
              label="Writing prompt"
              placeholder="e.g. Describe a place you enjoy visiting. Where is it? What do you usually do there?"
              value={writingPrompt}
              onChange={setWritingPrompt}
              rows={6}
            />
          </Section>

          {/* Speaking */}
          <Section
            title="Speaking exercise"
            description="Give the student a prompt they can answer aloud."
            icon={<Mic size={20} />}
          >
            <TextAreaField
              label="Speaking prompt"
              placeholder="e.g. Talk for one minute about your favourite place in your city."
              value={speakingPrompt}
              onChange={setSpeakingPrompt}
              rows={6}
            />
          </Section>

          {/* Readings */}
          <Section
            title="Mini readings"
            description="Every lesson includes three short texts with audio."
            icon={<Headphones size={20} />}
          >
            <div className="space-y-6">
              {readings.map((reading, index) => (
                <div
                  key={reading.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                >
                  <p className="mb-5 font-bold text-slate-800">
                    Reading {index + 1}
                  </p>

                  <div className="space-y-4">
                    <InputField
                      label="Title"
                      placeholder="e.g. A busy morning in London"
                      value={reading.title}
                      onChange={(value) =>
                        updateReading(reading.id, "title", value)
                      }
                    />

                    <TextAreaField
                      label="Text"
                      placeholder="Write the mini reading..."
                      value={reading.text}
                      onChange={(value) =>
                        updateReading(reading.id, "text", value)
                      }
                      rows={8}
                    />

                    <AudioUploader
                      label="Reading audio"
                      file={reading.audio}
                      onChange={(file) =>
                        updateReading(reading.id, "audio", file)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Bottom save */}
          <section className="flex justify-end pb-12">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Save size={17} />
              Save lesson
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

function createVocabularyItem(id: number): VocabularyItem {
  return {
    id,
    word: "",
    meaning: "",
    example: "",
    audio: null,
  };
}

function createReadingItem(id: number): ReadingItem {
  return {
    id,
    title: "",
    text: "",
    audio: null,
  };
}

function Section({
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
      <div className="mb-6 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
      />
    </label>
  );
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  rows,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
      />
    </label>
  );
}

function AudioUploader({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">
        {label}
      </p>

      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 transition hover:border-purple-300 hover:bg-purple-50/30">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Upload size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">
              {file ? file.name : "Upload audio"}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              MP3, WAV or M4A
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
          Choose file
        </span>

        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(event) =>
            onChange(event.target.files?.[0] ?? null)
          }
        />
      </label>

      {file && (
        <div className="mt-3 flex items-center gap-3">
          <audio
            controls
            src={URL.createObjectURL(file)}
            className="h-9 max-w-full"
          />

          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}