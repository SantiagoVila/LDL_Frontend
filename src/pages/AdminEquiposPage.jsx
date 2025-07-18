import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminEquiposPage() {
    // Estados para la paginación
    const [equipos, setEquipos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estados para el formulario de creación
    const [ligas, setLigas] = useState([]);
    const [newTeam, setNewTeam] = useState({ nombre: '', formacion: '4-4-2', liga_id: '' });
    
    // Estados de control
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    const fetchEquiposPaginados = async (page) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/equipos?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEquipos(response.data.equipos);
            setCurrentPage(response.data.page);
            setTotalPages(Math.ceil(response.data.total / response.data.limit));
        } catch (err) {
            toast.error('No se pudieron cargar los equipos.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!token) return;
            await fetchEquiposPaginados(1);
            try {
                const ligasRes = await axios.get('http://localhost:3000/api/ligas', { headers: { Authorization: `Bearer ${token}` } });
                setLigas(ligasRes.data);
            } catch (err) {
                console.error("Error al cargar las ligas para el formulario", err);
            }
        };
        fetchInitialData();
    }, [token]);

    const handleNextPage = () => {
        if (currentPage < totalPages) fetchEquiposPaginados(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) fetchEquiposPaginados(currentPage - 1);
    };

    const handleCrearEquipo = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/admin/equipos', newTeam, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Equipo creado con éxito.');
            setNewTeam({ nombre: '', formacion: '4-4-2', liga_id: '' });
            fetchEquiposPaginados(1);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Error al crear el equipo.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gestión de Equipos</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Crea y administra los equipos de la plataforma.
                    </p>
                </div>
            </div>

            {/* Formulario de Creación */}
            <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Crear Nuevo Equipo</h3>
                <form onSubmit={handleCrearEquipo} className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
                        <input type="text" id="nombre" value={newTeam.nombre} onChange={e => setNewTeam({...newTeam, nombre: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="formacion" className="block text-sm font-medium text-gray-700">Formación</label>
                        <select id="formacion" value={newTeam.formacion} onChange={e => setNewTeam({...newTeam, formacion: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option>4-4-2</option>
                            <option>4-3-3</option>
                            <option>3-5-2</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="liga_id" className="block text-sm font-medium text-gray-700">Asignar a Liga</label>
                        <select id="liga_id" value={newTeam.liga_id} onChange={e => setNewTeam({...newTeam, liga_id: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">-- Opcional --</option>
                            {ligas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
                        </select>
                    </div>
                    <div className="sm:col-span-4 text-right">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Crear Equipo
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Tabla de Equipos */}
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nombre</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Liga</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Ver</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {equipos.map(equipo => (
                                        <tr key={equipo.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{equipo.id}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                                                <Link to={`/equipos/${equipo.id}`} className="hover:text-indigo-600">{equipo.nombre}</Link>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{equipo.liga_nombre || 'Sin liga'}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${equipo.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {equipo.estado}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link to={`/admin/equipos/${equipo.id}`} className="text-indigo-600 hover:text-indigo-900">Ver Detalles</Link>
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
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                    Anterior
                </button>
                <div className="text-sm text-gray-700">
                    Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                </div>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default AdminEquiposPage;
