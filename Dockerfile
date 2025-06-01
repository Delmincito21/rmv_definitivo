FROM node:18

WORKDIR /app

# Copiar archivos de configuración
COPY railway.env .env

# Copiar package.json y package-lock.json del backend
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Copiar package.json y package-lock.json del frontend
WORKDIR /app/frontend
COPY package*.json ./

# Instalar dependencias del frontend
RUN npm install --legacy-peer-deps

# Copiar el resto del código del frontend
COPY . .

# Construir el frontend
RUN npm run build

# Volver al directorio principal
WORKDIR /app

# Exponer los puertos
EXPOSE 3000
EXPOSE 5173

# Comando de inicio
CMD ["node", "--experimental-specifier-resolution=node", "index.js"]
