import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function AdminCrearNoticiaPage() {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();
    const navigate = useNavigate();

    const handleCrearNoticia = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
                'http://localhost:3000/api/noticias',
                { titulo, contenido },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('¡Noticia publicada con éxito!');
            navigate('/'); // Redirigimos a la página de inicio para ver la nueva noticia

        } catch (err) {
            toast.error(err.response?.data?.error || 'No se pudo publicar la noticia.');
        } finally {
            setLoading(false);
        }
    };

    // Clases de estilo reutilizables para el nuevo tema
    const inputClass = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-300";
    const buttonClass = "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-cyan-800";

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Crear Nueva Noticia</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Publica anuncios y comunicados para todos los usuarios.
                    </p>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6">
                <form onSubmit={handleCrearNoticia} className="space-y-6">
                    <div>
                        <label htmlFor="titulo" className={labelClass}>
                            Título
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="titulo"
                                id="titulo"
                                className={inputClass}
                                placeholder="Anuncio importante"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contenido" className={labelClass}>
                            Contenido
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="contenido"
                                name="contenido"
                                rows={10}
                                className={inputClass}
                                placeholder="Escribe aquí el cuerpo de la noticia..."
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={buttonClass}
                            >
                                {loading ? 'Publicando...' : 'Publicar Noticia'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminCrearNoticiaPage;
