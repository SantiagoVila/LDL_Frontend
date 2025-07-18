import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BotonVolver from '../components/ui/BotonVolver';

function AdminLigaDetailPage() {
    const [liga, setLiga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { id: ligaId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchLigaDetalle = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/ligas/${ligaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLiga(response.data);
        } catch (err) {
            setError('No se pudo cargar la información de la liga.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLigaDetalle();
    }, [ligaId, token]);

    const handleGenerarFixture = async () => {
        if (!window.confirm("¿Estás seguro de que quieres generar el fixture? Esta acción es permanente.")) return;
        try {
            const datosFixture = {
                dias_de_juego: ['tuesday', 'wednesday', 'friday'],
                fecha_arranque: '2025-09-01'
            };
            const response = await axios.post(
                `http://localhost:3000/api/admin/ligas/${ligaId}/generar-fixture`,
                datosFixture,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message);
            fetchLigaDetalle();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ocurrió un error al generar el fixture.');
        }
    };

    const handleFinalizarTemporada = async () => {
        if (!window.confirm("¿Estás seguro de que quieres finalizar esta temporada? Esta acción es irreversible.")) return;
        try {
            const response = await axios.put(`http://localhost:3000/api/admin/ligas/${ligaId}/finalizar-temporada`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(response.data.message);
            fetchLigaDetalle();
        } catch (err) {
            toast.error(err.response?.data?.error || "Error al finalizar la temporada.");
        }
    };

    const handleNuevaTemporada = async () => {
        if (!window.confirm("¿Estás seguro de que quieres crear una nueva temporada para esta liga?")) return;
        try {
            const response = await axios.post(
                `http://localhost:3000/api/admin/ligas/${ligaId}/nueva-temporada`, 
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message);
            navigate(`/admin/ligas/${response.data.nuevaLigaId}`);
        } catch (err) {
            toast.error(err.response?.data?.error || "Error al crear la nueva temporada.");
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!liga) return <p className="text-center p-8">No se encontró la liga.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BotonVolver />
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-800 text-white">
                    <h2 className="text-3xl font-bold" style={{fontFamily: 'var(--font-heading)'}}>{liga.nombre}</h2>
                    <p className="mt-1 text-sm text-gray-300">Temporada: {liga.temporada || 'N/A'} | Categoría: {liga.categoria}</p>
                </div>
                <div className="border-t border-gray-700">
                    <dl>
                        <div className="bg-gray-900/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-400">Estado de la Temporada</dt>
                            <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${liga.estado_temporada === 'activa' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                    {liga.estado_temporada}
                                </span>
                            </dd>
                        </div>
                        <div className="bg-gray-800/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-400">Fixture Generado</dt>
                            <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{liga.fixture_generado ? 'Sí' : 'No'}</dd>
                        </div>
                        <div className="bg-gray-900/50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-400">Acciones</dt>
                            <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2 space-x-2">
                                {!liga.fixture_generado && liga.equipos && liga.equipos.length > 1 && (
                                    <button onClick={handleGenerarFixture} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                        Generar Fixture
                                    </button>
                                )}
                                {liga.estado_temporada === 'activa' && liga.fixture_generado && (
                                    <button onClick={handleFinalizarTemporada} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                                        Finalizar Temporada
                                    </button>
                                )}
                                {liga.estado_temporada === 'archivada' && (
                                    <button onClick={handleNuevaTemporada} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                        Iniciar Nueva Temporada
                                    </button>
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Equipos en esta Liga ({liga.equipos.length})</h3>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg overflow-hidden">
                    <ul role="list" className="divide-y divide-gray-700">
                        {liga.equipos && liga.equipos.length > 0 ? (
                            liga.equipos.map(equipo => (
                                <li key={equipo.id}>
                                    <Link to={`/admin/equipos/${equipo.id}`} className="block hover:bg-gray-800">
                                        <div className="px-4 py-4 sm:px-6">
                                            <p className="font-medium text-indigo-400 truncate">{equipo.nombre}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : (
                             <li className="px-4 py-4 text-center text-sm text-gray-500">Aún no hay equipos inscritos en esta liga.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminLigaDetailPage;
