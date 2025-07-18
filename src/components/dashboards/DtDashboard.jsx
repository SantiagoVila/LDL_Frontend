import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// ✅ RUTA DE IMPORTACIÓN CORREGIDA
import { useAuth } from '../../Context/AuthContext';

// --- Componente de Tarjeta de Estadística Reutilizable ---
const StatCard = ({ label, value, icon, link = null }) => {
    const content = (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-5 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center text-cyan-400 mb-2">{icon}</div>
            <p className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>{value}</p>
            <p className="text-sm font-medium text-gray-400">{label}</p>
        </div>
    );

    return link ? <Link to={link} className="block">{content}</Link> : <div className="block">{content}</div>;
};


function DtDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { usuario, token } = useAuth();

    useEffect(() => {
        const fetchDtData = async () => {
            if (!usuario) {
                setLoading(false);
                return;
            }

            if (!usuario.equipo_id) {
                setLoading(false);
                return;
            }

            try {
                // Usamos la URL de la variable de entorno para producción
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                const response = await axios.get(`${apiUrl}/api/equipos/dt/dashboard-stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                console.error("Error al cargar las estadísticas del dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDtData();
    }, [usuario, token]);

    if (loading) {
        return <p className="text-center p-8 text-gray-400">Cargando tu dashboard...</p>;
    }

    if (!usuario.equipo_id) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>¡Bienvenido, DT!</h2>
                <p className="mt-2 text-lg text-gray-300">Parece que aún no tienes un equipo.</p>
                <Link to="/dt/crear-equipo" className="mt-6 inline-block bg-cyan-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-cyan-400 transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]">
                    Crear mi Equipo Ahora
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Dashboard del Director Técnico</h2>
                <p className="mt-1 text-lg text-gray-400">
                    Resumen de tu equipo y próximas acciones.
                </p>
            </div>
            
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                        label="Jugadores en Plantilla"
                        value={stats.playerCount}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        link="/dt/mi-equipo"
                    />
                    <StatCard 
                        label="Puntos en Liga"
                        value={stats.leaguePosition ? stats.leaguePosition.puntos : 'N/A'}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                    />
                     <StatCard 
                        label="Partidos Jugados"
                        value={stats.leaguePosition ? stats.leaguePosition.partidos_jugados : 'N/A'}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    />
                </div>
            )}
            
            {stats && stats.nextMatch && (
                <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-xl p-6">
                     <h3 className="text-xl font-semibold mb-4 text-cyan-400" style={{fontFamily: 'var(--font-heading)'}}>Próximo Partido</h3>
                     <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <span className="w-2/5 text-right font-semibold text-gray-300 text-lg">{stats.nextMatch.nombre_local}</span>
                        <span className="text-xl font-bold text-gray-500 px-4">VS</span>
                        <span className="w-2/5 text-left font-semibold text-gray-300 text-lg">{stats.nextMatch.nombre_visitante}</span>
                        <span className="text-gray-400">{new Date(stats.nextMatch.fecha).toLocaleDateString()}</span>
                     </div>
                </div>
            )}
        </div>
    );
}

export default DtDashboard;
