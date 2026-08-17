import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Headphones,
  Languages,
  Mic,
  PenLine,
  Sparkles,
} from "lucide-react";

const lessonIncludes = [
  {
    icon: <BookOpen size={18} />,
    title: "Gramática útil",
    text: "Una idea clara por lección. Sin clases eternas.",
  },
  {
    icon: <Languages size={18} />,
    title: "5 palabras nuevas",
    text: "Vocabulario pequeño, práctico y fácil de recordar.",
  },
  {
    icon: <Headphones size={18} />,
    title: "Lecturas con audio",
    text: "Textos cortos para leer y escuchar inglés real.",
  },
  {
    icon: <Mic size={18} />,
    title: "Habla desde el inicio",
    text: "Ejercicios breves para perder el miedo a expresarte.",
  },
  {
    icon: <PenLine size={18} />,
    title: "Escribe un poquito",
    text: "Practica sin enfrentarte a páginas y páginas de ejercicios.",
  },
];

const benefits = [
  "Lecciones breves",
  "Aprendizaje progresivo",
  "Inglés práctico",
  "Audio incluido",
  "Progreso visible",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* NAV */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500 font-black text-white">
              B
            </div>

            <span className="text-lg font-black tracking-tight">
              Bright Bytes
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex">
            <a href="#metodo" className="transition hover:text-slate-950">
              Cómo funciona
            </a>
            <a href="#lecciones" className="transition hover:text-slate-950">
              Las lecciones
            </a>
            <a href="#progreso" className="transition hover:text-slate-950">
              Tu progreso
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Empezar
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-100 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-100px] h-[340px] w-[340px] rounded-full bg-pink-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-bold text-cyan-700">
              <Clock3 size={16} />
              Inglés para gente ocupada
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Aprende inglés.
              <span className="block text-cyan-500">
                Aunque sólo tengas 5 minutos.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Lecciones pequeñas, claras y completas para avanzar en inglés
              incluso entre clases, trabajo, universidad, familia y todo lo
              demás.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-4 text-base font-black text-white shadow-sm transition hover:bg-cyan-600"
              >
                Empezar mi primera lección
                <ArrowRight size={18} />
              </Link>

              <a
                href="#metodo"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Ver cómo funciona
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/60">
              <div className="rounded-[26px] bg-slate-50 p-5 md:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
                      Tu lección de hoy
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-950">
                      Talking about your day
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 font-black text-pink-500">
                    A2
                  </div>
                </div>

                <div className="space-y-3">
                  <LessonRow
                    number="01"
                    title="Grammar"
                    detail="Present simple"
                    color="cyan"
                  />
                  <LessonRow
                    number="02"
                    title="Vocabulary"
                    detail="5 new words"
                    color="pink"
                  />
                  <LessonRow
                    number="03"
                    title="Mini reading"
                    detail="1 min + audio"
                    color="cyan"
                  />
                  <LessonRow
                    number="04"
                    title="Speaking"
                    detail="Talk for 30 sec"
                    color="pink"
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Tiempo estimado
                      </p>
                      <p className="mt-1 text-2xl font-black">5–10 min</p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500">
                      <Clock3 size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-pink-100 bg-pink-50 px-5 py-4 shadow-lg md:block">
              <p className="text-xs font-bold uppercase tracking-wider text-pink-500">
                Hoy
              </p>
              <p className="mt-1 text-lg font-black text-slate-900">
                +5 palabras
              </p>
            </div>

            <div className="absolute -right-5 top-10 hidden rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4 shadow-lg md:block">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-600">
                Streak
              </p>
              <p className="mt-1 text-lg font-black text-slate-900">
                12 días
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-pink-500">
                No necesitas una hora
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                Tu vida no tiene que girar alrededor de aprender inglés.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-slate-600">
              <p>
                Puedes aprender mientras tu inglés se adapta a tu vida, y no al
                revés.
              </p>

              <p>
                Bright Bytes divide el aprendizaje en sesiones pequeñas que sí
                caben en un día ocupado. Cinco minutos hoy siguen siendo cinco
                minutos más de inglés que ayer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section id="metodo" className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">
            Poco tiempo. Mucha intención.
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Una lección pequeña sigue siendo una lección completa.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            No cortamos una clase larga en pedacitos. Diseñamos cada experiencia
            desde el principio para ser breve.
          </p>
        </div>

        <div
          id="lecciones"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {lessonIncludes.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg hover:shadow-slate-100"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-500 group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 leading-6 text-slate-500">
                {item.text}
              </p>
            </div>
          ))}

          <div className="rounded-3xl bg-pink-500 p-6 text-white">
            <Sparkles size={22} />

            <h3 className="mt-5 text-xl font-black">
              Y cuando tengas más tiempo...
            </h3>

            <p className="mt-3 leading-6 text-pink-50">
              Sigue. Haz otra lectura, practica tu speaking o completa otra
              lección. Cinco minutos son el mínimo, no el límite.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section id="progreso" className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-400">
              Tu progreso tiene que sentirse real
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              No estudies a ciegas.
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">
              Ve tus lecciones completadas, palabras aprendidas, días activos y
              cuánto has avanzado. Aprender inglés toma tiempo; tu progreso no
              debería ser invisible.
            </p>

            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-slate-950 transition hover:bg-slate-100"
            >
              Empezar a avanzar
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProgressStat label="Palabras nuevas" value="127" />
              <ProgressStat label="Lecciones" value="18" />
              <ProgressStat label="Streak" value="14 días" />
              <ProgressStat label="Nivel" value="A2" />
            </div>

            <div className="mt-4 rounded-3xl bg-white p-6 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Tu camino a B1
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    Sigue avanzando
                  </p>
                </div>

                <span className="text-2xl font-black text-cyan-500">
                  62%
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[62%] rounded-full bg-cyan-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-500">
            <Sparkles size={20} />
          </div>

          <h2 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            ¿Tienes cinco minutos?
            <span className="block text-cyan-500">
              Entonces tienes tiempo para inglés.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Empieza con una lección pequeña. Mañana haces otra. Y después otra.
            Así se construye un idioma.
          </p>

          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 text-base font-black text-white transition hover:bg-slate-800"
          >
            Crear mi cuenta
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <div className="h-7 w-7 rounded-xl bg-cyan-500" />
            Bright Bytes
          </div>

          <p>Inglés para vidas ocupadas.</p>
        </div>
      </footer>
    </main>
  );
}

function LessonRow({
  number,
  title,
  detail,
  color,
}: {
  number: string;
  title: string;
  detail: string;
  color: "cyan" | "pink";
}) {
  const styles = {
    cyan: "bg-cyan-50 text-cyan-600",
    pink: "bg-pink-50 text-pink-500",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black ${styles[color]}`}
      >
        {number}
      </div>

      <div className="flex-1">
        <p className="font-black text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-sm text-slate-400">
          {detail}
        </p>
      </div>

      <Check size={18} className="text-slate-300" />
    </div>
  );
}

function ProgressStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}