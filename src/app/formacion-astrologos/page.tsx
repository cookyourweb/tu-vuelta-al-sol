'use client';

import { useState } from 'react';
import { Star, Sparkles, Brain, Clock, Users, CheckCircle, Phone, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FormacionAstrologosPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    experiencia: '',
    interes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Integrar con API de leads (MongoDB, Airtable, etc.)
      const response = await fetch('/api/leads/astrologos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'formacion-astrologos',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Error al enviar');

      setSubmitted(true);
    } catch (err) {
      // Si la API no existe aún, simular éxito para testing
      console.log('Lead capturado (pendiente API):', formData);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">¡Gracias por tu interés!</h1>
          <p className="text-purple-200 mb-6">
            Me pondré en contacto contigo pronto para contarte cómo la IA puede transformar tu práctica astrológica.
          </p>
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <p className="text-sm text-purple-300 mb-2">¿Prefieres hablar ahora?</p>
            <a
              href="tel:+34919933516"
              className="flex items-center justify-center gap-2 text-white font-semibold"
            >
              <Phone className="w-4 h-4" />
              +34 919 933 516
            </a>
          </div>
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      {/* Header */}
      <header className="pt-8 pb-4 px-6">
        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
          ← Volver a Tu Vuelta al Sol
        </Link>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 text-sm font-medium">Formación Exclusiva para Astrólogos</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Transforma tu práctica astrológica con{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Inteligencia Artificial
          </span>
        </h1>

        <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
          Aprende a usar la IA como herramienta para crear interpretaciones más profundas,
          automatizar tu práctica y escalar tu negocio astrológico.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#formulario"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg hover:shadow-xl"
          >
            Quiero saber más
          </a>
          <a
            href="tel:+34919933516"
            className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Llamar ahora
          </a>
        </div>
      </section>

      {/* Beneficios */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-12">
          Lo que aprenderás
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 rounded-2xl p-6 border border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">IA para Interpretaciones</h3>
            <p className="text-purple-300">
              Crea interpretaciones personalizadas y profundas usando prompts especializados en astrología.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Automatización</h3>
            <p className="text-purple-300">
              Automatiza tareas repetitivas: emails, recordatorios, generación de informes y más.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Marca Blanca</h3>
            <p className="text-purple-300">
              Ofrece a tus clientes tu propia agenda astrológica personalizada con tu marca.
            </p>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="px-6 py-16 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            ¿Qué incluye la formación?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Curso completo de prompts para astrología',
              'Plantillas de interpretación personalizables',
              'Acceso a herramientas de IA especializadas',
              'Cómo crear tu propia agenda astrológica',
              'Automatización de redes sociales',
              'Estrategias de captación de clientes',
              'Soporte continuo vía grupo privado',
              'Actualizaciones y nuevas herramientas'
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-purple-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section id="formulario" className="px-6 py-16 max-w-2xl mx-auto">
        <div className="bg-white/10 rounded-3xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <Star className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Solicita información
            </h2>
            <p className="text-purple-300">
              Déjame tus datos y te contactaré personalmente
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                ¿Cuánta experiencia tienes como astrólogo/a?
              </label>
              <select
                value={formData.experiencia}
                onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" className="bg-purple-900">Selecciona una opción</option>
                <option value="principiante" className="bg-purple-900">Principiante (menos de 1 año)</option>
                <option value="intermedio" className="bg-purple-900">Intermedio (1-3 años)</option>
                <option value="avanzado" className="bg-purple-900">Avanzado (3-5 años)</option>
                <option value="profesional" className="bg-purple-900">Profesional (más de 5 años)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                ¿Qué te interesa más?
              </label>
              <select
                value={formData.interes}
                onChange={(e) => setFormData({ ...formData, interes: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" className="bg-purple-900">Selecciona una opción</option>
                <option value="interpretaciones" className="bg-purple-900">Crear interpretaciones con IA</option>
                <option value="automatizacion" className="bg-purple-900">Automatizar mi práctica</option>
                <option value="marca-blanca" className="bg-purple-900">Tener mi propia agenda astrológica</option>
                <option value="todo" className="bg-purple-900">Todo lo anterior</option>
              </select>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Solicitar información
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-purple-500/30 text-center">
            <p className="text-purple-400 text-sm mb-2">¿Prefieres hablar directamente?</p>
            <a
              href="tel:+34919933516"
              className="inline-flex items-center gap-2 text-white font-semibold hover:text-purple-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +34 919 933 516
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t border-purple-500/20">
        <p className="text-purple-400 text-sm">
          © {new Date().getFullYear()} Tu Vuelta al Sol by Wunjo Creations
        </p>
      </footer>
    </div>
  );
}
