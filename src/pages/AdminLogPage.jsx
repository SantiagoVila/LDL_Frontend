import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BotonVolver from '../components/ui/BotonVolver';

function AdminLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3000/api/logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(response.data);
            } catch (err) {
                setError('No se pudo cargar el historial de acciones.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [token]);

    const getLevelClass = (level) => {
        switch (level) {
            case 'error': return 'bg-red-500/10 text-red-400';
            case 'warn': return 'bg-yellow-500/10 text-yellow-400';
            case 'info': return 'bg-cyan-500/10 text-cyan-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando historial...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Historial de Acciones</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Registro de eventos importantes ocurridos en la plataforma.
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
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Fecha y Hora</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Nivel</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Mensaje</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {logs.length > 0 ? logs.map((log, index) => (
                                        <tr key={index} className="hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-400 sm:pl-6">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelClass(log.level)}`}>
                                                    {log.level}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-300">{log.message}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-sm text-gray-500">
                                                No hay registros en el historial.
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

export default AdminLogPage;
