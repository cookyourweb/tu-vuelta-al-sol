// src/app/privacy/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad - Tu Vuelta al Sol',
  description: 'Política de privacidad y protección de datos de Tu Vuelta al Sol.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center text-purple-300 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Link>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-8">
          Política de Privacidad
        </h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: 13 de febrero de 2026</p>

        <div className="prose prose-invert prose-purple max-w-none space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
            <p>
              El responsable del tratamiento de tus datos personales es <strong>Wunjo Creations</strong>,
              con correo de contacto{' '}
              <a href="mailto:agenda@tuvueltaalsol.com" className="text-purple-400 hover:text-purple-300">
                agenda@tuvueltaalsol.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos los siguientes datos personales cuando utilizas nuestros servicios:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Datos de registro:</strong> dirección de correo electrónico y nombre de usuario.</li>
              <li><strong>Datos de nacimiento:</strong> fecha, hora y lugar de nacimiento (necesarios para los cálculos astrológicos).</li>
              <li><strong>Datos de ubicación:</strong> coordenadas geográficas del lugar de nacimiento y, opcionalmente, ubicación actual (para el Retorno Solar).</li>
              <li><strong>Datos de pago:</strong> procesados directamente por Stripe. No almacenamos datos de tarjetas de crédito en nuestros servidores.</li>
              <li><strong>Datos de uso:</strong> interacciones con la plataforma, preferencias y configuraciones.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Finalidad del tratamiento</h2>
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Generar tu carta natal, retorno solar y agenda astrológica personalizada.</li>
              <li>Crear interpretaciones astrológicas basadas en tus datos de nacimiento.</li>
              <li>Gestionar tu cuenta de usuario y proporcionarte acceso a los servicios contratados.</li>
              <li>Procesar pagos y emitir facturas.</li>
              <li>Enviarte comunicaciones relacionadas con el servicio (no enviamos publicidad sin tu consentimiento).</li>
              <li>Mejorar nuestros servicios y la experiencia de usuario.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Base legal del tratamiento</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Ejecución del contrato:</strong> el tratamiento de tus datos es necesario para prestarte los servicios contratados.</li>
              <li><strong>Consentimiento:</strong> para el envío de comunicaciones comerciales y el uso de cookies no esenciales.</li>
              <li><strong>Interés legítimo:</strong> para la mejora de nuestros servicios y la prevención del fraude.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Destinatarios de los datos</h2>
            <p>Tus datos pueden ser compartidos con los siguientes proveedores de servicios:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Firebase (Google):</strong> autenticación y gestión de usuarios.</li>
              <li><strong>MongoDB Atlas:</strong> almacenamiento seguro de datos.</li>
              <li><strong>Stripe:</strong> procesamiento de pagos.</li>
              <li><strong>OpenAI:</strong> generación de interpretaciones astrológicas (se envían datos astrológicos calculados, no datos personales identificativos).</li>
              <li><strong>Vercel:</strong> alojamiento de la aplicación web.</li>
            </ul>
            <p className="mt-2">
              Todos estos proveedores cumplen con las normativas de protección de datos aplicables (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Transferencias internacionales</h2>
            <p>
              Algunos de nuestros proveedores están ubicados fuera del Espacio Económico Europeo (EEE).
              En estos casos, las transferencias se realizan con las garantías adecuadas, incluyendo
              cláusulas contractuales tipo aprobadas por la Comisión Europea y/o decisiones de adecuación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Conservación de datos</h2>
            <p>
              Conservamos tus datos personales mientras mantengas tu cuenta activa y durante el tiempo
              necesario para cumplir con las obligaciones legales aplicables. Puedes solicitar la eliminación
              de tu cuenta y datos en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Tus derechos</h2>
            <p>De acuerdo con el RGPD, tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Acceso:</strong> obtener confirmación de si tratamos tus datos y acceder a ellos.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de tus datos (&ldquo;derecho al olvido&rdquo;).</li>
              <li><strong>Limitación:</strong> solicitar la limitación del tratamiento en determinados supuestos.</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, escríbenos a{' '}
              <a href="mailto:agenda@tuvueltaalsol.com" className="text-purple-400 hover:text-purple-300">
                agenda@tuvueltaalsol.com
              </a>.
              Responderemos en un plazo máximo de 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Cookies</h2>
            <p>
              Utilizamos cookies esenciales para el funcionamiento de la plataforma (autenticación, preferencias de sesión).
              También utilizamos Google Tag Manager para analítica web, que puede establecer cookies de análisis.
              Puedes configurar tu navegador para rechazar cookies no esenciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos personales,
              incluyendo cifrado en tránsito (HTTPS/TLS), autenticación segura mediante Firebase,
              y almacenamiento en bases de datos con acceso restringido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Menores de edad</h2>
            <p>
              Nuestros servicios están dirigidos a personas mayores de 16 años. No recopilamos
              conscientemente datos de menores de 16 años. Si detectamos que hemos recopilado
              datos de un menor, procederemos a eliminarlos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política. Cualquier cambio será publicado
              en esta página con la fecha de actualización. Te recomendamos revisarla periódicamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Autoridad de control</h2>
            <p>
              Si consideras que el tratamiento de tus datos vulnera la normativa vigente, puedes presentar
              una reclamación ante la Agencia Española de Protección de Datos (AEPD):{' '}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                www.aepd.es
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Contacto</h2>
            <p>
              Para cualquier consulta sobre privacidad, escríbenos a{' '}
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
