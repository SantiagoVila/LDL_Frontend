import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
            setMessage(response.data.message);
            toast.success("Solicitud enviada con éxito.");
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ocurrió un error al enviar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    // Clases de estilo reutilizables para el nuevo tema
    const inputClass = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-300";
    const buttonClass = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-cyan-800";

    return (
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Recuperar Contraseña</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Ingresa tu email y te enviaremos un enlace para recuperar tu cuenta.
                    </p>
                </div>
                
                {!message ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={buttonClass}
                            >
                                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center text-green-400">
                        <p>{message}</p>
                        <Link to="/login" className="mt-4 inline-block font-medium text-cyan-500 hover:text-cyan-400">
                            Volver a Iniciar Sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
