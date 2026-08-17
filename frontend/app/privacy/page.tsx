import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Eye,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-950">
      {/* Header */}
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
        {/* Intro */}
        <div className="mb-14">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <ShieldCheck size={22} />
          </div>

          <p className="mb-3 text-sm font-black uppercase tracking-[0.15em] text-cyan-600">
            Bright Bytes
          </p>

          <h1 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
            Política de privacidad
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            Queremos que sepas qué información recopilamos, para qué la
            utilizamos y cómo protegemos tus datos mientras utilizas Bright
            Bytes.
          </p>

          <p className="mt-4 text-sm font-semibold text-slate-400">
            Última actualización: agosto de 2026
          </p>
        </div>

        <div className="space-y-10">
          <PrivacySection
            icon={<Database size={19} />}
            title="1. Información que recopilamos"
          >
            <p>
              Al crear y utilizar una cuenta de Bright Bytes podemos recopilar
              información como tu nombre, correo electrónico y los datos que
              voluntariamente proporciones durante tu experiencia en la
              plataforma.
            </p>

            <p>
              También podemos almacenar información relacionada con tu
              aprendizaje, como las lecciones completadas, palabras aprendidas,
              progreso, streak y actividad dentro de la plataforma.
            </p>
          </PrivacySection>

          <PrivacySection
            icon={<Eye size={19} />}
            title="2. Cómo utilizamos tu información"
          >
            <p>
              Utilizamos esta información para proporcionar y mejorar Bright
              Bytes, guardar tu progreso, personalizar tu experiencia de
              aprendizaje y comprender de manera general cómo se utiliza la
              plataforma.
            </p>

            <p>
              También podemos utilizar datos agregados para analizar aspectos
              como la actividad de los estudiantes, finalización de lecciones y
              uso de los cursos.
            </p>
          </PrivacySection>

          <PrivacySection
            icon={<Lock size={19} />}
            title="3. Protección de tus datos"
          >
            <p>
              Tomamos medidas razonables para proteger la información almacenada
              en Bright Bytes frente a accesos, modificaciones o divulgaciones
              no autorizadas.
            </p>

            <p>
              Las contraseñas no deben almacenarse como texto legible y los
              sistemas de autenticación utilizados por la plataforma deben
              aplicar mecanismos de protección adecuados.
            </p>
          </PrivacySection>

          <PrivacySection
            title="4. Servicios externos"
          >
            <p>
              Bright Bytes puede utilizar proveedores externos necesarios para
              operar la plataforma, por ejemplo servicios de alojamiento,
              almacenamiento, correo electrónico, autenticación o análisis.
            </p>

            <p>
              Estos proveedores pueden procesar únicamente la información
              necesaria para prestar sus respectivos servicios.
            </p>
          </PrivacySection>

          <PrivacySection title="5. Tus derechos">
            <p>
              Puedes solicitar información sobre tus datos personales,
              corregirlos o solicitar la eliminación de tu cuenta y de los datos
              asociados cuando corresponda.
            </p>
          </PrivacySection>

          <PrivacySection title="6. Cambios a esta política">
            <p>
              Podemos actualizar esta política cuando Bright Bytes cambie o
              incorpore nuevas funciones. Cuando exista una modificación
              relevante, actualizaremos la fecha indicada en esta página.
            </p>
          </PrivacySection>

          <PrivacySection
            icon={<Mail size={19} />}
            title="7. Contacto"
          >
            <p>
              Si tienes preguntas relacionadas con esta política o con tus datos
              personales, puedes contactar al equipo de Bright Bytes a través
              de nuestros canales oficiales de soporte.
            </p>
          </PrivacySection>
        </div>

        <LegalFooter />
      </div>
    </main>
  );
}

function PrivacySection({
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

function LegalFooter() {
  return (
    <div className="mt-14 flex flex-wrap gap-5 border-t border-slate-200 pt-8 text-sm font-semibold text-slate-400">
      <Link href="/privacy" className="text-cyan-600">
        Privacidad
      </Link>

      <Link
        href="/terms"
        className="transition hover:text-slate-700"
      >
        Términos de uso
      </Link>

      <Link
        href="/"
        className="transition hover:text-slate-700"
      >
        Bright Bytes
      </Link>
    </div>
  );
}