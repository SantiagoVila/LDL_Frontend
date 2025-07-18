import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// --- Componente de Tarjeta de Estadística Reutilizable ---
const StatCard = ({ to, number, label, icon, urgent = false }) => {
    // Iconos SVG para cada tarjeta
    const icons = {
        equipos: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        roles: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4z" /></svg>,
        partidos: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
        usuarios: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 002.45 12a10.99 10.99 0 001.45-3.803" /></svg>,
        ligas: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
    };

    return (
        <Link to={to} className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className={`p-6 ${urgent && number > 0 ? 'border-l-4 border-yellow-400' : 'border-l-4 border-gray-800'}`}>
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-gray-800 rounded-full p-3">
                        {icons[icon] || icons['equipos']}
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900">{number}</p>
                        <p className="text-sm font-medium text-gray-500">{label}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};


function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3000/api/admin/dashboard-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                setError('No se pudieron cargar las estadísticas.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) return <p className="text-center p-8 text-gray-500">Cargando panel de administrador...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administrador</h2>
            
            {stats && (
                <div className="space-y-10">
                    {/* Sección de Tareas Pendientes */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Tareas Pendientes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard to="/admin/equipos-solicitudes" number={stats.equipos_pendientes} label="Equipos por Aprobar" icon="equipos" urgent />
                            <StatCard to="/admin/solicitudes-rol" number={stats.roles_pendientes} label="Roles por Aprobar" icon="roles" urgent />
                            <StatCard to="/admin/partidos" number={stats.partidos_pendientes} label="Partidos por Aprobar" icon="partidos" urgent />
                        </div>
                    </div>

                    {/* Sección de Estadísticas Generales */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Estadísticas Generales</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatCard to="/admin/usuarios" number={stats.total_usuarios} label="Usuarios Registrados" icon="usuarios" />
                            <StatCard to="/admin/equipos" number={stats.total_equipos} label="Equipos Aprobados" icon="equipos" />
                            <StatCard to="/admin/ligas" number={stats.total_ligas} label="Ligas Creadas" icon="ligas" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
