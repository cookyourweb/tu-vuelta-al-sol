'use client';

import React, { useState } from 'react';

function calculateAge(birthDateString: string): number {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const GenerateAgendaAITest: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulated userDataCheck object
  const userDataCheck = {
    birthData: {
      name: 'Veronica',
      date: '1990-05-15',
      location: 'Buenos Aires, Argentina'
    }
  };

  const handleGenerateAgenda = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const agendaResponse = await fetch('/api/astrology/generate-agenda-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            name: userDataCheck.birthData.name,
            currentAge: calculateAge(userDataCheck.birthData.date),
            birthDate: userDataCheck.birthData.date,
            place: userDataCheck.birthData.location
          }
        })
      });

      if (!agendaResponse.ok) {
        throw new Error(`HTTP error! status: ${agendaResponse.status}`);
      }

      const data = await agendaResponse.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test: Generate Agenda AI</h2>
      <button
        onClick={handleGenerateAgenda}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? 'Generando...' : 'Generar Agenda AI'}
      </button>

      {error && (
        <div className="bg-red-700 p-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <pre className="bg-gray-800 p-3 rounded max-h-96 overflow-auto text-xs">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default GenerateAgendaAITest;
