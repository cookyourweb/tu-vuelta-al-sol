// src/components/test/OpenAITest.tsx
'use client';

import { useState } from 'react';

export default function OpenAITest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testOpenAIConnection = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing OpenAI connection...');
      
      const response = await fetch('/api/astrology/generate-agenda-ai', {
        method: 'GET'
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('📡 Raw response text:', text);
      
      try {
        const data = JSON.parse(text);
        setTestResult({
          success: true,
          status: response.status,
          data: data,
          rawText: text
        });
      } catch (parseError) {
        setTestResult({
          success: false,
          status: response.status,
          error: 'JSON Parse Error',
          rawText: text,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        });
      }
      
    } catch (error) {
      console.error('❌ OpenAI test error:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testWithUserProfile = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing with user profile...');
      
      const mockUserProfile = {
        userId: "ob4p8gCQuJUf712pleFl074LqJZ2",
        name: "Vero2708",
        birthDate: "1990-01-15",
        currentAge: 35,
        nextAge: 36,
        latitude: 40.4164,
        longitude: -3.7025,
        timezone: "Europe/Madrid",
        place: "Madrid, España"
      };
      
      const response = await fetch('/api/astrology/generate-agenda-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: "ob4p8gCQuJUf712pleFl074LqJZ2",
          userProfile: mockUserProfile
        })
      });
      
      console.log('📡 POST Response status:', response.status);
      const text = await response.text();
      console.log('📡 POST Raw response:', text);
      
      try {
        const data = JSON.parse(text);
        setTestResult({
          success: true,
          method: 'POST',
          status: response.status,
          data: data,
          rawText: text
        });
      } catch (parseError) {
        setTestResult({
          success: false,
          method: 'POST',
          status: response.status,
          error: 'JSON Parse Error',
          rawText: text,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown'
        });
      }
      
    } catch (error) {
      console.error('❌ POST test error:', error);
      setTestResult({
        success: false,
        method: 'POST',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">🤖 OpenAI API Direct Test</h3>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={testOpenAIConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold"
        >
          {loading ? 'Testing...' : 'Test GET Endpoint'}
        </button>
        
        <button
          onClick={testWithUserProfile}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold"
        >
          {loading ? 'Testing...' : 'Test POST with Profile'}
        </button>
      </div>

      {testResult && (
        <div className="space-y-4">
          <div className={`p-4 rounded border ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h4 className={`font-semibold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.success ? '✅ Success' : '❌ Error'}
            </h4>
            <p className="text-sm">Status: {testResult.status}</p>
            {testResult.method && <p className="text-sm">Method: {testResult.method}</p>}
            {testResult.error && <p className="text-red-700">Error: {testResult.error}</p>}
            {testResult.parseError && <p className="text-red-700">Parse Error: {testResult.parseError}</p>}
          </div>

          {testResult.data && (
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-2">📄 Parsed Data:</h4>
              <pre className="text-sm overflow-auto max-h-64 bg-white p-2 border rounded">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}

          {testResult.rawText && (
            <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-2">📝 Raw Response:</h4>
              <pre className="text-sm overflow-auto max-h-64 bg-white p-2 border rounded">
                {testResult.rawText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}