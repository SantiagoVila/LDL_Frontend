import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function CambiarPasswordPage() {
    const [formData, setFormData] = useState({
        passwordActual: '',
        passwordNuevo: '',
        passwordConfirmar: ''
    });
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.passwordNuevo !== formData.passwordConfirmar) {
            toast.error('La nueva contraseña y la confirmación no coinciden.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put('http://localhost:3000/api/usuarios/cambiar-password', {
                passwordActual: formData.passwordActual,
                passwordNuevo: formData.passwordNuevo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(response.data.message);
            setFormData({ passwordActual: '', passwordNuevo: '', passwordConfirmar: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ocurrió un error al cambiar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    // Clases de estilo reutilizables para el nuevo tema
    const inputClass = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-300";
    const buttonClass = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-cyan-800";

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>Cambiar Contraseña</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Asegúrate de usar una contraseña segura.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={labelClass}>Contraseña Actual</label>
                        <input
                            type="password"
                            name="passwordActual"
                            value={formData.passwordActual}
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Nueva Contraseña</label>
                        <input
                            type="password"
                            name="passwordNuevo"
                            value={formData.passwordNuevo}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            name="passwordConfirmar"
                            value={formData.passwordConfirmar}
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

export default CambiarPasswordPage;
