"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Languages,
  Mic,
  PenLine,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const vocabulary = [
  {
    word: "experience",
    meaning: "experiencia",
    example: "I have had many interesting experiences.",
  },
  {
    word: "travel",
    meaning: "viajar",
    example: "I have traveled to three countries.",
  },
  {
    word: "visit",
    meaning: "visitar",
    example: "She has visited Canada.",
  },
  {
    word: "try",
    meaning: "probar / intentar",
    example: "Have you ever tried sushi?",
  },
  {
    word: "never",
    meaning: "nunca",
    example: "I have never seen snow.",
  },
];

const readings = [
  {
    id: 1,
    title: "My first trip",
    text: `I have traveled outside my city several times, but my first big trip was very special. I visited a small town near the mountains with my family. I had never seen so much snow before. Since then, I have visited the area three more times.`,
  },
  {
    id: 2,
    title: "Trying something new",
    text: `Maria loves trying new things. She has learned how to cook Japanese food and has recently started painting. She has never traveled to Japan, but she hopes to visit the country one day.`,
  },
  {
    id: 3,
    title: "A new experience",
    text: `Daniel has recently joined an English club. He has met several new people and has practiced speaking every week. He was nervous at first, but the experience has helped him become more confident.`,
  },
];

export default function LessonPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-6 md:px-6">
        {/* BACK + PROGRESS */}
        <section>
          <Button variant="ghost" size="sm" className="-ml-3 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Button>

          <div className="mt-3 flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Unit 3</Badge>
                <Badge variant="outline">Lesson 4</Badge>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight">
                Talking about experiences
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Learn how to talk about things you have and haven&apos;t done.
              </p>
            </div>

            <span className="hidden text-sm font-medium sm:block">
              35%
            </span>
          </div>

          <Progress value={35} className="mt-4" />
        </section>

        {/* GRAMMAR */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />

                <CardTitle>Grammar point</CardTitle>
              </div>

              <CardDescription>
                Present Perfect for experiences
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <p className="text-sm leading-6 text-muted-foreground">
                We use the Present Perfect to talk about experiences in our
                lives when the exact time is not important.
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    AFFIRMATIVE
                  </p>

                  <p className="mt-2 font-medium">
                    Subject + have/has + past participle
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    I have visited Peru.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    NEGATIVE
                  </p>

                  <p className="mt-2 font-medium">
                    Subject + haven&apos;t/hasn&apos;t + past participle
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    She hasn&apos;t traveled abroad.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    QUESTION
                  </p>

                  <p className="mt-2 font-medium">
                    Have/Has + subject + past participle?
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Have you ever tried sushi?
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">
                  Remember
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Present Perfect: the experience matters.
                  <br />
                  Past Simple: the specific past time matters.
                </p>

                <p className="mt-3 text-sm">
                  I <strong>have visited</strong> Argentina.
                  <br />
                  I <strong>visited</strong> Argentina in 2024.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* VOCABULARY */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>Vocabulary</CardTitle>
              </div>

              <CardDescription>
                Learn 5 useful words for this lesson
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 md:grid-cols-5">
                {vocabulary.map((item) => (
                  <div
                    key={item.word}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {item.word}
                      </p>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.meaning}
                    </p>

                    <Separator className="my-3" />

                    <p className="text-xs leading-5 text-muted-foreground">
                      {item.example}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* READINGS */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>Read & listen</CardTitle>
              </div>

              <CardDescription>
                Read three short texts and listen to their audio.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {readings.map((reading, index) => (
                <div
                  key={reading.id}
                  className="rounded-lg border p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Reading {index + 1}
                      </p>

                      <h3 className="mt-1 font-semibold">
                        {reading.title}
                      </h3>
                    </div>

                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      Listen
                    </Button>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {reading.text}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* TRANSLATOR */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <CardTitle>Mini translator</CardTitle>
              </div>

              <CardDescription>
                Translate words or sentences without leaving your lesson.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    ENGLISH
                  </p>

                  <Textarea
                    placeholder="Write something in English..."
                    className="min-h-32 resize-none"
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    SPANISH
                  </p>

                  <Textarea
                    placeholder="Translation will appear here..."
                    className="min-h-32 resize-none"
                    readOnly
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </Button>

                <Button className="gap-2">
                  <Languages className="h-4 w-4" />
                  Translate
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* WRITING */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5" />
                <CardTitle>Writing practice</CardTitle>
              </div>

              <CardDescription>
                Use today&apos;s grammar and vocabulary.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">
                  Write about three experiences you have had.
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Where have you traveled? What new things have you tried?
                  Is there something you have never done but would like to do?
                  Try to use at least three vocabulary words from this lesson.
                </p>
              </div>

              <Textarea
                className="mt-4 min-h-44 resize-none"
                placeholder="Start writing here..."
              />

              <div className="mt-3 flex justify-end">
                <Button>
                  Submit writing
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SPEAKING */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                <CardTitle>Speaking practice</CardTitle>
              </div>

              <CardDescription>
                Speak freely using what you learned today.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">
                  Tell us about your life experiences.
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  What is the most interesting place you have visited?
                  What is something new you have tried recently?
                  What is something you have never done but want to experience?
                </p>
              </div>

              <div className="mt-5 flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Mic className="h-6 w-6" />
                </div>

                <p className="mt-4 text-sm font-medium">
                  Record your answer
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try to speak for at least one minute.
                </p>

                <Button className="mt-4 gap-2">
                  <Mic className="h-4 w-4" />
                  Start recording
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* NEXT LESSON */}
        <section className="flex items-center justify-between pb-8">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Previous lesson
          </Button>

          <Button className="gap-2">
            Complete lesson
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>
    </main>
  );
}