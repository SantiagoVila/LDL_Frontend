import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BotonVolver from '../components/ui/BotonVolver';

function PublicEquipoPage() {
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { id } = useParams();

    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/equipos/publico/${id}/perfil`);
                setEquipo(response.data);
            } catch (err) {
                setError('No se pudo encontrar el equipo solicitado.');
            } finally {
                setLoading(false);
            }
        };
        fetchEquipo();
    }, [id]);

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando perfil del equipo...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!equipo) return <p className="text-center p-8">No hay información disponible para este equipo.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BotonVolver />
            {/* Encabezado del Equipo */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg overflow-hidden mb-8">
                <div className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <img 
                        src={equipo.escudo || 'https://placehold.co/150x150/1f2937/a0aec0?text=Escudo'} 
                        alt={`Escudo de ${equipo.nombre}`} 
                        className="h-32 w-32 rounded-lg object-cover bg-gray-700 p-1 border-2 border-gray-600"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>{equipo.nombre}</h1>
                        <p className="mt-1 text-lg text-gray-400">
                            DT: {equipo.dt_id ? (
                                <Link to={`/dts/${equipo.dt_id}`} className="text-cyan-400 hover:underline">
                                    {equipo.nombre_dt}
                                </Link>
                            ) : (
                                equipo.nombre_dt || 'Sin DT Asignado'
                            )}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Plantilla */}
                <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-600 pb-2" style={{fontFamily: 'var(--font-heading)'}}>Plantilla</h3>
                    <ul className="divide-y divide-gray-700">
                        {equipo.plantilla.map(jugador => (
                            <li key={jugador.id} className="py-3 flex items-center justify-between">
                                <Link to={`/jugadores/${jugador.id}`} className="text-gray-200 font-medium hover:text-cyan-400">
                                    <span className="font-bold text-gray-500 w-8 inline-block">{jugador.numero_remera || '-'}</span>
                                    {jugador.nombre_in_game}
                                    {/* ✅ LÓGICA AÑADIDA: Mostramos una etiqueta si es el DT */}
                                    {jugador.rol === 'dt' && <span className="ml-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">DT</span>}
                                </Link>
                                <span className="text-sm text-gray-400">{jugador.posicion}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Columna Derecha: Últimos Partidos */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-600 pb-2" style={{fontFamily: 'var(--font-heading)'}}>Últimos Partidos</h3>
                    <div className="space-y-4">
                        {equipo.ultimos_partidos.length > 0 ? (
                            equipo.ultimos_partidos.map(partido => (
                                <div key={partido.id} className="text-center">
                                    <Link to={`/partidos/${partido.id}`} className="text-sm text-gray-400 hover:text-white">
                                        <div className="flex justify-between items-center bg-gray-800 p-2 rounded-md">
                                            <span className="font-semibold">{partido.equipo_local}</span>
                                            <span className="font-bold text-lg">{partido.goles_local} - {partido.goles_visitante}</span>
                                            <span className="font-semibold">{partido.equipo_visitante}</span>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">Este equipo aún no ha jugado partidos aprobados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicEquipoPage;
