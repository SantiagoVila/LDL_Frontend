import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BotonVolver from '../components/ui/BotonVolver';

function DtReportarResultadoPage() {
    const [partido, setPartido] = useState(null);
    const [golesLocal, setGolesLocal] = useState('0');
    const [golesVisitante, setGolesVisitante] = useState('0');
    const [estadisticas, setEstadisticas] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { id: partidoId } = useParams();
    const { usuario, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !usuario?.equipo_id) return;
            try {
                const [partidoRes, equipoRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/partidos/${partidoId}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`http://localhost:3000/api/equipos/${usuario.equipo_id}/perfil-detallado`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                
                setPartido(partidoRes.data);
                
                const statsIniciales = equipoRes.data.plantilla.map(jugador => ({
                    jugador_id: jugador.id,
                    nombre_in_game: jugador.nombre_in_game,
                    equipo_id: usuario.equipo_id,
                    goles: 0,
                    asistencias: 0,
                }));
                setEstadisticas(statsIniciales);

            } catch (err) {
                setError('Error al cargar datos del partido o de tu equipo.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [partidoId, token, usuario]);

    const handleStatChange = (jugadorId, campo, valor) => {
        setEstadisticas(statsActuales => 
            statsActuales.map(stat => 
                stat.jugador_id === jugadorId ? { ...stat, [campo]: parseInt(valor) || 0 } : stat
            )
        );
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('goles_local', golesLocal);
        formData.append('goles_visitante', golesVisitante);
        if (file) {
            formData.append('imagen_resultado', file);
        } else {
            toast.warn("Por favor, sube una imagen como prueba del resultado.");
            return;
        }

        const estadisticasParaEnviar = estadisticas.filter(stat => stat.goles > 0 || stat.asistencias > 0);
        if (estadisticasParaEnviar.length > 0) {
            formData.append('jugadores', JSON.stringify(estadisticasParaEnviar));
        }

        try {
            await axios.put(`http://localhost:3000/api/partidos/dt/reportar/${partidoId}`, 
                formData,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );
            
            toast.success('Resultado y estadísticas reportados con éxito. Pendiente de aprobación.');
            navigate('/dt/partidos');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al reportar el resultado.');
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!partido) return <p className="text-center p-8">Partido no encontrado.</p>;
    
    const inputClass = "w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500";
    const labelClass = "text-sm font-medium text-gray-300";
    const buttonClass = "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500";


    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BotonVolver />
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Reportar Resultado</h2>
                <p className="mt-1 text-lg text-gray-400">
                    {partido.nombre_local} vs {partido.nombre_visitante}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-medium text-cyan-400">Resultado Final</h3>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <label className="w-1/3 text-right font-semibold text-white">{partido.nombre_local}</label>
                        <input type="number" min="0" value={golesLocal} onChange={(e) => setGolesLocal(e.target.value)} required className="w-20 text-center text-xl p-2 bg-gray-900 border border-gray-600 rounded-md"/>
                        <span className="text-gray-400">-</span>
                        <input type="number" min="0" value={golesVisitante} onChange={(e) => setGolesVisitante(e.target.value)} required className="w-20 text-center text-xl p-2 bg-gray-900 border border-gray-600 rounded-md"/>
                        <label className="w-1/3 text-left font-semibold text-white">{partido.nombre_visitante}</label>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-medium text-cyan-400">Prueba del Resultado</h3>
                    <p className="text-sm text-gray-400 mt-1">Sube una captura de pantalla del resultado final (obligatorio).</p>
                    <input type="file" onChange={handleFileChange} accept="image/*" required className="mt-4 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-cyan-400 hover:file:bg-gray-600"/>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-medium text-cyan-400">Estadísticas Individuales de tu Equipo</h3>
                    <div className="mt-4 space-y-4">
                        {estadisticas.map(stat => (
                            <div key={stat.jugador_id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <strong className="md:col-span-1 text-white">{stat.nombre_in_game}</strong>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Goles</label>
                                        <input type="number" min="0" value={stat.goles} onChange={e => handleStatChange(stat.jugador_id, 'goles', e.target.value)} className={inputClass}/>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Asistencias</label>
                                        <input type="number" min="0" value={stat.asistencias} onChange={e => handleStatChange(stat.jugador_id, 'asistencias', e.target.value)} className={inputClass}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="pt-5">
                    <div className="flex justify-end">
                        <button type="submit" className={buttonClass}>
                            Enviar Reporte Completo
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default DtReportarResultadoPage;
