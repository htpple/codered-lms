FROM node:20-alpine
WORKDIR /app

# 1) Копируем манифесты и ставим зависимости
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

# 2) Копируем весь исходник
COPY . .

# 3) Компилируем TS
RUN npm run build

# 4) Запускаем продакшен‑сервер
CMD ["node", "dist/main"]
