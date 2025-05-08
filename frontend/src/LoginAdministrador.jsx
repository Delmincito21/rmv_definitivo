import React, { useState } from 'react';
import App from './App';

const LoginAdministrador = () => {
    // Credenciales predeterminadas del administrador
    const DEFAULT_CREDENTIALS = {
        usuario: 'admin',
        contrasena: 'admin123'
    };

    const [formData, setFormData] = useState({
        usuario: '',
        contrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validación básica
        if (!formData.usuario || !formData.contrasena) {
            setError('Por favor, complete todos los campos');
            setLoading(false);
            return;
        }

        // Simulamos un tiempo de espera para el proceso de login
        setTimeout(() => {
            // Validación contra credenciales predeterminadas
            if (formData.usuario === DEFAULT_CREDENTIALS.usuario &&
                formData.contrasena === DEFAULT_CREDENTIALS.contrasena) {
                // Login exitoso
                alert('Inicio de sesión exitoso como administrador');
                // Aquí podrías redirigir al dashboard del admin o cambiar el estado de autenticación
            } else {
                setError('Credenciales incorrectas. Usuario: admin, Contraseña: admin123');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Panel de Administración</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="usuario" className="block text-gray-700 text-sm font-bold mb-2">
                            Usuario Administrador
                        </label>
                        <input
                            type="text"
                            id="usuario"
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese el usuario"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="contrasena" className="block text-gray-700 text-sm font-bold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese la contraseña"
                        />
                    </div>

                    <div className="mb-4 text-xs text-gray-500">
                        <p>Credenciales predeterminadas:</p>
                        <p>Usuario: <span className="font-mono">admin</span></p>
                        <p>Contraseña: <span className="font-mono">admin123</span></p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Verificando...' : 'Acceder al Panel'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginAdministrador;