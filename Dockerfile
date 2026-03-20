FROM node:20-alpine

# Corrige problema do Prisma (OpenSSL)
RUN apk add --no-cache openssl

# Criar usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copiar dependências primeiro (cache)
COPY package*.json ./
RUN npm install

# Copiar restante do projeto
COPY . .

# Ajustar permissões (ESSENCIAL com Podman)
RUN chown -R appuser:appgroup /app

# Trocar para usuário seguro
USER appuser

EXPOSE 3000

CMD ["npm", "run", "dev"]
