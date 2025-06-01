const { exec } = require('child_process');

// Construir el frontend
exec('cd frontend && npm run build', (err, stdout, stderr) => {
    if (err) {
        console.error('Error al construir el frontend:', err);
        return;
    }
    console.log('Frontend construido exitosamente');
    
    // Iniciar el servidor backend
    exec('node Backend/server.js', (err, stdout, stderr) => {
        if (err) {
            console.error('Error al iniciar el servidor:', err);
            return;
        }
        console.log('Servidor backend iniciado exitosamente');
    });
});
