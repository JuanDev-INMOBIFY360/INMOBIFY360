# 🧩 1️⃣ Etapa de construcción
FROM node:20 AS build
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo las de desarrollo si las hay)
RUN npm install

# Copiamos todo el código fuente
COPY . .

# Generamos el Prisma Client
RUN npx prisma generate

# ------------------------------------------------------------
# 🧩 2️⃣ Etapa final, solo para ejecutar la app
FROM node:20-slim AS production
WORKDIR /app

# Copiamos solo lo necesario desde la etapa anterior
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src
COPY --from=build /app/.env ./.env

# Instalamos solo dependencias de producción (por si acaso)
RUN npm install --omit=dev

# Exponemos el puerto
EXPOSE 5000

# Comando para ejecutar la app
CMD ["npm", "run", "dev"]
# o si tienes un script start en package.json:
# CMD ["npm", "start"]
