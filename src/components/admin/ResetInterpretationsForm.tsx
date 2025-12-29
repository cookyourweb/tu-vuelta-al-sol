"use client";

import React, { useState } from 'react';

export default function ResetInterpretationsForm() {
  const [userId, setUserId] = useState('');
  const [chartType, setChartType] = useState<'natal' | 'solar-return' | 'all'>('natal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!userId.trim()) {
      setError('Por favor ingresa un User ID');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/admin/reset-interpretations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartType,
          userId: userId.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message);
        // Clear form after success
        setTimeout(() => {
          setUserId('');
          setMessage('');
        }, 5000);
      } else {
        setError(data.error || 'Error al limpiar interpretaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAll = async () => {
    if (!confirm(`⚠️ ¿Estás seguro de que quieres eliminar TODAS las interpretaciones de tipo "${chartType}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/admin/reset-interpretations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chartType,
          // No enviar userId para limpiar todas
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Error al limpiar interpretaciones');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '30px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>🔄 Limpiar Interpretaciones</h2>

      <div style={{ marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px', color: '#666', fontSize: '16px' }}>ℹ️ ¿Cuándo usar esto?</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
          <li>Interpretaciones con <strong>tono antiguo</strong> (épico/místico)</li>
          <li>Cambios en los <strong>cálculos de casas</strong></li>
          <li>Actualización de <strong>prompts</strong> de interpretación</li>
          <li>Tooltips muestran casa <strong>diferente</strong> al drawer</li>
        </ul>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Tipo de Interpretación
        </label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as any)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        >
          <option value="natal">Carta Natal</option>
          <option value="solar-return">Solar Return</option>
          <option value="all">Todas</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          User ID (opcional - deja vacío para limpiar todas)
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Ej: hQEi3mS2fHTr2lQR0r4ATz9M4Ut1"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <small style={{ color: '#666', fontSize: '12px' }}>
          💡 Encuentra el userId en la tabla de usuarios arriba
        </small>
      </div>

      {error && (
        <div style={{
          background: '#ffebee',
          border: '1px solid #ef5350',
          color: '#c62828',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '15px',
        }}>
          ❌ {error}
        </div>
      )}

      {message && (
        <div style={{
          background: '#e8f5e9',
          border: '1px solid #66bb6a',
          color: '#2e7d32',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '15px',
        }}>
          ✅ {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleReset}
          disabled={loading}
          style={{
            flex: 1,
            background: userId.trim()
              ? 'linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)'
              : 'linear-gradient(135deg, #ccc 0%, #aaa 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: (loading || !userId.trim()) ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            opacity: (loading || !userId.trim()) ? 0.6 : 1,
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? '⏳ Limpiando...' : '🗑️ Limpiar Interpretaciones de Usuario'}
        </button>

        <button
          onClick={handleResetAll}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? '⏳ Limpiando...' : '🗑️ Limpiar TODAS'}
        </button>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '15px',
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#856404',
      }}>
        <strong>⚠️ Nota:</strong> Después de limpiar, las interpretaciones se regenerarán automáticamente cuando el usuario acceda a su carta. Esto usará:
        <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
          <li><strong>Nuevo tono observador</strong> (sin "SUPERPODER", "misión cósmica")</li>
          <li><strong>Casas correctas</strong> según cálculos actuales</li>
          <li><strong>Prompts actualizados</strong> y validados</li>
        </ul>
      </div>
    </div>
  );
}
