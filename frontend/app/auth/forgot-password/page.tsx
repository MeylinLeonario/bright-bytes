"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Reset password email:", email);

    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_0.9fr]">
        {/* LEFT */}
        <section className="flex items-center justify-center px-6 py-10 md:px-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link
              href="/"
              className="mb-12 inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500 text-lg font-black text-white">
                B
              </div>

              <span className="text-lg font-black tracking-tight text-slate-950">
                Bright Bytes
              </span>
            </Link>

            {!sent ? (
              <>
                {/* Header */}
                <div className="mb-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                    <Sparkles size={14} />
                    Recupera tu cuenta
                  </div>

                  <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950">
                    ¿Olvidaste tu contraseña?
                  </h1>

                  <p className="mt-3 leading-7 text-slate-500">
                    No pasa nada. Escribe el correo asociado a tu cuenta y te
                    enviaremos un enlace para crear una nueva contraseña.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Correo electrónico
                    </span>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="tu@email.com"
                        className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-cyan-600"
                  >
                    Enviar enlace
                    <ArrowRight size={17} />
                  </button>
                </form>

                {/* Back */}
                <Link
                  href="/auth/login"
                  className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Volver al login
                </Link>
              </>
            ) : (
              <SuccessState email={email} />
            )}
          </div>
        </section>

        {/* RIGHT */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:items-center lg:justify-center">
          <div className="absolute -right-24 top-[-70px] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-[-70px] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="relative max-w-md px-10">
            <div className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-white">
              <Sparkles size={21} />
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-[-0.03em] text-white">
              Tu progreso no desaparece.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Recupera tu acceso y vuelve a tus lecciones, palabras nuevas y
              progreso exactamente donde lo dejaste.
            </p>

            <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-slate-400">
                Bright Bytes
              </p>

              <p className="mt-2 text-xl font-black text-white">
                Cinco minutos más de inglés siguen contando.
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SuccessState({ email }: { email: string }) {
  return (
    <div>
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
        <CheckCircle2 size={26} />
      </div>

      <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950">
        Revisa tu correo
      </h1>

      <p className="mt-4 leading-7 text-slate-500">
        Si existe una cuenta asociada a{" "}
        <span className="font-bold text-slate-700">{email}</span>, recibirás
        un enlace para restablecer tu contraseña.
      </p>

      <div className="mt-8 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm leading-6 text-slate-500">
          ¿No llegó? Revisa spam o espera unos minutos antes de intentarlo
          nuevamente.
        </p>
      </div>

      <Link
        href="/auth/login"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800"
      >
        <ArrowLeft size={16} />
        Volver al login
      </Link>
    </div>
  );
}