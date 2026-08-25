"use client";

import {
  BookOpen,
  CalendarDays,
  Mail,
  Pencil,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  function choosePhoto(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-5 py-6 md:px-6">
        {/* HEADER */}
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your profile
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Profile
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and learning preferences.
          </p>
        </section>

        {/* PROFILE SUMMARY */}
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* AVATAR */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
                  {photo ? <Image unoptimized src={photo} alt="Foto de perfil de Mey" width={64} height={64} className="h-full w-full object-cover" /> : <User className="h-7 w-7" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      Mey
                    </h2>

                    <Badge>A2 learner</Badge>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    mey@example.com
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Learning with Bright Bytes
                  </p>
                </div>
              </div>

              <input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => choosePhoto(event.target.files?.[0])} />
              <Button variant="outline" className="gap-2" onClick={() => photoInput.current?.click()}>
                <Pencil className="h-4 w-4" />
                Cambiar foto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QUICK INFORMATION */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <BookOpen className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Current level
                </p>

                <p className="text-sm font-semibold">
                  English A2
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Member since
                </p>

                <p className="text-sm font-semibold">
                  August 2026
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Mail className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Account
                </p>

                <p className="text-sm font-semibold">
                  Active
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* PERSONAL INFORMATION */}
        <Card>
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="text-lg">
              Personal information
            </CardTitle>

            <CardDescription>
              Basic information associated with your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                >
                  Name
                </label>

                <Input
                  id="name"
                  defaultValue="Mey"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <Input
                  id="email"
                  type="email"
                  defaultValue="mey@example.com"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button>
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* LEARNING PREFERENCES */}
        <Card>
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="text-lg">
              Learning preferences
            </CardTitle>

            <CardDescription>
              A few settings for your Bright Bytes learning experience.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="space-y-5">
              {/* LANGUAGE */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Native language
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Used for translations and learning support.
                  </p>
                </div>

                <Badge variant="secondary">
                  Spanish
                </Badge>
              </div>

              <Separator />

              {/* LEVEL */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Current English level
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Your active Bright Bytes course.
                  </p>
                </div>

                <Badge variant="secondary">
                  A2
                </Badge>
              </div>

              <Separator />

              {/* GOAL */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Weekly learning goal
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Number of days you want to practice each week.
                  </p>
                </div>

                <Badge variant="secondary">
                  5 days
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACCOUNT */}
        <Card>
          <CardHeader className="px-5 pb-3 pt-5">
            <CardTitle className="text-lg">
              Account
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Password
                </p>

                <p className="text-xs text-muted-foreground">
                  Change the password used to access your account.
                </p>
              </div>

              <Button variant="outline">
                Change password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}