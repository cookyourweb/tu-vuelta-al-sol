// src/app/api/astrology/agenda-final/route.ts - VERSIÓN LIMPIA Y PROFESIONAL
import { NextRequest, NextResponse } from 'next/server';
import { getNatalHoroscope, getAstronomicalEvents } from '@/services/astrologyService';
import { getProgressedChart } from '@/services/progressedChartService';
import { 
  DataTransformService, 
  AgendaUtilsService, 
  ContentGeneratorService 
} from '@/services/agendaService';
import {
  BirthDataRequest,
  AgendaResponse,
  AgendaData,
  ChartResult
} from '../../../../../types/astrology'

/**
 * ✅ ENDPOINT PROFESIONAL DE AGENDA ASTROLÓGICA
 * Arquitectura limpia con separación de responsabilidades
 */

export async function POST(request: NextRequest): Promise<NextResponse<AgendaResponse | { success: false; error: string; details?: string[] }>> {
  try {
    const body = await request.json() as BirthDataRequest;
    
    // Validación de datos de entrada
    const validation = AgendaUtilsService.validateBirthData(body);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: validation.errors
      }, { status: 400 });
    }

    const {
      birthDate,
      birthTime = '12:00:00',
      latitude,
      longitude,
      timezone = 'Europe/Madrid',
      startDate,
      endDate,
      fullName = 'Alma Especial'
    } = body;

    const currentYear = new Date(startDate || new Date()).getFullYear();

    console.log('📅 Generando agenda profesional:', { 
      birthDate, 
      birthTime, 
      latitude, 
      longitude,
      currentYear 
    });

    // Obtener carta natal
    const natalChart = await obtenerCartaNatal(birthDate, birthTime, latitude, longitude, timezone);
    
    // Obtener carta progresada
    const progressedChart = await obtenerCartaProgresada(birthDate, birthTime, latitude, longitude, timezone, currentYear);

    // Construir agenda completa
    const agenda: AgendaData = {
      portada: {
        titulo: `Tu Vuelta al Sol ${currentYear}`,
        subtitulo: 'Agenda Astrológica Personalizada',
        nombre: fullName,
        periodo: {
          inicio: AgendaUtilsService.formatSpanishDate(startDate || `${currentYear}-01-01`),
          fin: AgendaUtilsService.formatSpanishDate(endDate || `${currentYear}-12-31`)
        },
        datosNacimiento: {
          fecha: AgendaUtilsService.formatSpanishDate(birthDate),
          hora: birthTime,
          coordenadas: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
          timezone,
          lugar: AgendaUtilsService.determineLocation(latitude, longitude)
        }
      },
      cartas: {
        natal: natalChart,
        progresada: progressedChart
      },
      eventos: {
        fasesLunares: ContentGeneratorService.generateSampleLunarPhases(),
        retrogradaciones: null,
        estado: 'simulados',
        errores: []
      },
      analisis: ContentGeneratorService.generatePersonalizedAnalysis(
        natalChart.estado === 'obtenida exitosamente',
        progressedChart.estado === 'obtenida exitosamente'
      ),
      rituales: ContentGeneratorService.generateRituals(currentYear),
      metadata: {
        generadaEn: new Date().toISOString(),
        configuracion: {
          ayanamsa: 'tropical (0)',
          sistemaCasas: 'placidus',
          precisionCoordenadas: 4,
          timezone,
          version: 'v3.0-profesional-limpia'
        },
        datosCorregidos: {
          fechaOriginal: body.birthDate,
          fechaCorregida: birthDate,
          horaOriginal: body.birthTime || 'no especificada',
          horaCorregida: birthTime,
          timezoneAplicado: timezone
        }
      }
    };

    return NextResponse.json({
      success: true,
      agenda,
      resumen: {
        cartaNatal: natalChart.estado === 'obtenida exitosamente' ? '✅ Exitosa' : '❌ Error',
        cartaProgresada: progressedChart.estado === 'obtenida exitosamente' ? '✅ Exitosa' : '⚠️ No disponible',
        eventosAstrologicos: '⚠️ Simulados',
        estado: 'AGENDA GENERADA PROFESIONALMENTE'
      }
    });

  } catch (error) {
    console.error('❌ Error generando agenda:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

/**
 * Obtiene la carta natal usando el servicio existente
 */
async function obtenerCartaNatal(
  birthDate: string, 
  birthTime: string, 
  latitude: number, 
  longitude: number, 
  timezone: string
): Promise<ChartResult> {
  try {
    const natalData = await getNatalHoroscope(birthDate, birthTime, latitude, longitude, timezone);
    
    return {
      estado: 'obtenida exitosamente',
      planetas: DataTransformService.transformPlanets(natalData?.planets || []),
      casas: DataTransformService.transformHouses(natalData?.houses || []),
      aspectos: DataTransformService.transformAspects(natalData?.aspects || [])
    };
  } catch (error) {
    console.warn('⚠️ Error obteniendo carta natal:', error);
    return {
      estado: 'no disponible',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Obtiene la carta progresada usando el servicio existente
 */
async function obtenerCartaProgresada(
  birthDate: string, 
  birthTime: string, 
  latitude: number, 
  longitude: number, 
  timezone: string, 
  year: number
): Promise<ChartResult> {
  try {
    const progressedData = await getProgressedChart(birthDate, birthTime, latitude, longitude, timezone, year);
    
    return {
      estado: 'obtenida exitosamente',
      año: year,
      planetas: DataTransformService.transformPlanets(progressedData?.planets || []),
      evolutivo: true
    };
  } catch (error) {
    console.warn('⚠️ Error obteniendo carta progresada:', error);
    return {
      estado: 'no disponible',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Información del endpoint
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/astrology/agenda-final',
    version: 'v3.0-profesional-limpia',
    descripcion: 'Endpoint profesional con arquitectura limpia y tipos separados',
    estado: 'OPERATIVO',
    arquitectura: {
      tipos: '/types/agenda.ts',
      servicios: '/services/agendaService.ts',
      endpoints: '/app/api/astrology/agenda-final/route.ts'
    },
    servicios: [
      'DataTransformService - Transformación de datos tipada',
      'AgendaUtilsService - Utilidades generales',
      'ContentGeneratorService - Generación de contenido'
    ],
    ejemplo: {
      birthDate: '1974-02-10',
      birthTime: '07:30:00',
      latitude: 40.4164,
      longitude: -3.7025,
      timezone: 'Europe/Madrid',
      fullName: 'Verónica'
    }
  });
}