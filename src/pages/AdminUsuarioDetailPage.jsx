import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import BotonVolver from '../components/ui/BotonVolver'; // Se importa el nuevo componente

function AdminUsuarioDetailPage() {
    const [usuario, setUsuario] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [sanciones, setSanciones] = useState([]);
    const [nuevaSancion, setNuevaSancion] = useState({ motivo: '', partidos_de_sancion: '1' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { id: usuarioId } = useParams();
    const { token } = useAuth();

    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [usuarioRes, equiposRes, sancionesRes] = await Promise.all([
                axios.get(`http://localhost:3000/api/usuarios/${usuarioId}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:3000/api/equipos', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`http://localhost:3000/api/admin/usuarios/${usuarioId}/sanciones`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setUsuario(usuarioRes.data);
            setEquipos(equiposRes.data.equipos || []);
            setSanciones(sancionesRes.data);
        } catch (err) {
            setError('No se pudo cargar la información.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [usuarioId, token]);

    const handleRolChange = async (nuevoRol) => {
        if (!window.confirm(`¿Seguro que quieres cambiar el rol a "${nuevoRol}"?`)) return;
        try {
            await axios.put(`http://localhost:3000/api/usuarios/${usuarioId}/rol`,
                { nuevoRol },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Rol actualizado con éxito.');
            setUsuario(prev => ({ ...prev, rol: nuevoRol }));
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al cambiar el rol.');
        }
    };

    const handleEquipoChange = async (e) => {
        const nuevoEquipoId = e.target.value;
        try {
            await axios.put(`http://localhost:3000/api/usuarios/${usuarioId}/equipo`,
                { nuevoEquipoId: nuevoEquipoId || null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Equipo actualizado con éxito.');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al cambiar el equipo.');
        }
    };

    const handleSancionChange = (e) => {
        setNuevaSancion({ ...nuevaSancion, [e.target.name]: e.target.value });
    };

    const handleAplicarSancion = async (e) => {
        e.preventDefault();
        if (!window.confirm("¿Estás seguro de que quieres aplicar esta sanción?")) return;
        
        try {
            await axios.post('http://localhost:3000/api/admin/sanciones', {
                jugador_id: usuarioId,
                motivo: nuevaSancion.motivo,
                partidos_de_sancion: nuevaSancion.partidos_de_sancion
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            toast.success('¡Sanción aplicada con éxito!');
            setNuevaSancion({ motivo: '', partidos_de_sancion: '1' });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al aplicar la sanción.');
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-500">Cargando...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!usuario) return <p className="text-center p-8">No se encontró el usuario.</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BotonVolver />

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Detalle del Usuario</h2>
                    <p className="mt-1 text-sm text-gray-500">Gestiona la información y permisos de {usuario.nombre_in_game}.</p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                    {/* Información Básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-600">Información de Contacto</h4>
                            <p className="text-gray-800">{usuario.email}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-600">Equipo Actual</h4>
                            <p className="text-gray-800">{usuario.equipo_nombre || 'Sin equipo'}</p>
                        </div>
                    </div>

                    {/* Gestión de Rol y Equipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol del Usuario</label>
                            <select id="rol" value={usuario.rol} onChange={(e) => handleRolChange(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="jugador">Jugador</option>
                                <option value="dt">DT</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="equipo" className="block text-sm font-medium text-gray-700">Asignar a Equipo</label>
                            <select id="equipo" value={usuario.equipo_id || ""} onChange={handleEquipoChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">-- Sin Equipo --</option>
                                {equipos.map(equipo => (
                                    <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gestión de Sanciones (solo para jugadores) */}
            {usuario.rol === 'jugador' && (
                <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Gestión de Sanciones</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        {/* Formulario para aplicar sanción */}
                        <form onSubmit={handleAplicarSancion} className="space-y-4">
                            <div>
                                <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">Motivo de la Sanción</label>
                                <textarea id="motivo" name="motivo" value={nuevaSancion.motivo} onChange={handleSancionChange} required rows={3} className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"/>
                            </div>
                            <div>
                                <label htmlFor="partidos_de_sancion" className="block text-sm font-medium text-gray-700">Partidos de Suspensión</label>
                                <input type="number" id="partidos_de_sancion" name="partidos_de_sancion" value={nuevaSancion.partidos_de_sancion} onChange={handleSancionChange} min="1" required className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"/>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Aplicar Sanción
                                </button>
                            </div>
                        </form>
                        
                        {/* Tabla con historial de sanciones */}
                        <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-800">Historial de Sanciones</h4>
                            {sanciones.length > 0 ? (
                                <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Motivo</th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sanción</th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {sanciones.map(s => (
                                                <tr key={s.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(s.fecha_creacion).toLocaleDateString()}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{s.motivo}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{s.partidos_de_sancion} partidos</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${s.estado === 'activa' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {s.estado}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-gray-500">Este jugador no tiene sanciones.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsuarioDetailPage;
