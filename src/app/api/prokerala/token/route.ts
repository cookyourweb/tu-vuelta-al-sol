// src/app/api/prokerala/token/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// Usamos las credenciales exactamente como están en el .env.local
const CLIENT_ID = process.env.PROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.PROKERALA_CLIENT_SECRET;

export async function GET() {
  // URLs para probar
  const tokenUrls = [
    'https://api.prokerala.com/token',
    'https://api.prokerala.com/v2/token'
  ];
  
  const results: Array<{
    url: string;
    success: boolean;
    status?: number;
    data?: unknown;
    error?: string | Record<string, unknown>;
  }> = [];
  
  // Probar con cada URL para ver cuál funciona
  for (const tokenUrl of tokenUrls) {
    try {
      console.log(`Intentando con URL: ${tokenUrl}`);
      console.log(`Client ID: ${CLIENT_ID}`);
      console.log(`Client Secret: ${CLIENT_SECRET?.substring(0, 4)}****`);
      
      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': CLIENT_ID || '',
          'client_secret': CLIENT_SECRET || '',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      // Si llegamos aquí, la solicitud fue exitosa
      results.push({
        url: tokenUrl,
        success: true,
        status: response.status,
        data: response.data
      });
      
      console.log(`Éxito con ${tokenUrl}:`, response.data);
    } catch (error) {
      // Capturar el error para seguir probando las demás URLs
      let errorDetails: string | Record<string, unknown> = 'Error desconocido';
      
      if (axios.isAxiosError(error)) {
        errorDetails = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        };
        
        console.error(`Error con ${tokenUrl}:`, errorDetails);
      } else if (error instanceof Error) {
        errorDetails = error.message;
      }
      
      results.push({
        url: tokenUrl,
        success: false,
        error: errorDetails
      });
    }
  }
  
  // También mostrar todas las variables de entorno disponibles (sin mostrar valores)
  const envVars: Record<string, string> = {};
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      const value = process.env[key];
      if (typeof value === 'string') {
        envVars[key] = `${value.substring(0, 4)}****`;
      } else {
        envVars[key] = '[UNDEFINED]';
      }
    } else {
      envVars[key] = '[PROTECTED]';
    }
  });
  
  // Devolver todos los resultados
  return NextResponse.json({
    results,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      envVarsAvailable: envVars
    }
  });
}