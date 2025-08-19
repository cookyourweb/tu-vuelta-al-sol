"use client";

import React, { useEffect, useState } from 'react';
import DeleteUserForm from '@/components/admin/DeleteUserForm';
import BirthDataAdminTable from '@/components/admin/BirthDataAdminTable';

interface User {
  uid: string;
  email: string;
  fullName: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          throw new Error('Error al obtener usuarios');
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        setError('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div>
          <h2>Usuarios existentes</h2>
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
      )}
      <DeleteUserForm />

      {/* Sección administración de birth data */}
      <div style={{ marginTop: 40 }}>
        <BirthDataAdminTable />
      </div>
    </div>
  );
}