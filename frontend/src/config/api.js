const API_CONFIG = {
    // URL base según el entorno
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    // URLs específicas
    endpoints: {
        login: '/login',
        register: '/register',
        // Agrega aquí otros endpoints que necesites
    }
};

export default API_CONFIG;
