import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

function AdminEquiposSolicitudesPage() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [ligas, setLigas] = useState([]);
    const [ligaSeleccionada, setLigaSeleccionada] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fetchSolicitudes = async (page) => {
        if (!token) return;
        setLoading(true);
        try {
            const solicitudesRes = await axios.get(`http://localhost:3000/api/equipos?estado=pendiente&page=${page}&limit=10`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            // LA LÍNEA CLAVE
            setSolicitudes(solicitudesRes.data.equipos || []); 

            setCurrentPage(solicitudesRes.data.page || 1);
            setTotalPages(Math.ceil(solicitudesRes.data.total / (solicitudesRes.data.limit || 10)) || 1);

            if (ligas.length === 0) {
                const ligasRes = await axios.get('http://localhost:3000/api/ligas', { headers: { Authorization: `Bearer ${token}` } });
                setLigas(ligasRes.data);
            }
        } catch (err) {
            setError('No se pudieron cargar las solicitudes de equipos.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSolicitudes(1);
    }, [token]);

    const handleResponder = async (equipoId, respuesta) => {
        const ligaIdSeleccionada = ligaSeleccionada[equipoId] || null;
        if (respuesta === 'aprobado' && !ligaIdSeleccionada) {
            alert('Por favor, selecciona una liga antes de aprobar el equipo.');
            return;
        }
        if (!window.confirm(`¿Estás seguro de que quieres ${respuesta} la creación de este equipo?`)) return;

        try {
            await axios.put(`http://localhost:3000/api/equipos/admin/solicitudes/${equipoId}/responder`, 
                { respuesta, liga_id: ligaIdSeleccionada },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert(`Solicitud ${respuesta} con éxito.`);
            fetchSolicitudes(currentPage); 
        } catch (err) {
            alert(err.response?.data?.error || `Error al ${respuesta} la solicitud.`);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) fetchSolicitudes(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) fetchSolicitudes(currentPage - 1);
    };

    if (loading) return <p>Cargando solicitudes...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Aprobación de Creación de Equipos</h2>
            {(solicitudes.length === 0 && !loading) ? <p>No hay solicitudes pendientes de creación de equipos.</p> : (
                <>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>ID Equipo</th>
                                <th>Nombre Solicitado</th>
                                <th>DT Solicitante</th>
                                <th>Asignar a Liga</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map(s => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.nombre}</td>
                                    <td>{s.nombre_dt || 'N/A'}</td>
                                    <td>
                                        <select onChange={(e) => setLigaSeleccionada(prev => ({ ...prev, [s.id]: e.target.value }))} value={ligaSeleccionada[s.id] || ''}>
                                            <option value="">-- Seleccionar Liga --</option>
                                            {ligas.map(liga => <option key={liga.id} value={liga.id}>{liga.nombre}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleResponder(s.id, 'aprobado')}>Aprobar</button>
                                        <button onClick={() => handleResponder(s.id, 'rechazado')} style={{marginLeft: '5px'}}>Rechazar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            Anterior
                        </button>
                        <span>
                            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                        </span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminEquiposSolicitudesPage;