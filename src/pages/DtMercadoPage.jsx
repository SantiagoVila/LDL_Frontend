import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function DtMercadoPage() {
    const [jugadores, setJugadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mercadoCerrado, setMercadoCerrado] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPosicion, setFilterPosicion] = useState('');
    const [soloAgentesLibres, setSoloAgentesLibres] = useState(false);

    const { token } = useAuth();

    useEffect(() => {
        const fetchJugadores = async () => {
            if (!token) return;
            setLoading(true);
            setMercadoCerrado(false);
            setError('');

            try {
                const params = new URLSearchParams();
                if (searchTerm) params.append('nombre', searchTerm);
                if (filterPosicion) params.append('posicion', filterPosicion);
                if (soloAgentesLibres) params.append('soloAgentesLibres', 'true');

                const response = await axios.get(`http://localhost:3000/api/jugadores/mercado?${params.toString()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJugadores(response.data);
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setMercadoCerrado(true);
                } else {
                    setError('No se pudieron cargar los jugadores del mercado.');
                }
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchJugadores();
        }, 500);

        return () => clearTimeout(timer);
    }, [token, searchTerm, filterPosicion, soloAgentesLibres]);

    const handleSolicitarFichaje = async (jugadorId, jugadorNombre) => {
        if (!window.confirm(`¿Estás seguro de que quieres enviar una oferta a ${jugadorNombre}?`)) return;
        try {
            await axios.post('http://localhost:3000/api/transferencias/solicitar',
                { jugador_id: jugadorId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('¡Oferta enviada con éxito!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al enviar la oferta.');
        }
    };

    const inputClass = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500";

    if (mercadoCerrado) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12 px-4">
                <div className="p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h3 className="text-2xl font-bold text-yellow-300" style={{fontFamily: 'var(--font-heading)'}}>Mercado Cerrado</h3>
                    <p className="mt-2 text-yellow-400">El mercado de pases no está abierto actualmente. No puedes realizar ofertas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Mercado de Pases</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Explora jugadores y envía ofertas de fichaje.
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-8 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <input 
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={inputClass}
                    />
                    <select value={filterPosicion} onChange={e => setFilterPosicion(e.target.value)} className={inputClass}>
                        <option value="">Todas las Posiciones</option>
                        <option>Arquero</option>
                        <option>Defensor</option>
                        <option>Mediocampista</option>
                        <option>Delantero</option>
                    </select>
                    <label className="flex items-center space-x-2 justify-center md:justify-start text-gray-300">
                        <input 
                            type="checkbox"
                            checked={soloAgentesLibres}
                            onChange={(e) => setSoloAgentesLibres(e.target.checked)}
                            className="h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-600"
                        />
                        <span>Mostrar solo agentes libres</span>
                    </label>
                </div>
            </div>

            {/* Tabla de Jugadores */}
            <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Nombre en Juego</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Posición</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Equipo Actual</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-4 text-gray-500">Buscando jugadores...</td></tr>
                                    ) : jugadores.length > 0 ? (
                                        jugadores.map(jugador => (
                                            <tr key={jugador.id} className="hover:bg-gray-800/50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{jugador.nombre_in_game}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{jugador.posicion}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{jugador.equipo_actual || 'Agente Libre'}</td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                                                    <button onClick={() => handleSolicitarFichaje(jugador.id, jugador.nombre_in_game)} className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md shadow-sm">
                                                        Enviar Oferta
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-sm text-gray-500">
                                                No se encontraron jugadores que coincidan con los filtros.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DtMercadoPage;
