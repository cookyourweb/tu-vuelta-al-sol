import { useEffect, useState } from 'react'; 
import { useAuth } from '@/context/AuthContext';

export default function BirthDataAdminTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/birth-data/all');
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error || 'Error al obtener datos');
    } catch (err) {
      setError('Fallo la consulta');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [refresh]);

  // Escuchar evento de datos guardados para actualizar automáticamente
  useEffect(() => {
    const handleBirthDataSaved = () => {
      console.log('📋 Evento birthDataSaved recibido, actualizando tabla...');
      fetchData();
    };

    window.addEventListener('birthDataSaved', handleBirthDataSaved);
    
    return () => {
      window.removeEventListener('birthDataSaved', handleBirthDataSaved);
    };
  }, []);
  
  const handleDelete = async (userId: string) => {
    if (!window.confirm(`¿Eliminar registro de ${userId}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/birth-data?userId=${userId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) setRefresh(r => r + 1);
      else setError(json.error || 'No se pudo eliminar');
    } catch (err) {
      setError('Error al eliminar');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Todos los registros BirthData</h2>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={fetchData} disabled={loading}>
        {loading ? 'Cargando...' : 'Refrescar'}
      </button>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border">
          <thead>
            <tr>
              <th className="border px-2">userId</th>
              <th className="border px-2">birthDate</th>
              <th className="border px-2">birthTime</th>
              <th className="border px-2">birthPlace</th>
              <th className="border px-2">latitude</th>
              <th className="border px-2">longitude</th>
              <th className="border px-2">timezone</th>
              <th className="border px-2">fullName</th>
              <th className="border px-2">livesInSamePlace</th>
              <th className="border px-2">currentPlace</th>
              <th className="border px-2">currentLat</th>
              <th className="border px-2">currentLng</th>
              <th className="border px-2">_id</th>
              <th className="border px-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any) => (
              <tr key={row._id}>
                <td className="border px-2">{row.userId}</td>
                <td className="border px-2">{row.birthDate ? String(row.birthDate).slice(0,10) : ''}</td>
                <td className="border px-2">{row.birthTime || ''}</td>
                <td className="border px-2">{row.birthPlace || ''}</td>
                <td className="border px-2">{row.latitude}</td>
                <td className="border px-2">{row.longitude}</td>
                <td className="border px-2">{row.timezone || ''}</td>
                <td className="border px-2">{row.fullName || ''}</td>
                <td className="border px-2">{row.livesInSamePlace ? 'Sí' : 'No'}</td>
                <td className="border px-2">{row.currentPlace || '-'}</td>
                <td className="border px-2">{row.currentLatitude || '-'}</td>
                <td className="border px-2">{row.currentLongitude || '-'}</td>
                <td className="border px-2">{row._id}</td>
                <td className="border px-2">
                  <button
                    className="bg-red-600 text-white rounded px-2 py-1"
                    onClick={() => handleDelete(row.userId)}
                    disabled={loading}
                  >Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
