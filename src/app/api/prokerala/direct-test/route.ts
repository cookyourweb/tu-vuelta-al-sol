// src/app/api/prokerala/direct-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * Esta ruta permite realizar una llamada directa a la API de Prokerala 
 * usando exactamente el mismo formato que has probado en Postman
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener los datos de la solicitud
    const body = await request.json();
    
    // Extraer token directamente del cuerpo de la solicitud
    const { token, endpoint } = body;
    
    if (!token || !endpoint) {
      return NextResponse.json(
        { error: 'Se requiere token y endpoint' },
        { status: 400 }
      );
    }
    
    // Eliminar token y endpoint de los datos a enviar a la API
    const { token: _, endpoint: __, ...apiData } = body;
    
    // Realizar la solicitud a la API de Prokerala usando los datos exactos
    const API_BASE_URL = 'https://api.prokerala.com/v2';
    const apiUrl = `${API_BASE_URL}${endpoint}`;
    
    // Imprimir detalles de la solicitud para depuración
    console.log('URL de API:', apiUrl);
    console.log('Datos de solicitud:', JSON.stringify(apiData));
    
    // Intentar llamada con método GET
    try {
      // Construir URL con parámetros
      const url = new URL(apiUrl);
      
      // Si apiData tiene profile, manejar de manera especial
      if (apiData.profile) {
        if (apiData.profile.datetime) {
          url.searchParams.append('profile[datetime]', apiData.profile.datetime);
        }
        if (apiData.profile.coordinates) {
          url.searchParams.append('profile[coordinates]', apiData.profile.coordinates);
        }
        delete apiData.profile;
      }
      
      // Añadir resto de parámetros
      Object.entries(apiData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
      
      console.log('URL completa con parámetros:', url.toString());
      
      // Hacer solicitud GET
      const response = await axios.get(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      return NextResponse.json({
        method: 'GET',
        status: response.status,
        data: response.data
      });
    } catch (getError) {
      console.error('Error con método GET:', getError);
      
      // Si GET falla, intentar con POST
      try {
        const response = await axios.post(apiUrl, apiData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        return NextResponse.json({
          method: 'POST',
          status: response.status,
          data: response.data
        });
      } catch (postError) {
        // Si ambos métodos fallan, devolver el error completo
        console.error('Error con método POST:', postError);
        return NextResponse.json({
          error: 'Error en ambos métodos',
          getError: getError instanceof Error ? getError.message : 'Error desconocido',
          postError: postError instanceof Error ? postError.message : 'Error desconocido',
          postErrorDetails: axios.isAxiosError(postError) ? {
            status: postError.response?.status,
            data: postError.response?.data
          } : {}
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}