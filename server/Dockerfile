# 多阶段构建

# 阶段 1: 构建
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@8

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 阶段 2: 运行
FROM node:20-alpine AS runner

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@8

# 复制 package 文件
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist

# 复制其他必要文件
COPY .env.example .env

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 修改权限
RUN chown -R nodejs:nodejs /app

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

# 启动应用
CMD ["node", "dist/main"]
