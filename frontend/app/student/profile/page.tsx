"use client";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, Mail, Pencil, User } from "lucide-react";
import { CurrentUser, getCurrentUser, updateCurrentUser } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { getCurrentUser().then((value) => { setUser(value); setName(value.name); setPreview(value.profilePhoto); }).catch((e: Error) => setMessage(e.message)); }, []);
  function choosePhoto(file?: File) { if (!file) return; if (!(["image/jpeg","image/png","image/webp"].includes(file.type)) || file.size > 2_000_000) { setMessage("Elige una imagen JPG, PNG o WebP menor de 2 MB."); return; } setPhoto(file); setPreview(URL.createObjectURL(file)); setMessage(""); }
  async function save() { setSaving(true); setMessage(""); try { const updated = await updateCurrentUser(name, photo); setUser(updated); setName(updated.name); setPreview(updated.profilePhoto); setPhoto(null); setMessage("Perfil actualizado correctamente."); } catch (e) { setMessage(e instanceof Error ? e.message : "No se pudo guardar el perfil."); } finally { setSaving(false); } }
  return <main className="min-h-screen bg-muted/30"><div className="mx-auto flex max-w-4xl flex-col gap-5 px-5 py-8">
    <section><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tu cuenta</p><h1 className="mt-1 text-2xl font-bold">Perfil</h1><p className="mt-1 text-sm text-muted-foreground">Información real guardada en Bright Bytes.</p></section>
    <Card><CardContent className="flex flex-col items-center justify-between gap-5 p-5 sm:flex-row"><div className="flex items-center gap-4"><div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">{preview?<Image unoptimized src={preview} alt={`Foto de perfil de ${name}`} width={80} height={80} className="size-full object-cover"/>:<User/>}</div><div><h2 className="text-xl font-semibold">{user?.name ?? "Cargando…"}</h2><p className="text-sm text-muted-foreground">{user?.email}</p><Badge className="mt-2">{user?.level ?? "Estudiante"}</Badge></div></div><input ref={input} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event)=>choosePhoto(event.target.files?.[0])}/><Button variant="outline" onClick={()=>input.current?.click()}><Pencil/>Cambiar foto</Button></CardContent></Card>
    <section className="grid gap-4 sm:grid-cols-2"><Card><CardContent className="flex items-center gap-3 p-4"><CalendarDays/><div><p className="text-xs text-muted-foreground">Miembro desde</p><b>{user ? new Intl.DateTimeFormat("es", {month:"long",year:"numeric"}).format(new Date(user.createdAt)) : "—"}</b></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-4"><Mail/><div><p className="text-xs text-muted-foreground">Cuenta</p><b>{user?.email ?? "—"}</b></div></CardContent></Card></section>
    <Card><CardHeader><CardTitle>Información personal</CardTitle><CardDescription>La foto y el nombre se actualizan en la base de datos al guardar.</CardDescription></CardHeader><CardContent><label htmlFor="name" className="text-sm font-medium">Nombre</label><Input id="name" className="mt-2" value={name} maxLength={80} onChange={(event)=>setName(event.target.value)}/>{message&&<p className="mt-3 text-sm text-muted-foreground">{message}</p>}<div className="mt-5 flex justify-end"><Button disabled={!user||saving||name.trim().length<2} onClick={save}>{saving?"Guardando…":"Guardar cambios"}</Button></div></CardContent></Card>
  </div></main>;
}