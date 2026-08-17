"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          data?.message ||
            data?.error ||
            "Correo o contraseña incorrectos."
        );
        return;
      }

      const token =
        data?.token ||
        data?.accessToken ||
        data?.jwt;

      if (!token) {
        setError(
          "El servidor inició sesión, pero no devolvió un token JWT."
        );
        return;
      }

      // Si el usuario quiere mantener la sesión iniciada,
      // usamos localStorage. Si no, sessionStorage.
      if (rememberMe) {
        localStorage.setItem("brightbytes_token", token);
        sessionStorage.removeItem("brightbytes_token");
      } else {
        sessionStorage.setItem("brightbytes_token", token);
        localStorage.removeItem("brightbytes_token");
      }

      setSuccess("¡Sesión iniciada! Cargando Bright Bytes...");

      setTimeout(() => {
        window.location.href =
          data?.user?.role === "admin"
            ? "/admin/courses"
            : "/student/dashboard";
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "No pudimos conectar con el servidor. Comprueba que el backend esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
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
                Sigue avanzando
              </div>

              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950">
                Bienvenida de vuelta
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Inicia sesión y continúa exactamente donde quedaste.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
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
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    Contraseña
                  </span>

                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-bold text-cyan-600 transition hover:text-cyan-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </label>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-cyan-500"
                />

                <span className="text-sm font-medium text-slate-500">
                  Mantener mi sesión iniciada
                </span>
              </label>

              {success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {success}
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                o
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Register */}
            <p className="text-center text-sm text-slate-500">
              ¿Aún no tienes una cuenta?{" "}
              <Link
                href="/auth/register"
                className="font-black text-cyan-600 transition hover:text-cyan-700"
              >
                Crear cuenta
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
              <Sparkles size={21} />
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-[-0.03em] text-white">
              Tu progreso sigue aquí.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              Vuelve a tus lecciones, mantén tu streak y sigue construyendo tu
              inglés un poquito cada día.
            </p>

            <div className="mt-10 space-y-4">
              <Benefit text="Continúa donde quedaste" />
              <Benefit text="Mantén tu streak activo" />
              <Benefit text="Revisa tus palabras nuevas" />
              <Benefit text="Mira cuánto has avanzado" />
            </div>

            {/* Progress card */}
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-slate-400">
                    Próxima lesson
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    Talking about your routine
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-500 text-white">
                  <ArrowRight size={18} />
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    A2 progress
                  </span>

                  <span className="text-xs font-black text-cyan-400">
                    62%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[62%] rounded-full bg-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Benefit({
  text,
}: {
  text: string;
}) {
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