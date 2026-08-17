"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const passwordsMatch =
    form.password.length > 0 &&
    form.password === form.confirmPassword;

  const passwordValid =
    form.password.length >= 8 &&
    /[A-Za-z]/.test(form.password) &&
    /\d/.test(form.password);

  const canSubmit = passwordValid && passwordsMatch;

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canSubmit) return;

    console.log("New password:", form.password);
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

            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700">
                <Sparkles size={14} />
                Crea una nueva contraseña
              </div>

              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950">
                Restablece tu contraseña
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Elige una nueva contraseña para volver a acceder a tu cuenta.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Password */}
              <PasswordField
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                show={showPassword}
                onToggle={() =>
                  setShowPassword((current) => !current)
                }
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    password: value,
                  }))
                }
              />

              {/* Confirm */}
              <PasswordField
                label="Confirmar contraseña"
                placeholder="Escribe nuevamente tu contraseña"
                value={form.confirmPassword}
                show={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword((current) => !current)
                }
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    confirmPassword: value,
                  }))
                }
              />

              {/* Requirements */}
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tu contraseña necesita
                </p>

                <div className="space-y-2.5">
                  <Requirement
                    text="8 o más caracteres"
                    completed={form.password.length >= 8}
                  />

                  <Requirement
                    text="Al menos una letra"
                    completed={/[A-Za-z]/.test(form.password)}
                  />

                  <Requirement
                    text="Al menos un número"
                    completed={/\d/.test(form.password)}
                  />

                  <Requirement
                    text="Las contraseñas coinciden"
                    completed={passwordsMatch}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Guardar nueva contraseña
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              ¿Recordaste tu contraseña?{" "}
              <Link
                href="/auth/login"
                className="font-black text-cyan-600 transition hover:text-cyan-700"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:items-center lg:justify-center">
          <div className="absolute -right-24 top-[-70px] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-[-70px] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="relative max-w-md px-10">
            <div className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-white">
              <Lock size={21} />
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-[-0.03em] text-white">
              Un pequeño paso y estás de vuelta.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Cambia tu contraseña y continúa tu progreso en Bright Bytes.
            </p>

            <div className="mt-10 space-y-4">
              <Benefit text="Tus lecciones siguen guardadas" />
              <Benefit text="Tu progreso sigue intacto" />
              <Benefit text="Tus palabras aprendidas siguen ahí" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  show,
  onToggle,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <Lock
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          required
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </label>
  );
}

function Requirement({
  text,
  completed,
}: {
  text: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full transition ${
          completed
            ? "bg-cyan-500 text-white"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        <Check size={10} strokeWidth={3} />
      </div>

      <span
        className={`text-xs font-medium ${
          completed
            ? "text-slate-700"
            : "text-slate-400"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
        <Check size={13} strokeWidth={3} />
      </div>

      <p className="font-semibold text-slate-300">
        {text}
      </p>
    </div>
  );
}