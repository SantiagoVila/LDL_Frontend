import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

// --- Componente de Tarjeta de Estadística Reutilizable ---
const StatCard = ({ label, value }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-5 text-center">
        <p className="text-3xl font-bold text-cyan-400" style={{fontFamily: 'var(--font-heading)'}}>{value}</p>
        <p className="text-sm font-medium text-gray-400">{label}</p>
    </div>
);

function JugadorDashboard() {
    const [perfil, setPerfil] = useState(null);
    const [calendario, setCalendario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { usuario, token } = useAuth();

    useEffect(() => {
        if (!usuario) return;

        const fetchJugadorData = async () => {
            try {
                const [perfilRes, calendarioRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/jugadores/publico/${usuario.id}`),
                    axios.get('http://localhost:3000/api/jugadores/mi-calendario', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setPerfil(perfilRes.data);
                setCalendario(calendarioRes.data);

            } catch (err) {
                setError('No se pudo cargar la información de tu panel.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJugadorData();
    }, [usuario, token]);

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando tu panel...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!perfil) return <p className="text-center p-8">No se encontró tu perfil.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Panel del Jugador</h2>
                <p className="mt-1 text-lg text-gray-400">
                    Bienvenido de nuevo, {perfil.nombre_in_game}.
                </p>
            </div>
            
            {/* Sección de Estadísticas de Carrera */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard label="Partidos Jugados" value={perfil.estadisticas_carrera.partidos} />
                <StatCard label="Goles" value={perfil.estadisticas_carrera.goles} />
                <StatCard label="Asistencias" value={perfil.estadisticas_carrera.asistencias} />
            </div>

            {/* Sección de Próximos Partidos */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Próximos Partidos</h3>
                <div className="space-y-4">
                    {calendario.length > 0 ? (
                        calendario.map(partido => (
                            <div key={partido.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                                <span className="w-2/5 text-right font-semibold text-gray-300">{partido.nombre_local}</span>
                                <span className="text-xl font-bold text-gray-500 px-4">VS</span>
                                <span className="w-2/5 text-left font-semibold text-gray-300">{partido.nombre_visitante}</span>
                                <span className="text-gray-400 text-sm">{new Date(partido.fecha).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">No tienes partidos pendientes.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JugadorDashboard;
