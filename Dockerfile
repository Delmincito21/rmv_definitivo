FROM node:18

WORKDIR /app

# Copiar archivos de configuración
COPY railway.env .env

# Configurar la URL de conexión
ENV DATABASE_URL="mysql://root:JEWZIacsisWhxsrEdTrHKjGwEMjvPxKO@mysql.railway.internal:3306/railway"

# Copiar package.json y package-lock.json del backend
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Construir el frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm install -g vite
RUN npm run build

# Volver al directorio principal
WORKDIR /app

# Exponer los puertos
EXPOSE 3000
EXPOSE 5173

# Comando de inicio
CMD ["node", "--experimental-specifier-resolution=node", "index.js"]
