FROM node:18

WORKDIR /app

# Copiar archivos de configuración
COPY railway.env .env

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install --legacy-peer-deps

# Construir el frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Volver al directorio principal
WORKDIR /app

# Copiar el resto del código
COPY . .

# Exponer los puertos
EXPOSE 3000
EXPOSE 5173

# Comando de inicio
CMD ["node", "--experimental-specifier-resolution=node", "index.js"]
