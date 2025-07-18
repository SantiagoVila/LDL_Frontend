import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// --- Componente de Tabla de Líderes Reutilizable ---
const LideresTable = ({ titulo, jugadores }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-800">
            <h3 className="text-lg leading-6 font-medium text-cyan-400" style={{fontFamily: 'var(--font-heading)'}}>{titulo}</h3>
        </div>
        <div className="border-t border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                    <tr>
                        <th scope="col" className="w-16 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-white sm:pl-6">#</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Jugador</th>
                        <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-white">Equipo</th>
                        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-white">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                    {jugadores.map((jugador, index) => (
                        <tr key={jugador.jugador_id} className="hover:bg-gray-800/50">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm font-medium text-gray-400 sm:pl-6">{index + 1}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-white">
                                <Link to={`/jugadores/${jugador.jugador_id}`} className="hover:text-cyan-400">
                                    {jugador.nombre_in_game}
                                </Link>
                            </td>
                            <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-400">{jugador.equipo_actual || 'Agente Libre'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-center text-sm font-bold text-cyan-400">{jugador.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


function LideresPage() {
    const [lideres, setLideres] = useState({ goleadores: [], asistidores: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLideres = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/stats/lideres');
                setLideres(response.data);
            } catch (err) {
                setError('No se pudieron cargar las estadísticas de líderes.');
            } finally {
                setLoading(false);
            }
        };
        fetchLideres();
    }, []);

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando clasificaciones...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl" style={{fontFamily: 'var(--font-heading)'}}>
                    Líderes de la Plataforma
                </h1>
                <p className="mt-2 text-xl text-gray-400">Rankings de los mejores jugadores en todas las competiciones.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LideresTable titulo="Máximos Goleadores" jugadores={lideres.goleadores} />
                <LideresTable titulo="Máximos Asistidores" jugadores={lideres.asistidores} />
            </div>
        </div>
    );
}

export default LideresPage;
