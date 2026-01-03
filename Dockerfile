FROM node:20-alpine

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar schema de Prisma
COPY prisma ./prisma

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 5000

# El comando se sobrescribirá en docker-compose.yml
CMD ["npm", "run", "dev"]