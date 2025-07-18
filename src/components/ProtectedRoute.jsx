// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente recibe como 'hijo' la página que queremos proteger
function ProtectedRoute({ children }) {
  const { usuario } = useAuth(); // Obtenemos el usuario de nuestro contexto

  // Si no hay un usuario logueado, redirigimos a la página de login
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // Si hay un usuario, mostramos la página que está protegida
  return children;
}

export default ProtectedRoute;