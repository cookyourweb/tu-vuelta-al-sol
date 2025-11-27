'use client';

import { useState } from 'react';
import { Calendar, Star, Sparkles, CreditCard, User, Mail, MapPin, Heart } from 'lucide-react';
import PaymentButton from '@/components/PaymentButton';

interface RecipientInfo {
  name: string;
  email: string;
  address: string;
  message: string;
}

export default function BuyAgendaPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo>({
    name: '',
    email: '',
    address: '',
    message: ''
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleRecipientChange = (field: keyof RecipientInfo, value: string) => {
    setRecipientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = selectedDate && recipientInfo.name && recipientInfo.email && recipientInfo.address;

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* 🌟 Fondo estelar */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-pink-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/6 right-2/5 w-2 h-2 bg-purple-200 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-1/6 left-2/5 w-2 h-2 bg-blue-200 rounded-full animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 🌙 Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Agenda Astrológica Personalizada</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Regala una Agenda Cósmica
            </h1>

            <p className="text-xl text-purple-200 leading-relaxed">
              Sorprende a alguien especial con una agenda astrológica personalizada basada en su carta natal,
              con eventos cósmicos y rituales energéticos para el mes seleccionado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 📅 Información del Regalo */}
            <div className="space-y-6">
              {/* Fecha del Mes */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Mes Cósmico</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-white text-lg font-medium">
                    ¿Para qué mes quieres la agenda?
                  </label>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={today}
                    max={maxDate}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />

                  {selectedDate && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/30">
                      <p className="text-white font-medium">
                        📅 Mes seleccionado: <span className="text-yellow-300">
                          {new Date(selectedDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Información del Destinatario */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h2 className="text-2xl font-bold text-white">Para Quién es el Regalo</h2>
                </div>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Nombre del destinatario *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                      <input
                        type="text"
                        value={recipientInfo.name}
                        onChange={(e) => handleRecipientChange('name', e.target.value)}
                        placeholder="Ej: María García"
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Email de entrega *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                      <input
                        type="email"
                        value={recipientInfo.email}
                        onChange={(e) => handleRecipientChange('email', e.target.value)}
                        placeholder="correo@ejemplo.com"
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Dirección de entrega *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                      <textarea
                        value={recipientInfo.address}
                        onChange={(e) => handleRecipientChange('address', e.target.value)}
                        placeholder="Dirección completa para envío"
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  {/* Mensaje Personal */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Mensaje personalizado (opcional)
                    </label>
                    <textarea
                      value={recipientInfo.message}
                      onChange={(e) => handleRecipientChange('message', e.target.value)}
                      placeholder="Un mensaje especial para acompañar el regalo..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 💰 Precio y Beneficios */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                    <CreditCard className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-medium">Precio Especial</span>
                  </div>

                  <div className="text-5xl font-bold text-white mb-2">
                    €15
                    <span className="text-2xl text-purple-300 font-normal">/mes</span>
                  </div>

                  <p className="text-purple-200">Envío incluido en toda España</p>
                </div>

                {/* ✨ Beneficios */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span>Agenda personalizada basada en carta natal</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span>Eventos cósmicos y transitos importantes del mes</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span>Rituales energéticos y afirmaciones diarias</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span>Consejos astrológicos para maximizar tu energía</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span>Envío postal certificado</span>
                  </div>

                  <div className="flex items-center gap-3 text-white">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span>Versión digital incluida por email</span>
                  </div>
                </div>
              </div>

              {/* 🛒 Botón de Compra */}
              <div className="text-center">
                {isFormValid ? (
                  <div className="space-y-4">
                    <p className="text-white text-lg">
                      ¡Perfecto! Vas a regalar una agenda cósmica a{' '}
                      <span className="text-yellow-300 font-bold">
                        {recipientInfo.name}
                      </span>{' '}
                      para el mes de{' '}
                      <span className="text-yellow-300 font-bold">
                        {new Date(selectedDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                      </span>
                    </p>

                    <PaymentButton
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    />
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <p className="text-white text-lg">
                      💫 Completa todos los campos obligatorios para continuar
                    </p>
                  </div>
                )}
              </div>

              {/* 🔒 Garantía */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-green-400">🔒</span>
                  <span className="text-white text-sm">Pago seguro con Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
