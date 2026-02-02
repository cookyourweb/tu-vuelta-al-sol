// src/app/api/astrology/test-postman/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Get token from Prokerala
    const CLIENT_ID = process.env.DEFPROKERALA_CLIENT_ID;
    const CLIENT_SECRET = process.env.DEFPROKERALA_CLIENT_SECRET;
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Missing Prokerala API credentials' },
        { status: 500 }
      );
    }
    
    // Get token
    const tokenResponse = await axios.post(
      'https://api.prokerala.com/token',
      new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const token = tokenResponse.data.access_token;
    
    // Exact URL that works in Postman
    const exactUrl = "https://api.prokerala.com/v2/astrology/natal-chart?profile[datetime]=1974-02-10T07:30:00%2B01:00&profile[coordinates]=40.4168,-3.7038&birth_time_unknown=false&house_system=placidus&orb=default&birth_time_rectification=flat-chart&aspect_filter=all&la=es&ayanamsa=0";
    
    // Make the exact same request as Postman
    const response = await axios.get(exactUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error with Postman test:', error);
    
    let errorDetails: any = 'Unknown error';
    
    if (axios.isAxiosError(error)) {
      errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        request: {
          method: error.config?.method,
          url: error.config?.url,
          headers: error.config?.headers
        }
      };
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error testing Prokerala API',
      details: errorDetails
    });
  }
}