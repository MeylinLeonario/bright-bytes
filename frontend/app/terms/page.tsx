import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CircleAlert,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-950">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 font-black text-white">
              B
            </div>

            <span className="font-black tracking-tight">
              Bright Bytes
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-14">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
            <Scale size={22} />
          </div>

          <p className="mb-3 text-sm font-black uppercase tracking-[0.15em] text-cyan-600">
            Bright Bytes
          </p>

          <h1 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
            Términos de uso
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            Estos términos establecen las condiciones básicas para utilizar
            Bright Bytes y sus herramientas de aprendizaje.
          </p>

          <p className="mt-4 text-sm font-semibold text-slate-400">
            Última actualización: agosto de 2026
          </p>
        </div>

        <div className="space-y-10">
          <TermsSection
            icon={<ShieldCheck size={19} />}
            title="1. Aceptación de los términos"
          >
            <p>
              Al crear una cuenta o utilizar Bright Bytes, aceptas estos
              términos de uso y nuestra política de privacidad.
            </p>

            <p>
              Si no estás de acuerdo con estas condiciones, no debes utilizar
              la plataforma.
            </p>
          </TermsSection>

          <TermsSection
            icon={<BookOpen size={19} />}
            title="2. Servicio educativo"
          >
            <p>
              Bright Bytes es una plataforma destinada al aprendizaje y práctica
              del inglés mediante lecciones, vocabulario, ejercicios, audios,
              lecturas y otras herramientas educativas.
            </p>

            <p>
              El progreso de aprendizaje depende de múltiples factores
              individuales. Bright Bytes no garantiza alcanzar un nivel
              específico de inglés dentro de un período determinado.
            </p>
          </TermsSection>

          <TermsSection
            icon={<UserRound size={19} />}
            title="3. Tu cuenta"
          >
            <p>
              Eres responsable de proporcionar información correcta al crear tu
              cuenta y de mantener seguras tus credenciales de acceso.
            </p>

            <p>
              No debes utilizar la cuenta de otra persona ni permitir usos
              abusivos o no autorizados de tu cuenta.
            </p>
          </TermsSection>

          <TermsSection title="4. Uso permitido">
            <p>
              Bright Bytes debe utilizarse de manera legal y respetuosa. No está
              permitido intentar acceder sin autorización a otras cuentas,
              sistemas administrativos, servidores o información de la
              plataforma.
            </p>

            <p>
              Tampoco está permitido interferir deliberadamente con el
              funcionamiento de Bright Bytes o utilizar la plataforma para
              actividades fraudulentas o ilícitas.
            </p>
          </TermsSection>

          <TermsSection title="5. Contenido de Bright Bytes">
            <p>
              Las lecciones, textos, ejercicios, diseños, materiales educativos
              y demás contenido original de Bright Bytes pueden estar
              protegidos por derechos de propiedad intelectual.
            </p>

            <p>
              El acceso a la plataforma no implica la transferencia de propiedad
              sobre dicho contenido ni autoriza su reproducción o distribución
              comercial sin permiso.
            </p>
          </TermsSection>

          <TermsSection
            icon={<CircleAlert size={19} />}
            title="6. Disponibilidad"
          >
            <p>
              Trabajamos para mantener Bright Bytes disponible y funcionando
              correctamente, pero pueden existir interrupciones temporales por
              mantenimiento, actualizaciones, problemas técnicos u otras
              circunstancias.
            </p>
          </TermsSection>

          <TermsSection title="7. Cambios en Bright Bytes">
            <p>
              Podemos modificar, añadir o retirar características de la
              plataforma para mejorar el servicio. También podemos actualizar
              estos términos cuando sea necesario.
            </p>
          </TermsSection>

          <TermsSection title="8. Suspensión de cuentas">
            <p>
              Podemos restringir o suspender cuentas cuando exista un uso
              fraudulento, abusivo, ilegal o que comprometa la seguridad de
              Bright Bytes o de otros usuarios.
            </p>
          </TermsSection>

          <TermsSection title="9. Contacto">
            <p>
              Si tienes preguntas sobre estos términos, puedes contactar al
              equipo de Bright Bytes mediante nuestros canales oficiales de
              soporte.
            </p>
          </TermsSection>
        </div>

        <div className="mt-14 flex flex-wrap gap-5 border-t border-slate-200 pt-8 text-sm font-semibold text-slate-400">
          <Link
            href="/privacy"
            className="transition hover:text-slate-700"
          >
            Privacidad
          </Link>

          <Link href="/terms" className="text-cyan-600">
            Términos de uso
          </Link>

          <Link
            href="/"
            className="transition hover:text-slate-700"
          >
            Bright Bytes
          </Link>
        </div>
      </div>
    </main>
  );
}

function TermsSection({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-slate-100 pb-10 last:border-0">
      <div className="mb-4 flex items-center gap-3">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            {icon}
          </div>
        )}

        <h2 className="text-xl font-black text-slate-900">
          {title}
        </h2>
      </div>

      <div className="space-y-4 text-[15px] leading-7 text-slate-600">
        {children}
      </div>
    </section>
  );
}