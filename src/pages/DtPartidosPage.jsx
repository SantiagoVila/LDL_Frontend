import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function DtPartidosPage() {
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchPartidos = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3000/api/partidos/dt/mis-partidos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPartidos(response.data);
            } catch (err) {
                setError('No se pudieron cargar tus partidos pendientes.');
            } finally {
                setLoading(false);
            }
        };
        fetchPartidos();
    }, [token]);

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando partidos...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Reportar Resultados</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Selecciona un partido para reportar el resultado y las estadísticas.
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
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Fecha</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Enfrentamiento</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {partidos.length > 0 ? partidos.map(partido => (
                                        <tr key={partido.id} className="hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-400 sm:pl-6">{new Date(partido.fecha).toLocaleDateString()}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-white">
                                                {partido.nombre_local} vs {partido.nombre_visitante}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link to={`/dt/partidos/${partido.id}/reportar`} className="text-cyan-400 hover:text-cyan-300">
                                                    Reportar Resultado
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-sm text-gray-500">
                                                No tienes partidos pendientes por reportar.
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

export default DtPartidosPage;
