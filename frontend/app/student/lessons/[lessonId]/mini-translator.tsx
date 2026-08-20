"use client";

import { useState } from "react";
import { ArrowRight, Languages, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MAX_WORDS = 6;

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}

export function MiniTranslator() {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState<"ES" | "EN">("ES");
  const [translation, setTranslation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const wordCount = countWords(text);

  const translate = async () => {
    if (!text.trim() || wordCount > MAX_WORDS || loading) return;
    setLoading(true);
    setError("");
    setTranslation("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });
      const result = await response.json() as { translation?: string; message?: string };

      if (!response.ok || !result.translation) {
        throw new Error(result.message ?? "No pudimos traducir en este momento.");
      }

      setTranslation(result.translation);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos traducir en este momento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-fuchsia-200 bg-gradient-to-br from-fuchsia-50 to-white shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex min-w-48 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-600 text-white shadow-sm shadow-fuchsia-200">
              <Languages className="size-5" />
            </span>
            <div>
              <h2 className="font-bold text-fuchsia-950">Traductor rápido</h2>
              <p className="text-xs text-fuchsia-700">Hasta {MAX_WORDS} palabras · DeepL</p>
            </div>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-start">
            <div>
              <Input
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                  setTranslation("");
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void translate();
                }}
                className="border-fuchsia-200 bg-white focus-visible:border-fuchsia-500 focus-visible:ring-fuchsia-200"
                placeholder="Escribe una frase corta..."
                aria-label="Texto para traducir"
              />
              <p className={`mt-1.5 text-right text-xs ${wordCount > MAX_WORDS ? "font-semibold text-red-600" : "text-fuchsia-700"}`}>
                {wordCount}/{MAX_WORDS} palabras
              </p>
            </div>

            <select
              value={targetLang}
              onChange={(event) => {
                setTargetLang(event.target.value as "ES" | "EN");
                setTranslation("");
              }}
              aria-label="Idioma de destino"
              className="h-9 rounded-md border border-fuchsia-200 bg-white px-3 text-sm font-medium text-fuchsia-950 outline-none focus:border-fuchsia-500 focus:ring-3 focus:ring-fuchsia-200"
            >
              <option value="ES">A español</option>
              <option value="EN">A inglés</option>
            </select>

            <Button
              onClick={translate}
              disabled={!text.trim() || wordCount > MAX_WORDS || loading}
              className="bg-fuchsia-600 text-white hover:bg-fuchsia-700 focus-visible:ring-fuchsia-300"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
              {loading ? "Traduciendo" : "Traducir"}
            </Button>
          </div>
        </div>

        {translation && (
          <div className="mt-4 rounded-xl border border-fuchsia-200 bg-white px-4 py-3" aria-live="polite">
            <p className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-600">Traducción</p>
            <p className="mt-1 font-medium text-fuchsia-950">{translation}</p>
          </div>
        )}
        {error && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{error}</p>}
      </CardContent>
    </Card>
  );
}