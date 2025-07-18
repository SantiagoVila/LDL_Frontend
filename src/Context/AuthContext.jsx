import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const AuthContext = createContext();

// ✅ 1. Definimos la URL base de la API aquí
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const socket = io(apiUrl); // El socket también debe apuntar a la API en producción

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [usuario, setUsuario] = useState(null);
    const [notificaciones, setNotificaciones] = useState([]);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
        if (socket.connected) socket.disconnect();
    };
    
    const refreshUserData = async () => {
        const tokenGuardado = localStorage.getItem('token');
        if (!tokenGuardado) return;

        try {
            const decodedUser = jwtDecode(tokenGuardado);
            // ✅ 2. Usamos la variable apiUrl
            const response = await axios.get(`${apiUrl}/api/usuarios/${decodedUser.id}`, {
                headers: { Authorization: `Bearer ${tokenGuardado}` }
            });
            
            const usuarioCompleto = { ...decodedUser, ...response.data };
            setUsuario(usuarioCompleto);
            
            if (!socket.connected) {
                socket.connect();
                socket.emit('register', usuarioCompleto.id);
            }
        } catch (error) {
            console.error("Error al refrescar datos de usuario, cerrando sesión.", error);
            logout();
        }
    };
    
    useEffect(() => {
        const tokenGuardado = localStorage.getItem('token');
        if (tokenGuardado) {
            refreshUserData();
        }
    }, []);

    useEffect(() => {
        socket.on('nueva_notificacion', (nuevaNotificacion) => {
            setNotificaciones(notificacionesActuales => [nuevaNotificacion, ...notificacionesActuales]);
            toast.info(`🔔 ${nuevaNotificacion.contenido}`);
        });
        return () => {
            socket.off('nueva_notificacion');
        };
    }, []);

    const login = async (email, password) => {
        // ✅ 3. Usamos la variable apiUrl
        const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
        const tokenRecibido = response.data.token;
        localStorage.setItem('token', tokenRecibido);
        setToken(tokenRecibido);
        await refreshUserData();
    };

    const value = { token, usuario, notificaciones, setNotificaciones, login, logout, refreshUserData };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
