# ==========================================
# Estágio 1: Build da aplicação
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifestos de dependência
COPY package*.json ./

# Instala todas as dependências necessárias para o build
RUN npm ci

# Copia os arquivos do projeto
COPY . .

# Compila o frontend e o servidor
RUN npm run build

# ==========================================
# Estágio 2: Imagem de produção ultraleve
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Instala apenas dependências de produção para economizar memória e espaço
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copia os arquivos compilados e dados necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY --from=builder /app/assets ./assets

# Expõe a porta 3000
EXPOSE 3000

# Inicia o servidor Node.js diretamente (Sem PM2, ultraleve, ~40MB RAM)
CMD ["node", "dist/server.cjs"]
