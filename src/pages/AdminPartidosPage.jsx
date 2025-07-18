import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function AdminPartidosPage() {
    const [partidos, setPartidos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchPartidosPendientes = async () => {
        setLoading(true);
        try {
            // Buscamos partidos que están pendientes y ya tienen un resultado reportado
            const response = await axios.get('http://localhost:3000/api/partidos?estado=pendiente', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filtramos en el frontend solo los que tienen imagen_resultado_url
            const partidosConResultado = response.data.filter(p => p.imagen_resultado_url);
            setPartidos(partidosConResultado);
        } catch (err) {
            setError('No se pudieron cargar los partidos pendientes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPartidosPendientes();
        }
    }, [token]);

    const handleConfirmarPartido = async (partidoId, nuevoEstado) => {
        if (!window.confirm(`¿Estás seguro de que quieres ${nuevoEstado} este resultado?`)) return;
        try {
            await axios.put(`http://localhost:3000/api/partidos/${partidoId}/confirmar`, 
                { estado: nuevoEstado },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(`Partido ${nuevoEstado} con éxito.`);
            setPartidos(partidos.filter(p => p.id !== partidoId));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al actualizar el estado del partido.');
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando partidos...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Aprobación de Partidos</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Revisa y aprueba los resultados reportados por los DTs.
                    </p>
                </div>
            </div>

            <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Enfrentamiento</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Resultado Reportado</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Prueba</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {partidos.length > 0 ? partidos.map(partido => (
                                        <tr key={partido.id} className="hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="font-medium text-white">{partido.nombre_local} vs {partido.nombre_visitante}</div>
                                                <div className="text-gray-400">{new Date(partido.fecha).toLocaleDateString()}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white font-bold">
                                                {partido.goles_local} - {partido.goles_visitante}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                                {partido.imagen_resultado_url ? (
                                                    <a href={`http://localhost:3000${partido.imagen_resultado_url}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                                                        Ver Imagen
                                                    </a>
                                                ) : 'Sin Prueba'}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                <button onClick={() => handleConfirmarPartido(partido.id, 'aprobado')} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md shadow-sm">
                                                    Aprobar
                                                </button>
                                                <button onClick={() => handleConfirmarPartido(partido.id, 'rechazado')} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md shadow-sm">
                                                    Rechazar
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-sm text-gray-500">
                                                No hay partidos pendientes de aprobación.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPartidosPage;
