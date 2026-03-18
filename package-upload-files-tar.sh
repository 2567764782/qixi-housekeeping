#!/bin/bash

echo "=========================================="
echo "📦 正在打包项目文件..."
echo "=========================================="
echo ""

# 创建临时目录
TEMP_DIR="/tmp/qixi-housekeeping-upload"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# 复制需要上传的文件
echo "✅ 复制 src/ 文件夹..."
cp -r src/ $TEMP_DIR/

echo "✅ 复制 server/ 文件夹..."
cp -r server/ $TEMP_DIR/

echo "✅ 复制 config/ 文件夹..."
cp -r config/ $TEMP_DIR/

echo "✅ 复制 assets/ 文件夹..."
cp -r assets/ $TEMP_DIR/

echo "✅ 复制配置文件..."
cp package.json $TEMP_DIR/
cp vercel.json $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp babel.config.js $TEMP_DIR/
cp project.config.json $TEMP_DIR/

# 创建打包说明
cat > $TEMP_DIR/README.txt << 'EOF'
柒玺家政小程序项目上传指南
================================

这个文件夹包含了需要上传到 GitHub 的所有文件。

上传步骤：
1. 访问：https://github.com/2567764782/qixi-housekeeping
2. 点击 "uploading an existing file"
3. 把这个文件夹里的所有内容拖到浏览器窗口
4. 填写提交信息：初始化柒玺家政项目
5. 点击 "Commit changes"

文件说明：
- src/ - 前端源代码
- server/ - 后端源代码
- config/ - 项目配置
- assets/ - 静态资源
- package.json - 项目依赖配置
- vercel.json - Vercel 部署配置
- tsconfig.json - TypeScript 配置
EOF

# 打包成 tar.gz
echo ""
echo "📦 正在压缩..."
cd /tmp
tar -czf qixi-housekeeping-upload.tar.gz qixi-housekeeping-upload

# 显示文件信息
echo ""
echo "=========================================="
echo "✅ 打包完成！"
echo "=========================================="
echo ""
echo "压缩包位置：/tmp/qixi-housekeeping-upload.tar.gz"
ls -lh /tmp/qixi-housekeeping-upload.tar.gz
echo ""
echo "包含的文件："
tar -tzf /tmp/qixi-housekeeping-upload.tar.gz | head -30
echo ""
echo "总文件数："
tar -tzf /tmp/qixi-housekeeping-upload.tar.gz | wc -l
echo ""
echo "=========================================="
