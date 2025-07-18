import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

function EditarPerfilPage() {
    const { usuario, token, refreshUserData } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        nombre_in_game: '',
        posicion: 'Delantero',
        numero_remera: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (usuario) {
            setProfileData({
                nombre_in_game: usuario.nombre_in_game || '',
                posicion: usuario.posicion || 'Delantero',
                numero_remera: usuario.numero_remera || ''
            });
            if (usuario.avatar_url) {
                setPreview(`http://localhost:3000${usuario.avatar_url}`);
            }
        }
    }, [usuario]);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('http://localhost:3000/api/usuarios/perfil', profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Perfil actualizado con éxito.");
            await refreshUserData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al actualizar el perfil.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.warn("Por favor, selecciona un archivo primero.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        try {
            await axios.post('http://localhost:3000/api/usuarios/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });
            toast.success("Avatar actualizado con éxito.");
            await refreshUserData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al subir la imagen.');
        } finally {
            setLoading(false);
        }
    };

    // Clases de estilo reutilizables para el nuevo tema
    const inputClass = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-300";
    const buttonClass = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-cyan-800";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <h2 className="text-3xl font-bold text-white text-center" style={{fontFamily: 'var(--font-heading)'}}>Editar Perfil</h2>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-medium text-cyan-400">Avatar</h3>
                <div className="mt-4 flex items-center space-x-8">
                    <img 
                        src={preview || 'https://via.placeholder.com/150'} 
                        alt="Avatar Preview" 
                        className="h-24 w-24 rounded-full object-cover bg-gray-700 p-1 border-2 border-gray-600"
                    />
                    <form onSubmit={handleAvatarSubmit} className="flex-grow">
                        <label htmlFor="avatar-upload" className={labelClass}>
                            Subir nueva imagen
                        </label>
                        <div className="mt-1 flex items-center space-x-4">
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-cyan-400 hover:file:bg-gray-600"
                            />
                            <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800">
                                {loading ? 'Subiendo...' : 'Subir'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-medium text-cyan-400">Información del Perfil</h3>
                <form onSubmit={handleProfileSubmit} className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="nombre_in_game" className={labelClass}>Nombre en el Juego</label>
                        <input type="text" name="nombre_in_game" value={profileData.nombre_in_game} onChange={handleChange} required className={inputClass} />
                    </div>
                    
                    {usuario && usuario.rol === 'jugador' && (
                        <>
                            <div>
                                <label htmlFor="posicion" className={labelClass}>Posición Principal</label>
                                <select id="posicion" name="posicion" value={profileData.posicion} onChange={handleChange} className={inputClass}>
                                    <option>Arquero</option>
                                    <option>Defensor</option>
                                    <option>Mediocampista</option>
                                    <option>Delantero</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="numero_remera" className={labelClass}>Número de Remera</label>
                                <input type="number" name="numero_remera" value={profileData.numero_remera} onChange={handleChange} className={inputClass} />
                            </div>
                        </>
                    )}

                    <div className="sm:col-span-2 text-right">
                        <button type="submit" disabled={loading} className={buttonClass}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarPerfilPage;
