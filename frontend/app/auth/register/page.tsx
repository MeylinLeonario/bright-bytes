"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
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
            "No pudimos crear tu cuenta. Revisa tus datos e inténtalo otra vez."
        );
        return;
      }

      setSuccess(
        "¡Cuenta creada con éxito! Te llevaremos al inicio de sesión."
      );

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);
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
                Tu inglés empieza aquí
              </div>

              <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950">
                Crea tu cuenta
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                Empieza con pequeñas lecciones y avanza a tu ritmo, incluso si
                sólo tienes unos minutos al día.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <InputField
                label="Nombre"
                name="name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={handleChange}
                icon={<User size={18} />}
              />

              <InputField
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                icon={<Mail size={18} />}
              />

              {/* Password */}
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Contraseña
                </span>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    required
                    minLength={8}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
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

              {/* Password requirements */}
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tu contraseña debería tener
                </p>

                <div className="space-y-2">
                  <Requirement text="8 o más caracteres" />
                  <Requirement text="Al menos una letra" />
                  <Requirement text="Al menos un número" />
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  required
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-cyan-500"
                />

                <span className="text-sm leading-6 text-slate-500">
                  Acepto los{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-slate-800 underline underline-offset-2"
                  >
                    términos de uso
                  </Link>{" "}
                  y la{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-slate-800 underline underline-offset-2"
                  >
                    política de privacidad
                  </Link>
                  .
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
                {loading ? "Creando cuenta..." : "Crear mi cuenta"}
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

            {/* Login */}
            <p className="text-center text-sm text-slate-500">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="font-black text-cyan-600 transition hover:text-cyan-700"
              >
                Inicia sesión
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
              Cinco minutos hoy también cuentan.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              No necesitas reorganizar tu vida para aprender inglés. Empieza con
              una lección pequeña y construye desde ahí.
            </p>

            <div className="mt-10 space-y-4">
              <Benefit text="Lecciones cortas y completas" />
              <Benefit text="Speaking, writing, vocabulario y audio" />
              <Benefit text="Progreso que puedes ver" />
              <Benefit text="Aprende a tu propio ritmo" />
            </div>

            {/* Fake little progress card */}
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-400">
                    Primera meta
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    Completa tu primera lesson
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500 text-white">
                  <Check size={18} strokeWidth={3} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/4 rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputField({
  label,
  name,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          required
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
        />
      </div>
    </label>
  );
}

function Requirement({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
        <Check size={10} strokeWidth={3} />
      </div>

      {text}
    </div>
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