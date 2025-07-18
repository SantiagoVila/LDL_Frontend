import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function AdminAprobacionesEquiposPage() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [ligas, setLigas] = useState([]);
    const [ligaSeleccionada, setLigaSeleccionada] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fetchSolicitudes = async (page) => {
        if (!token) return;
        setLoading(true);
        try {
            const solicitudesRes = await axios.get(`http://localhost:3000/api/equipos?estado=pendiente&page=${page}&limit=10`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setSolicitudes(solicitudesRes.data.equipos || []); 
            setCurrentPage(solicitudesRes.data.page || 1);
            setTotalPages(Math.ceil(solicitudesRes.data.total / (solicitudesRes.data.limit || 10)) || 1);

            if (ligas.length === 0) {
                const ligasRes = await axios.get('http://localhost:3000/api/ligas', { headers: { Authorization: `Bearer ${token}` } });
                setLigas(ligasRes.data.ligas || ligasRes.data);
            }
        } catch (err) {
            setError('No se pudieron cargar las solicitudes de equipos.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSolicitudes(1);
    }, [token]);

    const handleResponder = async (equipoId, respuesta) => {
        const ligaIdSeleccionada = ligaSeleccionada[equipoId] || null;
        if (respuesta === 'aprobado' && !ligaIdSeleccionada) {
            toast.warn('Por favor, selecciona una liga antes de aprobar el equipo.');
            return;
        }
        if (!window.confirm(`¿Estás seguro de que quieres ${respuesta} la creación de este equipo?`)) return;

        try {
            await axios.put(`http://localhost:3000/api/equipos/admin/solicitudes/${equipoId}/responder`, 
                { respuesta, liga_id: ligaIdSeleccionada },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success(`Solicitud ${respuesta} con éxito.`);
            fetchSolicitudes(currentPage); 
        } catch (err) {
            toast.error(err.response?.data?.error || `Error al ${respuesta} la solicitud.`);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) fetchSolicitudes(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) fetchSolicitudes(currentPage - 1);
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando solicitudes...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Aprobación de Equipos</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Revisa y gestiona las solicitudes de creación de nuevos equipos.
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
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Equipo Solicitado</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">DT Solicitante</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Asignar a Liga</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {solicitudes.length > 0 ? solicitudes.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{s.nombre}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{s.nombre_dt || 'N/A'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                                <select onChange={(e) => setLigaSeleccionada(prev => ({ ...prev, [s.id]: e.target.value }))} value={ligaSeleccionada[s.id] || ''} className="w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                                                    <option value="">-- Seleccionar Liga --</option>
                                                    {ligas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
                                                </select>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                                <button onClick={() => handleResponder(s.id, 'aprobado')} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md shadow-sm">
                                                    Aprobar
                                                </button>
                                                <button onClick={() => handleResponder(s.id, 'rechazado')} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md shadow-sm">
                                                    Rechazar
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-sm text-gray-500">
                                                No hay solicitudes de equipo pendientes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {solicitudes.length > 0 && (
                 <div className="mt-6 flex items-center justify-between">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50">
                        Anterior
                    </button>
                    <div className="text-sm text-gray-400">
                        Página <span className="font-medium text-white">{currentPage}</span> de <span className="font-medium text-white">{totalPages}</span>
                    </div>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50">
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminAprobacionesEquiposPage;
