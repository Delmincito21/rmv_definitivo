FROM node:18

WORKDIR /app

# Copiar archivos de configuración
COPY railway.env .env

# Copiar package.json y package-lock.json del frontend
COPY frontend/package*.json ./frontend/

# Instalar dependencias del frontend
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps

# Copiar el resto del código del frontend
COPY frontend/ .

# Construir el frontend
RUN npm run build

# Volver al directorio principal
WORKDIR /app

# Copiar package.json y package-lock.json del backend
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Exponer los puertos
EXPOSE 3000
EXPOSE 5173

# Comando de inicio
CMD ["node", "--experimental-specifier-resolution=node", "index.js"]
