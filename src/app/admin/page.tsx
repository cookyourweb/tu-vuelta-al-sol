"use client";

import React, { useEffect, useState } from 'react';
import DeleteUserForm from '@/components/admin/DeleteUserForm';

interface User {
  uid: string;
  email: string;
  fullName: string;
}

interface BirthData {
  _id: string;
  userId: string;
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [birthData, setBirthData] = useState<BirthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users
        const usersRes = await fetch('/api/admin/users');
        if (!usersRes.ok) throw new Error('Error al obtener usuarios');
        const usersData = await usersRes.json();
        setUsers(usersData.users);

        // Fetch birth data
        const birthDataRes = await fetch('/api/admin/birth-data');
        if (!birthDataRes.ok) throw new Error('Error al obtener datos de nacimiento');
        const birthDataData = await birthDataRes.json();
        setBirthData(birthDataData.data);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      {loading && <p>Cargando datos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && (
        <>
          {/* Usuarios Section */}
          <div style={{ marginBottom: 30 }}>
            <h2>Usuarios existentes ({users.length})</h2>
            <table border={1} cellPadding={5} cellSpacing={0} style={{ marginBottom: 20, width: '100%' }}>
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Email</th>
                  <th>Nombre Completo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.uid}</td>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Birth Data Section */}
          <div>
            <h2>Registros de BirthData ({birthData.length})</h2>
            <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Nombre</th>
                  <th>Fecha Nacimiento</th>
                  <th>Hora</th>
                  <th>Lugar</th>
                  <th>Latitud</th>
                  <th>Longitud</th>
                  <th>Zona Horaria</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {birthData.map((data) => (
                  <tr key={data._id}>
                    <td>{data.userId}</td>
                    <td>{data.fullName}</td>
                    <td>{formatDate(data.birthDate)}</td>
                    <td>{data.birthTime || 'N/A'}</td>
                    <td>{data.birthPlace}</td>
                    <td>{data.latitude.toFixed(4)}</td>
                    <td>{data.longitude.toFixed(4)}</td>
                    <td>{data.timezone}</td>
                    <td>{formatDate(data.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      <DeleteUserForm />
    </div>
  );
}
