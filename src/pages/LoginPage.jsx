import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
            toast.success("¡Bienvenido de nuevo!");
        } catch (err) {
            toast.error(err.response?.data?.error || 'Ocurrió un error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };
    
    // Clases de estilo reutilizables para el nuevo tema
    const inputClass = "mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm";
    const buttonClass = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-cyan-800";

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white" style={{fontFamily: 'var(--font-heading)'}}>
                        Iniciar Sesión
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Ingresa a tu cuenta para continuar.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className={`${inputClass} rounded-t-md`}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`${inputClass} rounded-b-md`}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end text-sm">
                        <Link to="/forgot-password" className="font-medium text-cyan-500 hover:text-cyan-400">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={buttonClass}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-400">
                    ¿No eres miembro?{' '}
                    <Link to="/register" className="font-medium text-cyan-500 hover:text-cyan-400">
                        Regístrate ahora
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
