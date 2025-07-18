import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BotonVolver from '../components/ui/BotonVolver'; // Importamos el botón

// --- Componente de Estadísticas de Equipo Reutilizable ---
const EquipoStats = ({ nombreEquipo, equipoId, stats }) => {
    const goleadores = stats.filter(s => s.goles > 0);
    const asistidores = stats.filter(s => s.asistencias > 0);

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
            <h4 className="text-xl font-semibold text-cyan-400 mb-4 border-b border-gray-600 pb-2">
                <Link to={`/equipos/${equipoId}`} className="hover:text-cyan-300">{nombreEquipo}</Link>
            </h4>
            <div className="space-y-4">
                {goleadores.length > 0 && (
                    <div>
                        <strong className="text-gray-400">Goles:</strong>
                        <ul className="mt-1 list-disc list-inside space-y-1 text-gray-300">
                            {goleadores.map(stat => (
                                <li key={stat.jugador_id}>
                                    <Link to={`/jugadores/${stat.jugador_id}`} className="text-white hover:underline">{stat.nombre_in_game}</Link> ({stat.goles})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {asistidores.length > 0 && (
                    <div>
                        <strong className="text-gray-400">Asistencias:</strong>
                        <ul className="mt-1 list-disc list-inside space-y-1 text-gray-300">
                            {asistidores.map(stat => (
                                <li key={stat.jugador_id}>
                                    <Link to={`/jugadores/${stat.jugador_id}`} className="text-white hover:underline">{stat.nombre_in_game}</Link> ({stat.asistencias})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {goleadores.length === 0 && asistidores.length === 0 && (
                    <p className="text-sm text-gray-500">Sin estadísticas individuales registradas.</p>
                )}
            </div>
        </div>
    );
};


function PartidoDetailPage() {
    const [partido, setPartido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchPartido = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/partidos/publico/${id}`);
                setPartido(response.data);
            } catch (err) {
                setError('No se pudo encontrar el partido solicitado.');
            } finally {
                setLoading(false);
            }
        };
        fetchPartido();
    }, [id]);

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando detalles del partido...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!partido) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BotonVolver />
            {/* Encabezado del Partido */}
            <div className="text-center mb-8">
                <p className="text-cyan-400 font-semibold">
                    <Link to={`/ligas/${partido.liga_id}`}>{partido.nombre_liga}</Link>
                </p>
                <div className="mt-4 flex justify-center items-center text-4xl font-bold text-white">
                    <Link to={`/equipos/${partido.equipo_local_id}`} className="w-1/3 text-right hover:text-cyan-400 transition-colors">{partido.nombre_local}</Link>
                    <div className="w-1/3 flex justify-center items-center">
                        <span className="mx-4 bg-gray-900 border border-gray-700 text-white px-6 py-2 rounded-lg">{partido.goles_local} - {partido.goles_visitante}</span>
                    </div>
                    <Link to={`/equipos/${partido.equipo_visitante_id}`} className="w-1/3 text-left hover:text-cyan-400 transition-colors">{partido.nombre_visitante}</Link>
                </div>
                <p className="mt-4 text-gray-400">{new Date(partido.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <EquipoStats nombreEquipo={partido.nombre_local} equipoId={partido.equipo_local_id} stats={partido.estadisticas_local} />
                <EquipoStats nombreEquipo={partido.nombre_visitante} equipoId={partido.equipo_visitante_id} stats={partido.estadisticas_visitante} />
            </div>
        </div>
    );
}

export default PartidoDetailPage;
