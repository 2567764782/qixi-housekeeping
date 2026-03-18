#!/bin/bash

echo "=========================================="
echo "📦 创建适合上传的压缩包"
echo "=========================================="
echo ""

# 进入项目根目录
cd /workspace/projects

# 创建临时目录
mkdir -p /tmp/upload-batch

# 复制核心文件（第一批）
echo "✅ 准备第一批核心文件..."
mkdir -p /tmp/upload-batch/batch1
cp package.json /tmp/upload-batch/batch1/
cp vercel.json /tmp/upload-batch/batch1/
cp tsconfig.json /tmp/upload-batch/batch1/
cp babel.config.js /tmp/upload-batch/batch1/
cp project.config.json /tmp/upload-batch/batch1/
cp src/app.tsx /tmp/upload-batch/batch1/
cp src/app.config.ts /tmp/upload-batch/batch1/
cp src/network.ts /tmp/upload-batch/batch1/
cp src/index.html /tmp/upload-batch/batch1/
cp src/app.css /tmp/upload-batch/batch1/

# 压缩 src 文件夹（第二批）
echo "✅ 压缩 src 文件夹..."
tar -czf /tmp/upload-batch/src.tar.gz src/

# 压缩 server 文件夹（第三批）
echo "✅ 压缩 server 文件夹..."
tar -czf /tmp/upload-batch/server.tar.gz server/

# 压缩 config 文件夹（第四批）
echo "✅ 压缩 config 文件夹..."
tar -czf /tmp/upload-batch/config.tar.gz config/

# 压缩 assets 文件夹（第五批）
echo "✅ 压缩 assets 文件夹..."
tar -czf /tmp/upload-batch/assets.tar.gz assets/

echo ""
echo "=========================================="
echo "✅ 打包完成！"
echo "=========================================="
echo ""
echo "文件位置：/tmp/upload-batch/"
echo ""
ls -lh /tmp/upload-batch/
echo ""
echo "=========================================="
echo ""
echo "📤 上传步骤："
echo ""
echo "第一批（核心文件）："
echo "  1. 打开 https://github.com/2567764782/qixi-housekeeping"
echo "  2. 点击 'uploading an existing file'"
echo "  3. 上传 batch1/ 文件夹里的所有文件"
echo "  4. 提交信息：'初始化核心文件'"
echo ""
echo "第二批（src 压缩包）："
echo "  5. 点击 'Add file' → 'Upload files'"
echo "  6. 上传 src.tar.gz"
echo "  7. 提交信息：'添加前端代码'"
echo ""
echo "第三批（server 压缩包）："
echo "  8. 点击 'Add file' → 'Upload files'"
echo "  9. 上传 server.tar.gz"
echo "  10. 提交信息：'添加后端代码'"
echo ""
echo "第四批（config 压缩包）："
echo "  11. 上传 config.tar.gz"
echo "  12. 提交信息：'添加配置文件'"
echo ""
echo "第五批（assets 压缩包）："
echo "  13. 上传 assets.tar.gz"
echo "  14. 提交信息：'添加静态资源'"
echo ""
echo "=========================================="
