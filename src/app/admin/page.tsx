"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import DeleteUserForm from '@/components/admin/DeleteUserForm';
import BirthDataAdminTable from '@/components/admin/BirthDataAdminTable';

interface User {
  uid: string;
  email: string;
  fullName: string;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        // No redirigir, solo mostrar que no está autenticado
        setUserRole(null);
        setRoleLoading(false);
        return;
      }

      try {
        // Fetch user data from API to get the role
        console.log('Verificando rol para UID:', user.uid);
        const res = await fetch(`/api/users?uid=${user.uid}`);
        console.log('Respuesta de API users:', res.status, res.statusText);
        
        if (res.ok) {
          const userData = await res.json();
          console.log('Datos del usuario recibidos:', userData);
          
          if (userData.role === 'admin') {
            console.log('Usuario tiene rol admin, permitiendo acceso');
            setUserRole('admin');
          } else {
            console.log('Usuario no es admin, rol encontrado:', userData.role);
            setUserRole(userData.role); // No redirigir, solo establecer el rol
          }
        } else {
          console.log('Error en respuesta de API');
          setUserRole(null); // No redirigir
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        setUserRole(null); // No redirigir
      } finally {
        setRoleLoading(false);
      }
    }

    if (user) {
      checkAdminRole();
    } else {
      setRoleLoading(false);
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error('Error al obtener usuarios');
      }
      const data = await res.json();
      setUsers(data.users);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Only fetch users if user is admin
    if (userRole === 'admin') {
      fetchUsers();
    }
  }, [userRole]);

  // Show loading while checking role
  if (roleLoading) {
    return (
      <div style={{ padding: 20 }}>
        <p>Verificando permisos...</p>
        <p>Usuario autenticado: {user ? 'Sí' : 'No'}</p>
        {user && <p>UID del usuario: {user.uid}</p>}
      </div>
    );
  }

  // Don't render admin content if user is not admin
  if (userRole !== 'admin') {
    return (
      <div style={{ padding: 20, textAlign: 'center', marginTop: '50px' }}>
        <div style={{ 
          background: 'rgba(255, 0, 0, 0.1)', 
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: '10px',
          padding: '30px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '20px' }}>🚫 Acceso denegado</h2>
          <p style={{ marginBottom: '15px', fontSize: '16px' }}>
            No tienes permisos de administrador para acceder a esta página.
          </p>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.05)', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p><strong>Rol actual:</strong> {userRole || 'No definido'}</p>
            <p><strong>Usuario autenticado:</strong> {user ? 'Sí' : 'No'}</p>
            {user && <p><strong>UID:</strong> {user.uid}</p>}
          </div>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Contacta con el administrador del sistema si necesitas acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ← Volver al Dashboard
        </button>
      </div>
      
      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2>Usuarios existentes</h2>
            <button
              onClick={fetchUsers}
              disabled={refreshing}
              style={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: refreshing ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {refreshing ? 'Actualizando...' : '🔄 Actualizar'}
            </button>
          </div>
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