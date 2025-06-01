#!/bin/sh

# Construir el frontend
npm run build

# Esperar a que MySQL esté listo
sleep 5

# Iniciar el servidor
node Backend/server.js
