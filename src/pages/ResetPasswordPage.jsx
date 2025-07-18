import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:3000/api/auth/reset-password/${token}`, { password });
            toast.success(response.data.message);
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ocurrió un error al actualizar la contraseña.');
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
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Establecer Nueva Contraseña</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Elige una nueva contraseña segura para tu cuenta.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={labelClass}>Nueva Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
