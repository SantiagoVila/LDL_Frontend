import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Importaciones de Contexto y Componentes de Lógica
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Importaciones para las notificaciones (Toast)
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importaciones de todas las Páginas
import PublicJugadorPage from './pages/PublicJugadorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import PublicEquipoPage from './pages/PublicEquipoPage';
import PublicLigaPage from './pages/PublicLigaPage';
import AdminLigasPage from './pages/AdminLigasPage';
import AdminLigaDetailPage from './pages/AdminLigaDetailPage';
import AdminEquiposPage from './pages/AdminEquiposPage';
import AdminEquipoDetailPage from './pages/AdminEquipoDetailPage';
import AdminPartidosPage from './pages/AdminPartidosPage';
import AdminUsuariosPage from './pages/AdminUsuariosPage';
import AdminUsuarioDetailPage from './pages/AdminUsuarioDetailPage';
import AdminMercadoPage from './pages/AdminMercadoPage';
import AdminReportesPage from './pages/AdminReportesPage';
import AdminSolicitudesPage from './pages/AdminSolicitudesPage';
import AdminAprobacionesEquiposPage from './pages/AdminAprobacionesEquiposPage';
import AdminFinTemporadaPage from './pages/AdminFinTemporadaPage'; 
import AdminCrearNoticiaPage from './pages/AdminCrearNoticiaPage'; 
import AdminLogPage from './pages/AdminLogPage';
import DtCrearEquipoPage from './pages/DtCrearEquipoPage';
import DtMiEquipoPage from './pages/DtMiEquipoPage';
import DtPartidosPage from './pages/DtPartidosPage';
import DtReportarResultadoPage from './pages/DtReportarResultadoPage';
import DtMercadoPage from './pages/DtMercadoPage';
import JugadorOfertasPage from './pages/JugadorOfertasPage';
import CambiarPasswordPage from './pages/CambiarPasswordPage';
import LideresPage from './pages/LideresPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EditarPerfilPage from './pages/EditarPerfilPage';
import PartidoDetailPage from './pages/PartidoDetailPage';
import PublicDtProfilePage from './pages/PublicDtProfilePage';
import ConfirmacionPage from './pages/ConfirmacionPage';
import BotonVolver from './components/ui/BotonVolver';

import './App.css';

