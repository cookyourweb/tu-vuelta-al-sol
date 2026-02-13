// src/app/terms/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Tu Vuelta al Sol',
  description: 'Términos y condiciones de uso de Tu Vuelta al Sol.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center text-purple-300 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-8">
          Términos y Condiciones
        </h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: 13 de febrero de 2026</p>

        <div className="prose prose-invert prose-purple max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Identificación del responsable</h2>
            <p>
              El presente sitio web <strong>tuvueltaalsol.es</strong> es propiedad de Wunjo Creations
              (en adelante, &ldquo;el Responsable&rdquo;). Para cualquier consulta, puedes contactarnos
              en <a href="mailto:agenda@tuvueltaalsol.com" className="text-purple-400 hover:text-purple-300">agenda@tuvueltaalsol.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Objeto y aceptación</h2>
            <p>
              Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma Tu Vuelta al Sol,
              que ofrece servicios de astrología personalizada, incluyendo cartas natales, retornos solares
              y agendas astrológicas. Al registrarte o utilizar nuestros servicios, aceptas estos términos en su totalidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Descripción del servicio</h2>
            <p>Tu Vuelta al Sol proporciona:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Generación de cartas natales personalizadas basadas en datos de nacimiento.</li>
              <li>Cálculo e interpretación de retornos solares anuales.</li>
              <li>Agenda astrológica personalizada con tránsitos, lunas y eventos clave.</li>
              <li>Interpretaciones generadas con asistencia de inteligencia artificial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Registro y cuenta de usuario</h2>
            <p>
              Para acceder a los servicios, deberás crear una cuenta proporcionando datos verídicos y actualizados.
              Eres responsable de mantener la confidencialidad de tus credenciales de acceso.
              El Responsable se reserva el derecho de suspender cuentas que incumplan estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Naturaleza del contenido astrológico</h2>
            <p>
              Las interpretaciones astrológicas proporcionadas tienen un carácter orientativo, educativo y de entretenimiento.
              <strong> No constituyen asesoramiento médico, psicológico, legal ni financiero.</strong> El usuario
              reconoce que las decisiones basadas en el contenido astrológico son de su exclusiva responsabilidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Pagos y suscripciones</h2>
            <p>
              Algunos servicios requieren pago. Los precios se muestran antes de la compra e incluyen
              los impuestos aplicables. Los pagos se procesan de forma segura a través de Stripe.
              Las condiciones de reembolso se detallan en la política de cada producto en el momento de la compra.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Propiedad intelectual</h2>
            <p>
              Todo el contenido de la plataforma (textos, diseños, código, interpretaciones, logotipos e imágenes)
              es propiedad de Wunjo Creations o de sus licenciantes y está protegido por las leyes de propiedad
              intelectual. Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Uso de inteligencia artificial</h2>
            <p>
              Parte de las interpretaciones astrológicas se generan mediante modelos de inteligencia artificial.
              Estas interpretaciones se basan en principios astrológicos tradicionales pero pueden contener
              inexactitudes. El Responsable no garantiza la exactitud absoluta del contenido generado por IA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Limitación de responsabilidad</h2>
            <p>
              El Responsable no será responsable de daños directos o indirectos derivados del uso de la plataforma,
              interrupciones del servicio, errores en los cálculos astrológicos o decisiones tomadas en base
              al contenido proporcionado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Modificaciones</h2>
            <p>
              El Responsable se reserva el derecho de modificar estos Términos en cualquier momento.
              Los cambios serán notificados a través de la plataforma y entrarán en vigor desde su publicación.
              El uso continuado del servicio tras la modificación implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Legislación aplicable</h2>
            <p>
              Los presentes Términos se rigen por la legislación española. Para la resolución de cualquier
              controversia, las partes se someten a los juzgados y tribunales del domicilio del usuario,
              conforme a la normativa vigente de protección al consumidor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Contacto</h2>
            <p>
              Para cualquier duda sobre estos términos, puedes escribirnos a{' '}
              <a href="mailto:agenda@tuvueltaalsol.com" className="text-purple-400 hover:text-purple-300">
                agenda@tuvueltaalsol.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
