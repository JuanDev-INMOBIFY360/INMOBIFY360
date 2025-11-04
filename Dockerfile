# 🧩 1️⃣ Etapa de construcción
FROM node:20 AS build
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

# ------------------------------------------------------------
FROM node:20-slim AS production
WORKDIR /app

# Copiamos solo lo necesario desde la etapa anterior
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src

# ✅ No copiamos .env, se inyecta desde docker-compose

# Instalamos solo dependencias de producción (por si acaso)
RUN npm install --omit=dev

EXPOSE 5000
CMD ["npm", "run", "dev"]
