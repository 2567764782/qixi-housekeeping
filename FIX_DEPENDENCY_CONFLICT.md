# 🔧 解决依赖冲突问题

## 错误信息

```
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
npm error While resolving: coze-mini-program@1.0.0
npm error Found: miniprogram-ci@2.1.31
npm error Could not resolve dependency:
npm error peer miniprogram-ci@"^1.9.15" from @tarojs/plugin-mini-ci@4.1.11
```

---

## ⚠️ 问题原因

### 依赖版本冲突

1. **项目安装了**：
   - `miniprogram-ci@2.1.31`（2.x 版本）

2. **但插件要求**：
   - `@tarojs/plugin-mini-ci@4.1.11` 需要 `miniprogram-ci@^1.9.15`（1.x 版本）

3. **冲突**：
   - 2.x 版本和 1.x 版本不兼容
   - npm 无法解析依赖树

---

## ✅ 解决方案

### 方案：修改 Vercel 的 Install Command

#### 第一步：进入项目设置

1. 在 Vercel 项目页面
2. 点击左侧菜单的 **"Settings"**

---

#### 第二步：找到构建设置

1. 在 Settings 页面，点击左侧的 **"General"**
2. 向下滚动，找到 **"Build & Development Settings"** 部分

---

#### 第三步：修改 Install Command

找到 **"Install Command"** 设置：

**展开 Override（覆盖）选项**

**将命令改为**：
```
npm install --legacy-peer-deps
```

**或者使用 pnpm**：
```
pnpm install --no-frozen-lockfile
```

**说明**：
- `--legacy-peer-deps`：忽略 peer 依赖冲突，继续安装
- `--no-frozen-lockfile`：允许更新 lockfile

---

#### 第四步：保存设置

点击 **"Save"** 按钮保存更改

---

#### 第五步：重新部署

1. 点击左侧菜单的 **"Deployments"**
2. 找到失败的部署记录
3. 点击右侧的三个点 `...`
4. 选择 **"Redeploy"**

---

## 📋 详细操作步骤

### 在 Settings 页面

1. **找到 Build & Development Settings**
   ```
   Build Command: pnpm build:web
   Output Directory: dist-web
   Install Command: npm install ← 点击 Override 修改
   ```

2. **修改 Install Command**
   ```
   ✅ Enable Override
   Install Command: npm install --legacy-peer-deps
   ```

3. **点击 Save**

---

## 🎯 现在就开始

1. 点击左侧菜单的 **"Settings"**
2. 找到 **"Install Command"**
3. 修改为：`npm install --legacy-peer-deps`
4. 保存并重新部署

完成后告诉我结果！
