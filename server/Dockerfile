# 使用 Node.js 18 官方镜像
FROM node:18-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile --prod=false

# 复制源代码
COPY . .

# 构建 NestJS 应用
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/src/main.js"]
