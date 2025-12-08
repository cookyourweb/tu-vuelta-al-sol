'use client';

import { useState, useEffect } from 'react';
import { Star, Sparkles, CreditCard, User, Mail, MapPin, Heart, Clock, Globe, CheckCircle2, Calendar } from 'lucide-react';
import PaymentButton from '@/components/stripe/PaymentButton';
import { useAuth } from '@/context/AuthContext';
import BirthDataForm from '@/components/dashboard/BirthDataForm';
import PrimaryHeader from '@/components/layout/PrimaryHeader';
import Footer from '@/components/layout/Footer';

interface BirthData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  currentLocation: string;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  address: string;
  message: string;
  birthData: BirthData;
}

interface RecipientInfo {
  isForSelf: boolean;
  recipients: Recipient[];
}

export default function BuyAgendaPage() {
  const { user } = useAuth();
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo>({
    isForSelf: true,
    recipients: [{
      id: '1',
      name: '',
      email: '',
      address: '',
      message: '',
      birthData: {
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        currentLocation: '',
      }
    }]
  });

  const [birthDataSaved, setBirthDataSaved] = useState(false);
  const [savedBirthData, setSavedBirthData] = useState<any>(null);

  // Load existing birth data from API
  useEffect(() => {
    console.log('🔍 [COMPRA AGENDA] useEffect ejecutado');
    console.log('🔍 [COMPRA AGENDA] user object:', user);

    if (user) {
      console.log('🔍 [COMPRA AGENDA] Usuario autenticado, uid:', user.uid);
      console.log('🔍 [COMPRA AGENDA] Email del usuario:', user.email);

      const fetchBirthData = async () => {
        try {
          const apiUrl = `/api/birth-data?userId=${user.uid}`;
          console.log('📡 [COMPRA AGENDA] URL de la petición:', apiUrl);

          const res = await fetch(apiUrl);
          console.log('📡 [COMPRA AGENDA] Respuesta del fetch:', res);
          console.log('📡 [COMPRA AGENDA] Status:', res.status, res.statusText);

          if (res.ok) {
            const responseData = await res.json();
            console.log('✅ [COMPRA AGENDA] Datos de respuesta:', responseData);

            if (responseData.success && responseData.data) {
              console.log('📝 [COMPRA AGENDA] Datos encontrados:', responseData.data);
              setSavedBirthData(responseData.data);
              setBirthDataSaved(true);

              setRecipientInfo(prev => ({
                ...prev,
                recipients: prev.recipients.map(recipient => ({
                  ...recipient,
                  email: user.email || '',
                  birthData: {
                    name: responseData.data.fullName || user.displayName || '',
                    birthDate: responseData.data.date || '',
                    birthTime: responseData.data.time || '',
                    birthPlace: responseData.data.location || '',
                    currentLocation: responseData.data.livesInSamePlace ? responseData.data.location : (responseData.data.currentPlace || ''),
                  }
                }))
              }));
              console.log('✅ [COMPRA AGENDA] Datos cargados exitosamente en el formulario');
            } else {
              console.log('⚠️ [COMPRA AGENDA] No se encontraron datos en la respuesta');
            }
          } else {
            console.log('❌ [COMPRA AGENDA] Error en la respuesta:', res.status, res.statusText);
            const errorText = await res.text();
            console.log('❌ [COMPRA AGENDA] Error body:', errorText);
          }
        } catch (error) {
          console.error('❌ [COMPRA AGENDA] Error fetching birth data:', error);
        }
      };

      fetchBirthData();
    } else {
      console.log('⚠️ [COMPRA AGENDA] No hay usuario autenticado');
    }
  }, [user]);

  const handleRecipientChange = (field: keyof Omit<RecipientInfo, 'recipients'>, value: boolean) => {
    setRecipientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecipientFieldChange = (recipientId: string, field: keyof Omit<Recipient, 'id' | 'birthData'>, value: string) => {
    setRecipientInfo(prev => ({
      ...prev,
      recipients: prev.recipients.map(recipient =>
        recipient.id === recipientId ? { ...recipient, [field]: value } : recipient
      )
    }));
  };

  const handleBirthDataChange = (recipientId: string, field: string, value: string) => {
    // Map FormData fields to BirthData fields
    const fieldMapping: Record<string, keyof BirthData> = {
      fullName: 'name',
      date: 'birthDate',
      time: 'birthTime',
      location: 'birthPlace',
      currentPlace: 'currentLocation'
    };

    const birthDataField = fieldMapping[field] || field as keyof BirthData;

    setRecipientInfo(prev => ({
      ...prev,
      recipients: prev.recipients.map(recipient =>
        recipient.id === recipientId
          ? {
              ...recipient,
              birthData: {
                ...recipient.birthData,
                [birthDataField]: value
              }
            }
          : recipient
      )
    }));
  };

  const addRecipient = () => {
    const newId = (recipientInfo.recipients.length + 1).toString();
    setRecipientInfo(prev => ({
      ...prev,
      recipients: [
        ...prev.recipients,
        {
          id: newId,
          name: '',
          email: '',
          address: '',
          message: '',
          birthData: {
            name: '',
            birthDate: '',
            birthTime: '',
            birthPlace: '',
            currentLocation: '',
          }
        }
      ]
    }));
  };

  const removeRecipient = (recipientId: string) => {
    if (recipientInfo.recipients.length > 1) {
      setRecipientInfo(prev => ({
        ...prev,
        recipients: prev.recipients.filter(recipient => recipient.id !== recipientId)
      }));
    }
  };

  const isFormValid = recipientInfo.isForSelf
    ? (birthDataSaved && savedBirthData) // Para mí: solo necesita datos guardados
    : recipientInfo.recipients.every(recipient => // Para regalo: todos los destinatarios deben tener datos completos
        recipient.name &&
        recipient.email &&
        recipient.address &&
        recipient.birthData.name &&
        recipient.birthData.birthDate &&
        recipient.birthData.birthTime &&
        recipient.birthData.birthPlace &&
        recipient.birthData.currentLocation
      );

  return (
    <>
      {/* Header */}
      <PrimaryHeader />

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
              con eventos cósmicos y rituales energéticos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 📅 Información del Regalo */}
            <div className="space-y-6">
              {/* Información del Destinatario */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h2 className="text-2xl font-bold text-white">¿Para Quién es?</h2>
                </div>

                <div className="space-y-4">
                  {/* Selector: Para ti o para otra persona */}
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <label className="block text-white text-sm font-medium mb-3">
                      ¿Para quién es la agenda? *
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleRecipientChange('isForSelf', true)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          recipientInfo.isForSelf
                            ? 'border-pink-400 bg-pink-400/20 text-white'
                            : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40'
                        }`}
                      >
                        <User className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Para mí</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRecipientChange('isForSelf', false)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          !recipientInfo.isForSelf
                            ? 'border-pink-400 bg-pink-400/20 text-white'
                            : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40'
                        }`}
                      >
                        <Heart className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">Es un regalo</span>
                      </button>
                    </div>
                  </div>

                  {/* ✅ DATOS DE NACIMIENTO */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-400/30">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      {recipientInfo.isForSelf ? 'Tu Perfil Cósmico' : 'Datos de los Destinatarios'}
                    </h3>
                    <p className="text-purple-200 text-sm mb-4">
                      {recipientInfo.isForSelf
                        ? 'Información personal verificada y configurada'
                        : 'Información necesaria para crear las cartas natales'}
                    </p>

                    {recipientInfo.isForSelf ? (
                      // Mostrar datos del usuario actual (estilo dashboard)
                      birthDataSaved && savedBirthData ? (
                        <div className="bg-white rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <h4 className="text-lg font-semibold text-gray-800">Datos de Nacimiento</h4>
                          </div>

                          <div className="space-y-4">
                            {/* Nombre */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <User className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm text-gray-500">Nombre completo</p>
                                <p className="font-medium text-gray-800">{savedBirthData.fullName}</p>
                              </div>
                            </div>

                            {/* Fecha de nacimiento */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                                <p className="font-medium text-gray-800">
                                  {new Date(savedBirthData.date).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Hora de nacimiento */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Clock className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm text-gray-500">Hora de nacimiento</p>
                                <p className="font-medium text-gray-800">{savedBirthData.time || 'No especificada'}</p>
                              </div>
                            </div>

                            {/* Lugar de nacimiento */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <MapPin className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm text-gray-500">Lugar de nacimiento</p>
                                <p className="font-medium text-gray-800">{savedBirthData.location || savedBirthData.birthPlace}</p>
                                <p className="text-xs text-gray-500 mt-1">🌍 Tu punto de origen</p>
                              </div>
                            </div>

                            {/* Lugar actual (si es diferente) */}
                            {!savedBirthData.livesInSamePlace && savedBirthData.currentPlace && (
                              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <Globe className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="text-sm text-blue-600">Lugar actual</p>
                                  <p className="font-medium text-gray-800">{savedBirthData.currentPlace}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="text-green-800 font-medium">Datos verificados y listos</span>
                            </div>
                            <p className="text-green-700 text-sm mt-1">
                              Estos datos se usarán para generar tu agenda astrológica personalizada.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-6">
                          <div className="text-center py-8">
                            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-600 mb-2">No hay datos de nacimiento</h4>
                            <p className="text-gray-500 text-sm">
                              Necesitas configurar tus datos de nacimiento en el dashboard para continuar.
                            </p>
                          </div>
                        </div>
                      )
                    ) : (
                      // Mostrar formularios para múltiples destinatarios (regalos)
                      <div className="space-y-6">
                        {recipientInfo.recipients.map((recipient, index) => (
                          <div key={recipient.id} className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-gray-800">
                                Destinatario {index + 1}
                                {recipientInfo.recipients.length > 1 && (
                                  <span className="text-sm text-gray-500 ml-2">#{recipient.id}</span>
                                )}
                              </h4>
                              {recipientInfo.recipients.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeRecipient(recipient.id)}
                                  className="text-red-500 hover:text-red-700 text-sm underline"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>

                            {/* Información del destinatario */}
                            <div className="space-y-4 mb-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Nombre del destinatario *
                                </label>
                                <input
                                  type="text"
                                  value={recipient.name}
                                  onChange={(e) => handleRecipientFieldChange(recipient.id, 'name', e.target.value)}
                                  placeholder="Nombre completo"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Email del destinatario *
                                </label>
                                <input
                                  type="email"
                                  value={recipient.email}
                                  onChange={(e) => handleRecipientFieldChange(recipient.id, 'email', e.target.value)}
                                  placeholder="correo@ejemplo.com"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Dirección postal completa *
                                </label>
                                <textarea
                                  value={recipient.address}
                                  onChange={(e) => handleRecipientFieldChange(recipient.id, 'address', e.target.value)}
                                  placeholder="Dirección completa para envío postal"
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mensaje personalizado (opcional)
                                </label>
                                <textarea
                                  value={recipient.message}
                                  onChange={(e) => handleRecipientFieldChange(recipient.id, 'message', e.target.value)}
                                  placeholder="Escribe un mensaje especial para acompañar el regalo"
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
                                />
                              </div>
                            </div>

                            {/* Formulario de datos de nacimiento */}
                            <div className="border-t pt-4">
                              <h5 className="text-md font-semibold text-gray-800 mb-3">Datos de nacimiento</h5>
                              <BirthDataForm
                                recipientId={recipient.id}
                                onBirthDataChange={(field, value) => handleBirthDataChange(recipient.id, field, value)}
                                initialData={recipient.birthData}
                              />
                            </div>
                          </div>
                        ))}

                        {/* Botón para agregar más destinatarios */}
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={addRecipient}
                            className="inline-flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Agregar otro destinatario
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Información de Entrega - Solo mostrar para "Para mí" */}
                  {recipientInfo.isForSelf && (
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-400/30">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-400" />
                        Información de Entrega
                      </h3>

                      <div className="space-y-4">
                        {/* Email */}
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Email de entrega *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                            <input
                              type="email"
                              value={recipientInfo.recipients[0]?.email || ''}
                              onChange={(e) => handleRecipientFieldChange('1', 'email', e.target.value)}
                              placeholder="correo@ejemplo.com"
                              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                          </div>
                          <p className="text-white/60 text-xs mt-1">
                            📧 Recibirás la versión digital aquí
                          </p>
                        </div>

                        {/* Dirección */}
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            Dirección postal completa *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-white/60" />
                            <textarea
                              value={recipientInfo.recipients[0]?.address || ''}
                              onChange={(e) => handleRecipientFieldChange('1', 'address', e.target.value)}
                              placeholder="Dirección completa para envío postal"
                              rows={3}
                              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                            />
                          </div>
                          <p className="text-white/60 text-xs mt-1">
                            📦 Para el envío del calendario físico
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                    €80
                    <span className="text-2xl text-purple-300 font-normal"> único</span>
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
                    <span>Eventos cósmicos y transitos importantes</span>
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
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/30">
                      {recipientInfo.isForSelf ? (
                        <>
                          <p className="text-white text-lg mb-2">
                            ✨ Tu agenda personalizada para{' '}
                            <span className="text-yellow-300 font-bold">
                              {savedBirthData?.fullName || user?.displayName}
                            </span>
                          </p>
                          {savedBirthData && (
                            <div className="text-white/80 text-sm space-y-1">
                              <p>📅 Nacimiento: {new Date(savedBirthData.date).toLocaleDateString('es-ES')}</p>
                              <p>🕐 Hora: {savedBirthData.time}</p>
                              <p>📍 Lugar: {savedBirthData.location}</p>
                              {!savedBirthData.livesInSamePlace && savedBirthData.currentPlace && (
                                <p>🏠 Actual: {savedBirthData.currentPlace}</p>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-white text-lg mb-2">
                            🎁 Vas a regalar {recipientInfo.recipients.length} agenda{recipientInfo.recipients.length > 1 ? 's' : ''} cósmica{recipientInfo.recipients.length > 1 ? 's' : ''}
                          </p>
                          <div className="text-white/80 text-sm space-y-2">
                            {recipientInfo.recipients.map((recipient, index) => (
                              <div key={recipient.id} className="bg-white/10 rounded p-2">
                                <p className="font-medium">
                                  🎁 Destinatario {index + 1}: {recipient.name}
                                </p>
                                <p className="text-xs">
                                  📅 {new Date(recipient.birthData.birthDate).toLocaleDateString('es-ES')} •
                                  📍 {recipient.birthData.birthPlace}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <PaymentButton
                      priceId={process.env.NEXT_PUBLIC_STRIPE_AGENDA_DIGITAL_PRICE_ID!}
                      userId={user?.uid || ''}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      💫 Comprar por €80
                    </PaymentButton>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <p className="text-white text-lg mb-2">
                      💫 Completa todos los campos obligatorios para continuar
                    </p>
                    <p className="text-white/60 text-sm">
                      Necesitamos tus datos de nacimiento para crear tu carta natal personalizada
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

      {/* Footer */}
      <Footer />
    </>
  );
}