function Navigation() {
  const { usuario, logout, token, notificaciones, setNotificaciones } = useAuth();
  const navigate = useNavigate();
  
  const [mostrarDropdownNotif, setMostrarDropdownNotif] = useState(false);
  const [mostrarMenuAdmin, setMostrarMenuAdmin] = useState(false);
  const [mostrarMenuDT, setMostrarMenuDT] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotificacionClick = async (notificacion) => {
    if (notificacion.link_url) {
        navigate(notificacion.link_url);
    } else {
        navigate('/dashboard');
    }
    setMostrarDropdownNotif(false);

    if (!notificacion.leida) {
        try {
            await axios.put(`http://localhost:3000/api/notificaciones/${notificacion.id}/leida`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotificaciones(prev => prev.map(n => 
                n.id === notificacion.id ? { ...n, leida: true } : n
            ));
        } catch (error) {
            console.error("Error al marcar la notificación como leída", error);
        }
    }
  };

  const hayNoLeidas = notificaciones.some(n => !n.leida);
  const conteoNoLeidas = notificaciones.filter(n => !n.leida).length;

  const navLinkClass = "text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const buttonClass = "bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-400 transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]";
  const dropdownItemClass = "block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 w-full text-left";
  
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>LDL</Link>
            <div className="hidden md:flex items-baseline space-x-4">
              <Link to="/" className={navLinkClass}>Inicio</Link>
              <Link to="/lideres" className={navLinkClass}>Líderes</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {usuario ? (
              <>
                <div className="hidden md:flex items-baseline space-x-2">
                  <Link to="/dashboard" className={navLinkClass}>Dashboard</Link>
                  {usuario.rol === 'admin' && (
                    <div className="relative">
                        <button onClick={() => setMostrarMenuAdmin(!mostrarMenuAdmin)} className={navLinkClass}>Admin</button>
                        {mostrarMenuAdmin && (
                            <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10" onMouseLeave={() => setMostrarMenuAdmin(false)}>
                                <div className="py-1">
                                    <Link to="/admin/ligas" className={dropdownItemClass}>Gestionar Ligas</Link>
                                    <Link to="/admin/equipos" className={dropdownItemClass}>Gestionar Equipos</Link>
                                    <Link to="/admin/partidos" className={dropdownItemClass}>Aprobar Partidos</Link>
                                    <Link to="/admin/usuarios" className={dropdownItemClass}>Gestionar Usuarios</Link>
                                    <Link to="/admin/solicitudes-rol" className={dropdownItemClass}>Aprobar Roles</Link>
                                    <Link to="/admin/equipos-solicitudes" className={dropdownItemClass}>Aprobar Equipos</Link>
                                    <Link to="/admin/mercado" className={dropdownItemClass}>Gestionar Mercado</Link>
                                    <Link to="/admin/reportes" className={dropdownItemClass}>Gestionar Reportes</Link>
                                    <Link to="/admin/fin-temporada" className={dropdownItemClass}>Fin de Temporada</Link>
                                    <Link to="/admin/crear-noticia" className={dropdownItemClass}>Crear Noticia</Link>
                                    <Link to="/admin/logs" className={dropdownItemClass}>Historial de Acciones</Link>
                                </div>
                            </div>
                        )}
                    </div>
                  )}
                  {usuario.rol === 'dt' && (
                    <div className="relative">
                        <button onClick={() => setMostrarMenuDT(!mostrarMenuDT)} className={navLinkClass}>DT</button>
                        {mostrarMenuDT && (
                             <div className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10" onMouseLeave={() => setMostrarMenuDT(false)}>
                                <div className="py-1">
                                    {usuario.equipo_id ? (
                                        <>
                                            <Link to="/dt/mi-equipo" className={dropdownItemClass}>Mi Equipo</Link>
                                            <Link to="/dt/partidos" className={dropdownItemClass}>Reportar Partidos</Link>
                                            <Link to="/dt/mercado" className={dropdownItemClass}>Mercado de Pases</Link>
                                        </>
                                    ) : (
                                        <Link to="/dt/crear-equipo" className={dropdownItemClass}>Crear Equipo</Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                  )}
                  {usuario.rol === 'jugador' && <Link to="/jugador/mis-ofertas" className={navLinkClass}>Mis Ofertas</Link>}
                </div>

                <div className="relative">
                  <button onClick={() => setMostrarDropdownNotif(!mostrarDropdownNotif)} className="relative text-gray-400 hover:text-white p-2 rounded-full">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {hayNoLeidas && <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{conteoNoLeidas}</span>}
                  </button>
                  {mostrarDropdownNotif && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10" onMouseLeave={() => setMostrarDropdownNotif(false)}>
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-200 font-bold border-b border-gray-600">Notificaciones</div>
                        {notificaciones.length > 0 ? (
                          notificaciones.slice(0, 5).map(n => (
                            <a key={n.id} onClick={() => handleNotificacionClick(n)} className={`block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 cursor-pointer ${!n.leida && 'bg-gray-800'}`}>
                              {n.contenido}
                              <p className="text-xs text-gray-400 mt-1">{new Date(n.fecha).toLocaleString()}</p>
                            </a>
                          ))
                        ) : <p className="px-4 py-3 text-sm text-gray-500">No tienes notificaciones.</p>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)} className="flex text-sm rounded-full focus:outline-none ring-2 ring-offset-2 ring-offset-gray-800 ring-cyan-500">
                    {/* ✅ LÍNEA CORREGIDA */}
                    <img className="h-8 w-8 rounded-full object-cover" src={usuario.avatar_url ? `http://localhost:3000${usuario.avatar_url}?t=${new Date().getTime()}` : 'https://via.placeholder.com/40'} alt="User Avatar" />
                  </button>
                  {mostrarMenuUsuario && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10" onMouseLeave={() => setMostrarMenuUsuario(false)}>
                          <div className="py-1">
                              <Link to="/editar-perfil" className={dropdownItemClass}>Editar Perfil</Link>
                              <Link to="/cambiar-password" className={dropdownItemClass}>Cambiar Contraseña</Link>
                              <button onClick={handleLogout} className={dropdownItemClass}>Cerrar Sesión</button>
                          </div>
                      </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className={navLinkClass}>Iniciar Sesión</Link>
                <Link to="/register" className={buttonClass}>Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background-dark)', color: 'var(--text-primary)'}}>
        <ToastContainer theme="dark" />
        <Navigation />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/equipos/:id" element={<PublicEquipoPage />} />
            <Route path="/ligas/:id" element={<PublicLigaPage />} />
            <Route path="/jugadores/:id" element={<PublicJugadorPage />} />
            <Route path="/lideres" element={<LideresPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/partidos/:id" element={<PartidoDetailPage />} />
            <Route path="/dts/:id" element={<PublicDtProfilePage />} />
            <Route path="/confirmar/:token" element={<ConfirmacionPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/cambiar-password" element={<ProtectedRoute><CambiarPasswordPage /></ProtectedRoute>} /> 
            <Route path="/editar-perfil" element={<ProtectedRoute><EditarPerfilPage /></ProtectedRoute>} />
            
            <Route path="/admin/ligas" element={<ProtectedRoute><AdminLigasPage /></ProtectedRoute>} />
            <Route path="/admin/ligas/:id" element={<ProtectedRoute><AdminLigaDetailPage /></ProtectedRoute>} />
            <Route path="/admin/equipos" element={<ProtectedRoute><AdminEquiposPage /></ProtectedRoute>} />
            <Route path="/admin/equipos/:id" element={<ProtectedRoute><AdminEquipoDetailPage /></ProtectedRoute>} />
            <Route path="/admin/partidos" element={<ProtectedRoute><AdminPartidosPage /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsuariosPage /></ProtectedRoute>} />
            <Route path="/admin/usuarios/:id" element={<ProtectedRoute><AdminUsuarioDetailPage /></ProtectedRoute>} />
            <Route path="/admin/mercado" element={<ProtectedRoute><AdminMercadoPage /></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute><AdminReportesPage /></ProtectedRoute>} />
            <Route path="/admin/solicitudes-rol" element={<ProtectedRoute><AdminSolicitudesPage /></ProtectedRoute>} />
            <Route path="/admin/equipos-solicitudes" element={<ProtectedRoute><AdminAprobacionesEquiposPage /></ProtectedRoute>} />
            <Route path="/admin/fin-temporada" element={<ProtectedRoute><AdminFinTemporadaPage /></ProtectedRoute>} />
            <Route path="/admin/crear-noticia" element={<ProtectedRoute><AdminCrearNoticiaPage /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute><AdminLogPage /></ProtectedRoute>} />
            
            <Route path="/dt/crear-equipo" element={<ProtectedRoute><DtCrearEquipoPage /></ProtectedRoute>} />
            <Route path="/dt/mi-equipo" element={<ProtectedRoute><DtMiEquipoPage /></ProtectedRoute>} />
            <Route path="/dt/partidos" element={<ProtectedRoute><DtPartidosPage /></ProtectedRoute>} />
            <Route path="/dt/partidos/:id/reportar" element={<ProtectedRoute><DtReportarResultadoPage /></ProtectedRoute>} />
            <Route path="/dt/mercado" element={<ProtectedRoute><DtMercadoPage /></ProtectedRoute>} />
            
            <Route path="/jugador/mis-ofertas" element={<ProtectedRoute><JugadorOfertasPage /></ProtectedRoute>} />

            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
        