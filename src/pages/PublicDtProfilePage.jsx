import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BotonVolver from '../components/ui/BotonVolver';

function PublicDtProfilePage() {
    const [dt, setDt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchDtProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/usuarios/publico/dt/${id}`);
                setDt(response.data);
            } catch (err) {
                setError('No se pudo encontrar el perfil del Director Técnico.');
            } finally {
                setLoading(false);
            }
        };
        fetchDtProfile();
    }, [id]);

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando perfil...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!dt) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BotonVolver />
            {/* Encabezado del Perfil */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg overflow-hidden mb-8">
                <div className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <img 
                        src={dt.avatar_url ? `http://localhost:3000${dt.avatar_url}` : 'https://placehold.co/150x150/1f2937/a0aec0?text=Avatar'} 
                        alt={`Avatar de ${dt.nombre_in_game}`} 
                        className="h-32 w-32 rounded-full object-cover bg-gray-700 p-1 border-2 border-gray-600"
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>{dt.nombre_in_game}</h1>
                        <p className="mt-1 text-lg text-cyan-400 font-semibold">Director Técnico</p>
                    </div>
                </div>
            </div>

            {/* Información del Equipo Actual */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-600 pb-2" style={{fontFamily: 'var(--font-heading)'}}>Equipo Actual</h3>
                {dt.equipo_id ? (
                    <Link to={`/equipos/${dt.equipo_id}`} className="flex items-center space-x-4 group">
                        <img 
                            src={dt.escudo_equipo ? `http://localhost:3000${dt.escudo_equipo}` : 'https://placehold.co/64x64/1f2937/a0aec0?text=Escudo'} 
                            alt={`Escudo de ${dt.equipo_nombre}`} 
                            className="h-16 w-16 rounded-lg object-cover bg-gray-700 p-1"
                        />
                        <p className="text-2xl font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                            {dt.equipo_nombre}
                        </p>
                    </Link>
                ) : (
                    <p className="text-gray-400">Actualmente sin equipo.</p>
                )}
            </div>

            {/* Estadísticas como Jugador */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-600 pb-2" style={{fontFamily: 'var(--font-heading)'}}>Estadísticas como Jugador</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-white">{dt.estadisticas_carrera.partidos}</p>
                        <p className="text-sm font-medium text-gray-400">Partidos Jugados</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-white">{dt.estadisticas_carrera.goles}</p>
                        <p className="text-sm font-medium text-gray-400">Goles</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-white">{dt.estadisticas_carrera.asistencias}</p>
                        <p className="text-sm font-medium text-gray-400">Asistencias</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicDtProfilePage;
