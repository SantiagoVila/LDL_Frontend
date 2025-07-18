import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BotonVolver from '../components/ui/BotonVolver';

function AdminReportesPage() {
    const [reportes, setReportes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchReportes = async () => {
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:3000/api/admin/reportes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportes(response.data.reportes || []);
        } catch (err) {
            setError('No se pudieron cargar los reportes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportes();
    }, [token]);

    const handleMarcarAtendido = async (reporteId) => {
        if (!window.confirm("¿Estás seguro de que quieres marcar este reporte como atendido?")) return;
        try {
            await axios.put(`http://localhost:3000/api/admin/reportes/${reporteId}/atender`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Reporte marcado como atendido.');
            setReportes(reportes.map(r => 
                r.id === reporteId ? { ...r, estado: 'atendido' } : r
            ));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al actualizar el reporte.');
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando reportes...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Gestión de Reportes</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Revisa y atiende los reportes enviados por los usuarios.
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
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Usuario</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Tipo</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Descripción</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Estado</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {reportes.length > 0 ? reportes.map(reporte => (
                                        <tr key={reporte.id} className="hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{reporte.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{reporte.tipo}</td>
                                            <td className="px-3 py-4 text-sm text-gray-300 max-w-sm truncate" title={reporte.descripcion}>{reporte.descripcion}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reporte.estado === 'pendiente' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                                                    {reporte.estado}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {reporte.estado === 'pendiente' && (
                                                    <button onClick={() => handleMarcarAtendido(reporte.id)} className="text-cyan-400 hover:text-cyan-300">
                                                        Marcar como Atendido
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-sm text-gray-500">
                                                No hay reportes para mostrar.
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

export default AdminReportesPage;
