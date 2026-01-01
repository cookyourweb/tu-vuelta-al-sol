// src/components/agenda/AperturaAnual.tsx
'use client';

import React from 'react';

interface AperturaAnualProps {
  userProfile: {
    name: string;
    currentAge: number;
    birthDate: string;
  } | null;
  solarReturnInterpretation: any;
}

export default function AperturaAnual({ userProfile, solarReturnInterpretation }: AperturaAnualProps) {
  return (
    <div className="max-w-7xl mx-auto mb-12">
      <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
        <h2 className="text-4xl font-black text-white mb-8 text-center">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Bienvenido a tu Agenda Astrológica Personal
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QUIÉN ERES */}
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
              <span className="mr-2">✨</span>
              Quién Eres
            </h3>
            {userProfile ? (
              <div className="text-white space-y-2">
                <p className="text-sm"><span className="font-semibold">Nombre:</span> {userProfile.name}</p>
                <p className="text-sm"><span className="font-semibold">Edad:</span> {userProfile.currentAge} años</p>
                <p className="text-sm">
                  <span className="font-semibold">Cumpleaños:</span>{' '}
                  {new Date(userProfile.birthDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </p>
                <p className="text-xs text-purple-200 mt-4 italic">
                  Tu carta natal es tu huella energética única en el cosmos
                </p>
              </div>
            ) : (
              <p className="text-sm text-purple-200">Cargando perfil...</p>
            )}
          </div>

          {/* QUÉ SE ACTIVA ESTE AÑO */}
          <div className="bg-indigo-900/40 backdrop-blur-sm rounded-2xl p-6 border border-indigo-400/30">
            <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              Qué Se Activa Este Año
            </h3>
            {solarReturnInterpretation?.apertura_anual ? (
              <div className="text-white space-y-2">
                <p className="text-sm font-semibold text-cyan-200">
                  {solarReturnInterpretation.apertura_anual.tema_central}
                </p>
                <p className="text-xs text-indigo-200 mt-3">
                  {solarReturnInterpretation.apertura_anual.eje_del_ano?.substring(0, 150)}...
                </p>
              </div>
            ) : (
              <p className="text-sm text-indigo-200">Cargando interpretación de tu año solar...</p>
            )}
          </div>

          {/* CÓMO USAR ESTA AGENDA */}
          <div className="bg-green-900/40 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
            <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center">
              <span className="mr-2">📖</span>
              Cómo Usar Esta Agenda
            </h3>
            <div className="text-white space-y-2 text-sm">
              <p className="text-green-200">1. <span className="font-semibold">Revisa tus planetas activos</span> (abajo)</p>
              <p className="text-green-200">2. <span className="font-semibold">Consulta el calendario</span> para eventos importantes</p>
              <p className="text-green-200">3. <span className="font-semibold">Haz clic en cualquier evento</span> para ver interpretación cruzada</p>
              <p className="text-xs text-green-300 mt-4 italic">
                Cada evento cruza: tu natal + tus planetas activos + el momento
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
