// src/app/(dashboard)/test-natal-chart/page.tsx
'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import { Sparkles, CheckCircle, XCircle, Clock, Globe, MapPin } from 'lucide-react';
import { validateBirthData, convertToUTC } from '@/utils/timezoneUtils';

export default function TestNatalChartPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeFormat, setTimeFormat] = useState<'HL' | 'UT' | 'LMT'>('HL');
  
  // Datos de prueba
  const [testData, setTestData] = useState({
    fullName: 'Verónica',
    birthDate: '1974-02-10',
    birthTime: '07:30:00',
    timeType: 'HL', // HL = Hora Local, UT = Universal Time
    latitude: '40.4383',
    longitude: '-3.7058',
    timezone: 'Europe/Madrid',
    location: 'Hospital La Milagrosa, Chamberí, Madrid'
  });

  // Opciones de tipo de hora
  const timeTypeOptions = [
    { value: 'HL', label: 'HL (Hora Local)', description: 'Hora del reloj en el lugar' },
    { value: 'UT', label: 'UT (Universal Time)', description: 'Hora UTC/GMT' },
    { value: 'LMT', label: 'LMT (Local Mean Time)', description: 'Hora solar media local' }
  ];

  // Convertir coordenadas a formato grados/minutos/segundos
  const formatDMS = (decimal: number, isLat: boolean) => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60);
    
    const direction = decimal >= 0 
      ? (isLat ? 'N' : 'E') 
      : (isLat ? 'S' : 'W');
    
    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  };

  // Calcular diferentes formatos de hora
  const calculateTimeFormats = () => {
    const validation = validateBirthData({
      birthDate: testData.birthDate,
      birthTime: testData.birthTime,
      latitude: testData.latitude,
      longitude: testData.longitude,
      timezone: testData.timezone
    });

    if (!validation.isValid) return null;

    const { utcTime, offset, isDST } = convertToUTC(
      testData.birthDate, 
      testData.birthTime, 
      testData.timezone
    );

    // Calcular LMT (Local Mean Time) basado en longitud
    const longitude = parseFloat(testData.longitude);
    const lmtOffsetMinutes = (longitude / 15) * 60; // 15° = 1 hora
    const lmtOffsetHours = Math.floor(Math.abs(lmtOffsetMinutes) / 60);
    const lmtOffsetMins = Math.round(Math.abs(lmtOffsetMinutes) % 60);
    const lmtSign = longitude >= 0 ? '+' : '-';
    const lmtOffset = `${lmtSign}${String(lmtOffsetHours).padStart(2, '0')}:${String(lmtOffsetMins).padStart(2, '0')}`;

    return {
      HL: {
        time: testData.birthTime,
        offset: offset,
        description: `Hora local (${isDST ? 'Horario de verano' : 'Horario estándar'})`
      },
      UT: {
        time: utcTime,
        offset: '+00:00',
        description: 'Hora Universal (UTC/GMT)'
      },
      LMT: {
        time: 'Calcular según longitud',
        offset: lmtOffset,
        description: `Hora solar media para longitud ${longitude}°`
      }
    };
  };

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validar datos primero
      const validation = validateBirthData({
        birthDate: testData.birthDate,
        birthTime: testData.birthTime,
        latitude: testData.latitude,
        longitude: testData.longitude,
        timezone: testData.timezone
      });

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Preparar datos según el tipo de hora seleccionado
      let finalBirthTime = testData.birthTime;
      let finalTimezone = testData.timezone;
      
      if (testData.timeType === 'UT') {
        // Si la hora ya está en UT, usar UTC como timezone
        finalBirthTime = testData.birthTime;
        finalTimezone = 'UTC';
      }

      const response = await fetch('/api/astrology/natal-chart-accurate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate: testData.birthDate,
          birthTime: finalBirthTime,
          latitude: parseFloat(testData.latitude),
          longitude: parseFloat(testData.longitude),
          timezone: finalTimezone,
          fullName: testData.fullName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      // Agregar información de validación al resultado
      data.validation = validation;
      data.timeFormats = calculateTimeFormats();
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const timeFormats = calculateTimeFormats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient">🧪 Test de Carta Natal</span>
        </h1>
        <p className="text-xl text-gray-300">
          Verificación de coordenadas, zonas horarias y cálculos UT/UTC
        </p>
      </div>

      {/* Formulario de datos */}
      <Card gradient="purple" className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Datos de Prueba</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1 */}
          <div className="space-y-4">
            <Input
              label="Nombre"
              value={testData.fullName}
              onChange={(e) => setTestData({...testData, fullName: e.target.value})}
            />
            
            <Input
              label="Fecha de nacimiento"
              type="date"
              value={testData.birthDate}
              onChange={(e) => setTestData({...testData, birthDate: e.target.value})}
            />
            
            <div className="space-y-2">
              <Input
                label="Hora de nacimiento"
                type="time"
                step="1"
                value={testData.birthTime}
                onChange={(e) => setTestData({...testData, birthTime: e.target.value})}
              />
              
              <Select
                options={timeTypeOptions}
                value={testData.timeType}
                onChange={(value) => setTestData({...testData, timeType: value as 'HL' | 'UT' | 'LMT'})}
              />
            </div>
          </div>
          
          {/* Columna 2 */}
          <div className="space-y-4">
            <Input
              label="Latitud"
              value={testData.latitude}
              onChange={(e) => setTestData({...testData, latitude: e.target.value})}
              helperText={testData.latitude ? formatDMS(parseFloat(testData.latitude), true) : ''}
            />
            
            <Input
              label="Longitud"
              value={testData.longitude}
              onChange={(e) => setTestData({...testData, longitude: e.target.value})}
              helperText={testData.longitude ? formatDMS(parseFloat(testData.longitude), false) : ''}
            />
            
            <Select
              label="Zona horaria"
              options={[
                { value: 'Europe/Madrid', label: 'Madrid (UTC+1/+2)' },
                { value: 'UTC', label: 'UTC (UTC+0)' },
                { value: 'America/New_York', label: 'New York (UTC-5/-4)' },
              ]}
              value={testData.timezone}
              onChange={(value) => setTestData({...testData, timezone: value})}
            />
          </div>
        </div>

        {/* Información de conversión de tiempo */}
        {timeFormats && (
          <div className="mt-6 bg-white/10 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              ⏰ Conversiones de Tiempo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(timeFormats).map(([type, data]) => (
                <div key={type} className={`p-3 rounded-lg ${testData.timeType === type ? 'bg-yellow-400/20 border border-yellow-400/40' : 'bg-white/5'}`}>
                  <div className="font-semibold text-white">{type}</div>
                  <div className="text-gray-300">{data.time}</div>
                  <div className="text-xs text-gray-400">Offset: {data.offset}</div>
                  <div className="text-xs text-gray-400 mt-1">{data.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Botón de prueba */}
      <div className="text-center mb-8">
        <Button
          onClick={runTest}
          isLoading={loading}
          size="lg"
          leftIcon={<Sparkles className="w-5 h-5" />}
        >
          {loading ? 'Generando carta natal...' : 'Ejecutar Prueba'}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <Alert
          variant="destructive"
          title="Error en la prueba"
          className="mb-8"
        >
          {error}
        </Alert>
      )}

      {/* Resultados */}
      {result && (
        <div className="space-y-8">
          <Alert
            variant="success"
            title="¡Carta natal generada exitosamente!"
          >
            Los cálculos se han completado correctamente
          </Alert>

          {/* Información de validación */}
          <Card gradient="blue">
            <h3 className="text-xl font-bold mb-4 text-white">Validación de Datos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300">
                  <CheckCircle className="inline w-4 h-4 text-green-400 mr-2" />
                  <strong>Coordenadas formateadas:</strong> {result.validation?.correctedData.coordinatesFormatted}
                </p>
                <p className="text-gray-300 mt-2">
                  <CheckCircle className="inline w-4 h-4 text-green-400 mr-2" />
                  <strong>Timezone offset:</strong> {result.validation?.correctedData.timezoneOffset}
                </p>
              </div>
              <div>
                <p className="text-gray-300">
                  <CheckCircle className="inline w-4 h-4 text-green-400 mr-2" />
                  <strong>Hora UTC calculada:</strong> {result.validation?.correctedData.birthTimeUTC}
                </p>
                <p className="text-gray-300 mt-2">
                  <CheckCircle className="inline w-4 h-4 text-green-400 mr-2" />
                  <strong>Horario:</strong> {result.validation?.correctedData.isDST ? 'Verano (DST)' : 'Estándar'}
                </p>
              </div>
            </div>
          </Card>

          {/* Posiciones planetarias */}
          {result.data?.planets && (
            <Card gradient="purple">
              <h3 className="text-xl font-bold mb-4 text-white">Posiciones Planetarias</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.data.planets.map((planet: any, index: number) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white font-semibold">
                      {planet.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {planet.position} - Casa {planet.house}
                    </p>
                    <p className="text-xs text-gray-400">
                      {planet.degree?.toFixed(2)}° {planet.retrograde && '(R)'}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Verificación específica para Sol, Luna y Ascendente */}
              <div className="mt-6 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
                <h4 className="font-semibold text-yellow-400 mb-2">🔍 Verificación de Posiciones Esperadas:</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>☀️ Sol esperado: 21°08'22" Acuario Casa 1</p>
                  <p>🌙 Luna esperada: 06°03'31" Libra Casa 8</p>
                  <p>⬆️ Ascendente esperado: 04°09'26" Acuario</p>
                </div>
              </div>
            </Card>
          )}

          {/* Datos crudos */}
          <details className="bg-black/20 rounded-lg p-4">
            <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
              Ver datos completos (JSON)
            </summary>
            <pre className="mt-4 text-xs text-gray-300 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Información adicional */}
      <Card gradient="green" className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-white">📚 Información sobre Tipos de Hora</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong className="text-white">HL (Hora Local):</strong> La hora del reloj en el lugar de nacimiento. 
            Para Madrid en febrero 1974 = UTC+1 (horario de invierno).
          </div>
          <div>
            <strong className="text-white">UT (Universal Time):</strong> Hora UTC/GMT. 
            Para convertir de Madrid a UT en invierno: restar 1 hora (07:30 HL → 06:30 UT).
          </div>
          <div>
            <strong className="text-white">LMT (Local Mean Time):</strong> Hora solar media basada en la longitud. 
            Madrid está a -3.7° = aproximadamente -15 minutos respecto al meridiano de Greenwich.
          </div>
        </div>
      </Card>
    </div>
  );
}