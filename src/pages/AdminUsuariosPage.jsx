import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function AdminUsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchUsuarios = async (page) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/usuarios?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUsuarios(response.data.usuarios);
            setCurrentPage(response.data.page);
            setTotalPages(Math.ceil(response.data.total / response.data.limit));

        } catch (err) {
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios(1);
    }, [token]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            fetchUsuarios(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            fetchUsuarios(currentPage - 1);
        }
    };

    if (loading) return <p className="text-center p-8 text-gray-400">Cargando usuarios...</p>;
    if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Gestión de Usuarios</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Administra todos los usuarios registrados en la plataforma.
                    </p>
                </div>
            </div>

            {/* Tabla de Usuarios */}
            <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">ID</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Nombre / Email</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Rol</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Equipo</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Ver</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 bg-gray-900/50">
                                    {usuarios.map(usuario => (
                                        <tr key={usuario.id} className="hover:bg-gray-800/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-400 sm:pl-6">{usuario.id}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                                <div className="font-medium text-white">{usuario.nombre_in_game}</div>
                                                <div className="text-gray-500">{usuario.email}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    usuario.rol === 'admin' ? 'bg-red-500/10 text-red-400' :
                                                    usuario.rol === 'dt' ? 'bg-blue-500/10 text-blue-400' :
                                                    'bg-green-500/10 text-green-400'
                                                }`}>
                                                    {usuario.rol}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{usuario.equipo_nombre || 'Sin equipo'}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link to={`/admin/usuarios/${usuario.id}`} className="text-cyan-400 hover:text-cyan-300">Ver<span className="sr-only">, {usuario.nombre_in_game}</span></Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controles de Paginación */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                >
                    Anterior
                </button>
                <div className="text-sm text-gray-400">
                    Página <span className="font-medium text-white">{currentPage}</span> de <span className="font-medium text-white">{totalPages}</span>
                </div>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default AdminUsuariosPage;
