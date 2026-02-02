// src/app/api/prokerala/natal-horoscope/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PROKERALA_API_BASE_URL = 'https://api.prokerala.com/v2';
const TOKEN_ENDPOINT = PROKERALA_API_BASE_URL + '/token';
const NATAL_CHART_ENDPOINT = PROKERALA_API_BASE_URL + '/astrology/natal-chart';

const CLIENT_ID = process.env.DEFPROKERALA_CLIENT_ID;
const CLIENT_SECRET = process.env.DEFPROKERALA_CLIENT_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json({ error: 'Prokerala API credentials are not set' }, { status: 500 });
    }

    const body = await request.json();
    const {
      birthDate,
      birthTime,
      latitude,
      longitude,
      timezone,
      house_system = 'placidus',
      orb = 'default',
      birth_time_rectification = 'flat-chart',
      aspect_filter = 'major',
      language = 'es'
    } = body;

    // Get access token
    const tokenResponse = await axios.post(TOKEN_ENDPOINT, new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    // Prepare request body as per Prokerala API docs
    const profile = {
      date: birthDate,
      time: birthTime || '00:00:00',
      latitude,
      longitude,
      timezone
    };

    const natalChartRequestBody = {
      profile,
      house_system,
      orb,
      birth_time_rectification,
      aspect_filter,
      language
    };

    // Call Prokerala Natal Chart API
    const response = await axios.post(NATAL_CHART_ENDPOINT, natalChartRequestBody, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error obteniendo carta natal:', error);
    return NextResponse.json({ error: 'No se pudo obtener la carta natal' }, { status: 500 });
  }
}
