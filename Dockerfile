FROM node:20
WORKDIR /app

# Copiamos package files
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos prisma schema
COPY prisma ./prisma

# Generamos Prisma Client
RUN npx prisma generate

# Copiamos el código (aunque el volumen lo sobrescribirá en dev)
COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]