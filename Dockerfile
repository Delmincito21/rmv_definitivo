FROM node:18

WORKDIR /app

# Copiar archivos de configuración
COPY railway.env .env

# Configurar la URL de conexión
ENV DATABASE_URL="mysql://root:JEWZIacsisWhxsrEdTrHKjGwEMjvPxKO@mysql.railway.internal:3306/railway"

# Copiar el código del backend
COPY Backend/ ./Backend/

# Copiar el package.json del frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./

# Instalar dependencias del frontend
RUN npm install --legacy-peer-deps

# Copiar el resto del código del frontend
COPY frontend/ .

# Construir el frontend
RUN npm run build

# Volver al directorio principal
WORKDIR /app

# Copiar package.json del backend
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install --legacy-peer-deps

# Configurar el entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer los puertos
EXPOSE 3000
EXPOSE 5173

# Comando de inicio
CMD ["node", "Backend/server.js"]
