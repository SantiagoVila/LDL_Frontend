import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombre_in_game: '',
        posicion: 'Delantero',
        numero_remera: ''
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:3000/api/usuarios/register', formData);
            setSuccessMessage(response.data.message);
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMsg = err.response.data.errors.map(e => e.msg).join('. ');
                toast.error(errorMsg);
            } else {
                toast.error(err.response?.data?.error || 'Error al registrar el usuario.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Clases de estilo reutilizables
    const inputClass = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-300";
    const buttonClass = "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-cyan-800";

    if (successMessage) {
        return (
            <div className="max-w-md mx-auto mt-10 text-center bg-gray-800/50 border border-gray-700 p-8 rounded-xl shadow-lg">
                 <h1 className="text-2xl font-bold text-green-400">¡Casi listo!</h1>
                 <p className="mt-4 text-gray-300">{successMessage}</p>
                 <p className="mt-2 text-sm text-gray-400">Cierra esta ventana y sigue las instrucciones en el correo que te hemos enviado.</p>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-lg p-8 space-y-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>
                        Crear una Cuenta
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Únete a la competición.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="email-address" className={labelClass}>Email</label>
                                <input id="email-address" name="email" type="email" required className={inputClass} placeholder="tu@email.com" value={formData.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="password" className={labelClass}>Contraseña</label>
                                <input id="password" name="password" type="password" required className={inputClass} placeholder="Mínimo 8 caracteres" value={formData.password} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="nombre_in_game" className={labelClass}>Nombre en el Juego</label>
                                <input id="nombre_in_game" name="nombre_in_game" type="text" required className={inputClass} placeholder="Tu Nickname" value={formData.nombre_in_game} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="posicion" className={labelClass}>Posición Principal</label>
                                <select id="posicion" name="posicion" value={formData.posicion} onChange={handleChange} className={inputClass}>
                                    <option>Arquero</option>
                                    <option>Defensor</option>
                                    <option>Mediocampista</option>
                                    <option>Delantero</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="numero_remera" className={labelClass}>Número de Remera</label>
                                <input id="numero_remera" name="numero_remera" type="number" className={inputClass} placeholder="Ej: 10" value={formData.numero_remera} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonClass}
                        >
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-400">
                    ¿Ya eres miembro?{' '}
                    <Link to="/login" className="font-medium text-cyan-500 hover:text-cyan-400">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
