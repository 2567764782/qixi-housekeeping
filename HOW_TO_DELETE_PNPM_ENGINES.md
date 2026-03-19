# 📝 如何删除 GitHub package.json 中的 engines.pnpm 限制

## 第一步：访问 GitHub 仓库

**打开浏览器，访问**：
```
https://github.com/2567764782/qixi-housekeeping/blob/main/package.json
```

---

## 第二步：点击编辑按钮

1. **在文件内容上方，找到一支"铅笔"图标** ✏️
2. **点击铅笔图标，进入编辑模式**

---

## 第三步：找到 engines 字段

**查找类似以下内容**：
```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": ">=9.0.0"
}
```

---

## 第四步：删除 pnpm 限制

**修改前**：
```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": ">=9.0.0"
}
```

**修改后**：
```json
"engines": {
  "node": ">=18.0.0"
}
```

**注意**：
- 只保留 `"node": ">=18.0.0"`
- 删除 `"pnpm": ">=9.0.0"` 这一行
- 注意逗号，确保 JSON 格式正确

---

## 第五步：提交更改

1. **滚动到页面底部**
2. **在 "Commit changes" 输入框中输入**：
   ```
   fix: 删除 pnpm 版本限制
   ```
3. **点击绿色的 "Commit changes" 按钮**

---

## 第六步：确认提交成功

**页面会自动刷新，显示新的提交**

**确认文件内容已更新**

---

## 第七步：等待 Vercel 自动部署

**Vercel 会自动检测到更改并重新部署**

**或者手动触发**：
1. **Vercel Dashboard → Deployments**
2. **点击 "Redeploy"**

---

## 📋 完整的 package.json 示例

### 修改前：
```json
{
  "name": "coze-mini-program",
  "version": "1.0.0",
  "private": true,
  "description": "Coze Mini Program Application",
  "scripts": {
    ...
  },
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  },
  "packageManager": "pnpm@9.0.0",  // ← 删除这一行
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"  // ← 删除这一行
  },
  "pnpm": {
    ...
  }
}
```

### 修改后：
```json
{
  "name": "coze-mini-program",
  "version": "1.0.0",
  "private": true,
  "description": "Coze Mini Program Application",
  "scripts": {
    ...
  },
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  },
  "engines": {
    "node": ">=18.0.0"  // ← 只保留这一行
  },
  "pnpm": {
    ...
  }
}
```

---

## 🔍 注意事项

### JSON 格式检查

**确保删除后的 JSON 格式正确**：

#### ❌ 错误（有多余逗号）：
```json
"engines": {
  "node": ">=18.0.0",  // ← 最后一个元素不能有逗号
}
```

#### ✅ 正确：
```json
"engines": {
  "node": ">=18.0.0"  // ← 最后一个元素没有逗号
}
```

---

## 🎯 同时检查 packageManager 字段

**如果还有以下内容，也要删除**：
```json
"packageManager": "pnpm@9.0.0",  // ← 删除这一行
```

---

## 📞 完成后告诉我

**提交更改后，告诉我已经完成，我会帮你确认下一步！**
