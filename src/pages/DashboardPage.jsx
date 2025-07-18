// src/pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import DtDashboard from '../components/dashboards/DtDashboard';
import JugadorDashboard from '../components/dashboards/JugadorDashboard';

function DashboardPage() {
    const { usuario } = useAuth();

    // Si el usuario aún no se ha cargado, muestra un mensaje de carga.
    if (!usuario) {
        return <p>Cargando...</p>;
    }

    // Renderizamos un dashboard diferente según el rol del usuario
    switch (usuario.rol) {
        case 'admin':
            return <AdminDashboard />;
        case 'dt':
            return <DtDashboard />;
        case 'jugador':
            return <JugadorDashboard />;
        default:
            return <p>Rol no reconocido. Por favor, contacta a soporte.</p>;
    }
}

export default DashboardPage;