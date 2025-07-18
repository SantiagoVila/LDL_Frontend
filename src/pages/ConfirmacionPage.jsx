import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ConfirmacionPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams();

    useEffect(() => {
        const confirmarCuenta = async () => {
            if (!token) {
                setError('Token de confirmación no encontrado.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/auth/confirmar/${token}`);
                setMessage(response.data.message);
            } catch (err) {
                setError(err.response?.data?.error || 'Ocurrió un error al confirmar la cuenta.');
            } finally {
                setLoading(false);
            }
        };

        confirmarCuenta();
    }, [token]);

    if (loading) {
        return <p className="text-center p-8 text-gray-400">Confirmando tu cuenta...</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-xl shadow-lg">
            {error ? (
                <>
                    <h1 className="text-2xl font-bold text-red-500" style={{fontFamily: 'var(--font-heading)'}}>Error en la Confirmación</h1>
                    <p className="mt-4 text-gray-300">{error}</p>
                    <Link to="/login" className="mt-6 inline-block font-medium text-cyan-500 hover:text-cyan-400">
                        Volver a Iniciar Sesión
                    </Link>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-green-400" style={{fontFamily: 'var(--font-heading)'}}>¡Cuenta Confirmada!</h1>
                    <p className="mt-4 text-gray-300">{message}</p>
                    <Link to="/login" className="mt-6 inline-block bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-400 transition-all duration-200 shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)]">
                        Ir a Iniciar Sesión
                    </Link>
                </>
            )}
        </div>
    );
}

export default ConfirmacionPage;
