FROM node:18

WORKDIR /app

# Copiar el archivo de configuración
COPY railway.env .env

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias del backend
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Exponer los puertos
EXPOSE 3000
EXPOSE 5173

# Comando de inicio
CMD ["npm", "run", "start"]
