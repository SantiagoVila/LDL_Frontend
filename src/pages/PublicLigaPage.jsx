import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PublicLigaPage() {
    const [liga, setLiga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchLiga = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/ligas/publico/${id}/detalles`);
                setLiga(response.data);
            } catch (err) {
                setError('No se pudo encontrar la liga solicitada.');
            } finally {
                setLoading(false);
            }
        };
        fetchLiga();
    }, [id]);

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando información de la liga...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!liga) return <p className="text-center p-8">No hay información disponible para esta liga.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl" style={{fontFamily: 'var(--font-heading)'}}>
                    {liga.nombre}
                </h1>
                <p className="mt-2 text-xl text-gray-400">{liga.temporada || 'Temporada Actual'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Columna Izquierda: Tabla de Posiciones */}
                <div className="lg:col-span-3">
                    <h2 className="text-2xl font-semibold text-cyan-400 mb-4" style={{fontFamily: 'var(--font-heading)'}}>Tabla de Posiciones</h2>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">#</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Equipo</th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-white">Pts</th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-white">PJ</th>
                                    <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-center text-sm font-semibold text-white">G-E-P</th>
                                    <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-center text-sm font-semibold text-white">GF:GC</th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-white">DG</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                {liga.tabla_posiciones && liga.tabla_posiciones.map((equipo, index) => (
                                    <tr key={equipo.equipo_id} className="hover:bg-gray-800/50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-400 sm:pl-6">{index + 1}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-white">
                                            <Link to={`/equipos/${equipo.equipo_id}`} className="hover:text-cyan-400">{equipo.equipo_nombre}</Link>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center font-bold text-cyan-400">{equipo.puntos}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-400">{equipo.partidos_jugados}</td>
                                        <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-center text-gray-400">{`${equipo.partidos_ganados}-${equipo.partidos_empatados}-${equipo.partidos_perdidos}`}</td>
                                        <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-center text-gray-400">{`${equipo.goles_a_favor}:${equipo.goles_en_contra}`}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-400">{equipo.diferencia_goles}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Columna Derecha: Fixture */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-cyan-400 mb-4" style={{fontFamily: 'var(--font-heading)'}}>Fixture</h2>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-xl p-4 space-y-3">
                        {liga.fixture && liga.fixture.map(partido => (
                            <div key={partido.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                                <span className="w-2/5 text-right text-sm font-medium text-gray-300">{partido.nombre_local}</span>
                                <Link to={`/partidos/${partido.id}`} className="text-md font-bold text-white bg-gray-900 px-3 py-1 rounded-lg hover:bg-black transition shadow-md border border-gray-700">
                                    {partido.estado === 'aprobado' ? `${partido.goles_local} - ${partido.goles_visitante}` : 'VS'}
                                </Link>
                                <span className="w-2/5 text-left text-sm font-medium text-gray-300">{partido.nombre_visitante}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublicLigaPage;
