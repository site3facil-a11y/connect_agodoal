# ==========================================
# Estágio 1: Build da aplicação (Node 20 Alpine)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os manifestos de dependência primeiro para cache eficiente
COPY package*.json ./

# Instala todas as dependências com flags otimizadas para baixo consumo de CPU/RAM
RUN npm install --no-audit --no-fund

# Copia os arquivos de código do projeto
COPY . .

# Compila o frontend (dist/) e o bundle do servidor (dist/server.cjs)
RUN npm run build

# Remove as devDependencies do node_modules para que o runner receba apenas produção
RUN npm prune --omit=dev --no-audit --no-fund && npm cache clean --force

# ==========================================
# Estágio 2: Imagem final de execução ultraleve
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia os manifestos e o node_modules pronto do builder (SEM fazer novo download da internet!)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copia os artefatos compilados e arquivos públicos
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/assets ./assets
RUN mkdir -p /app/data

# Expõe a porta 3000
EXPOSE 3000

# Inicia o servidor Node.js de produção
CMD ["node", "dist/server.cjs"]
