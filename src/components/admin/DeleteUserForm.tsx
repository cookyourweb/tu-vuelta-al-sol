"use client";

import React, { useState } from 'react';

const DeleteUserForm: React.FC = () => {
  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!uid && !email) {
      setError('Por favor ingrese uid o email');
      return;
    }

    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: uid || undefined, email: email || undefined })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Usuario eliminado correctamente');
        setUid('');
        setEmail('');
      } else {
        setError(data.error || 'Error al eliminar usuario');
      }
    } catch (err) {
      setError('Error de red o servidor');
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
        <button type="submit" style={{ width: '100%' }}>
          Eliminar Usuario
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeleteUserForm;
