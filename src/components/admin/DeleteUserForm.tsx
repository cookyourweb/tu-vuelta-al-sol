"use client";

import React, { useState } from 'react';

const DeleteUserForm: React.FC = () => {
  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!uid && !email) {
      setError('Por favor ingrese uid o email');
      setLoading(false);
      return;
    }

    try {
      // Eliminar usuario principal
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: uid || undefined, email: email || undefined })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al eliminar usuario');
        setLoading(false);
        return;
      }

      // Eliminar birth data en MongoDB
      let birthDataResponse = null;
      let birthDataSuccess = true;
      let birthDataErrorMsg = "";

      // Solo procede con el DELETE si existe UID (que es la clave en birth data)
      if (uid) {
        try {
          const bdRes = await fetch(`/api/birth-data?userId=${uid}`, { method: 'DELETE' });
          birthDataResponse = await bdRes.json();
          if (!bdRes.ok || !birthDataResponse.success) {
            birthDataSuccess = false;
            birthDataErrorMsg = birthDataResponse.error || 'No se pudo eliminar birth data';
          }
        } catch (err) {
          birthDataSuccess = false;
          birthDataErrorMsg = 'Error al eliminar birth data';
        }
      }

      if (birthDataSuccess) {
        setMessage(data.message || 'Usuario y birth data eliminados correctamente');
      } else {
        setMessage((data.message || 'Usuario eliminado') + ' | ⚠️ Birth data no eliminado: ' + birthDataErrorMsg);
      }
      setUid('');
      setEmail('');
    } catch (err) {
      setError('Error de red o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Eliminar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="uid">UID:</label>
          <input
            type="text"
            id="uid"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Ingrese UID"
            style={{ width: '100%', marginBottom: 10 }}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese Email"
            style={{ width: '100%', marginBottom: 10 }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }} disabled={loading}>
          {loading ? "Eliminando..." : "Eliminar Usuario"}
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
};

export default DeleteUserForm;