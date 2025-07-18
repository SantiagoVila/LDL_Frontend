import { useNavigate } from 'react-router-dom';

function BotonVolver() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)} // El -1 le dice al router que vaya a la página anterior
            className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-cyan-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors"
        >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Volver</span>
        </button>
    );
}

export default BotonVolver;
