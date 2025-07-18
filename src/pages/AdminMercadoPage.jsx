import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

function AdminMercadoPage() {
    const [mercado, setMercado] = useState({ abierto: false, fecha_inicio: '', fecha_fin: '' });
    const [formFechas, setFormFechas] = useState({ inicio: '', fin: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fetchEstadoMercado = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/mercado/estado', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMercado(response.data);
            setFormFechas({
                inicio: response.data.fecha_inicio ? new Date(response.data.fecha_inicio).toISOString().slice(0, 16) : '',
                fin: response.data.fecha_fin ? new Date(response.data.fecha_fin).toISOString().slice(0, 16) : ''
            });
        } catch (err) {
            setError('No se pudo cargar el estado del mercado.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchEstadoMercado();
        }
    }, [token]);

    const handleProgramarMercado = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:3000/api/admin/mercado/programar', 
            {
                fecha_inicio: formFechas.inicio,
                fecha_fin: formFechas.fin
            }, 
            { headers: { Authorization: `Bearer ${token}` } });

            toast.success('¡Fechas del mercado actualizadas!');
            fetchEstadoMercado();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al programar las fechas.');
        }
    };

    const handleAbrirCerrarManualmente = async (accion) => {
        const endpoint = accion === 'abrir' ? '/mercado/abrir' : '/mercado/cerrar';
        if (!window.confirm(`¿Estás seguro de que quieres ${accion} el mercado manualmente?`)) return;

        try {
            await axios.post(`http://localhost:3000/api${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Mercado ${accion === 'abrir' ? 'abierto' : 'cerrado'} correctamente.`);
            fetchEstadoMercado();
        } catch (err) {
             toast.error(err.response?.data?.error || 'Error al cambiar el estado del mercado.');
        }
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-300";
    const buttonClass = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500";

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando estado del mercado...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Gestión del Mercado</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Controla los períodos de fichajes de la plataforma.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-medium text-cyan-400 mb-4">Estado Actual</h3>
                    <div className={`p-4 rounded-md text-center ${mercado.abierto ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        <p className="font-bold text-lg">
                            El mercado está: {mercado.abierto ? 'ABIERTO' : 'CERRADO'}
                        </p>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                        <p><strong>Período programado:</strong></p>
                        <p>Inicio: {mercado.fecha_inicio ? new Date(mercado.fecha_inicio).toLocaleString() : 'N/A'}</p>
                        <p>Fin: {mercado.fecha_fin ? new Date(mercado.fecha_fin).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button onClick={() => handleAbrirCerrarManualmente('abrir')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                            Abrir Manualmente
                        </button>
                        <button onClick={() => handleAbrirCerrarManualmente('cerrar')} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                            Cerrar Manualmente
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-medium text-cyan-400 mb-4">Programar Nuevo Período</h3>
                    <form onSubmit={handleProgramarMercado} className="space-y-4">
                        <div>
                            <label htmlFor="inicio" className={labelClass}>Fecha de Inicio:</label>
                            <input 
                                id="inicio"
                                type="datetime-local" 
                                value={formFechas.inicio} 
                                onChange={e => setFormFechas({...formFechas, inicio: e.target.value})} 
                                required 
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="fin" className={labelClass}>Fecha de Fin:</label>
                            <input 
                                id="fin"
                                type="datetime-local" 
                                value={formFechas.fin} 
                                onChange={e => setFormFechas({...formFechas, fin: e.target.value})} 
                                required 
                                className={inputClass}
                            />
                        </div>
                        <div className="text-right pt-2">
                            <button type="submit" className={buttonClass}>
                                Guardar Fechas
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminMercadoPage;
