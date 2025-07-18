import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function DtMiEquipoPage() {
    const [equipo, setEquipo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { usuario, token } = useAuth();
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const fetchMiEquipo = async () => {
        if (!usuario || !usuario.equipo_id) {
            setError('No tienes un equipo asignado para gestionar.');
            setLoading(false);
            return;
        }
        try {
            setLoading(true); 
            const response = await axios.get(`http://localhost:3000/api/equipos/${usuario.equipo_id}/perfil-detallado`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEquipo(response.data);
            if (response.data.escudo) {
                setPreview(`http://localhost:3000${response.data.escudo}`);
            }
        } catch (err) {
            setError('No se pudo cargar la información de tu equipo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (usuario) {
            fetchMiEquipo();
        }
    }, [usuario, token]);

    const handleLiberarJugador = async (jugadorId, jugadorNombre) => {
        if (!window.confirm(`¿Estás seguro de que quieres dar de baja a ${jugadorNombre} de tu plantilla?`)) {
            return;
        }
        try {
            const response = await axios.put(
                'http://localhost:3000/api/equipos/dt/liberar-jugador',
                { jugador_id: jugadorId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message);
            fetchMiEquipo(); 
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ocurrió un error al liberar al jugador.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleEscudoSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.warn("Por favor, selecciona un archivo para el escudo.");
            return;
        }
        const formData = new FormData();
        formData.append('escudo', selectedFile);

        try {
            const response = await axios.post('http://localhost:3000/api/equipos/dt/mi-equipo/escudo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success(response.data.message);
            setPreview(`http://localhost:3000${response.data.escudo_url}?t=${new Date().getTime()}`);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al subir el escudo.');
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando tu equipo...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
    if (!equipo) return <p className="text-center p-8">No se encontró información del equipo. Por favor, asegúrate de tener un equipo asignado.</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Gestión de: {equipo.nombre}</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Administra el escudo y la plantilla de tu equipo.
                    </p>
                </div>
            </div>

            {/* Gestión del Escudo */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-cyan-400">Escudo del Equipo</h3>
                <div className="mt-4 flex items-center space-x-8">
                    <img 
                        src={preview || 'https://placehold.co/150x150/1f2937/a0aec0?text=Escudo'} 
                        alt="Escudo del equipo" 
                        className="h-32 w-32 rounded-lg object-cover bg-gray-700 p-1 border-2 border-gray-600"
                    />
                    <form onSubmit={handleEscudoSubmit} className="flex-grow">
                        <label htmlFor="escudo-upload" className="block text-sm font-medium text-gray-300">
                            Subir nueva imagen
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                            <input
                                id="escudo-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-cyan-400 hover:file:bg-gray-600"
                            />
                            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                Guardar Escudo
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Tabla de Plantilla */}
            <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-4">Plantilla Actual ({equipo.plantilla.length} jugadores)</h3>
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">N°</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Nombre en Juego</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Posición</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {equipo.plantilla.map(jugador => (
                                        <tr key={jugador.id} className="hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-400 sm:pl-6">{jugador.numero_remera || '-'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-white">{jugador.nombre_in_game}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{jugador.posicion}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button onClick={() => handleLiberarJugador(jugador.id, jugador.nombre_in_game)} className="text-red-500 hover:text-red-400">
                                                    Liberar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DtMiEquipoPage;
