# 📋 Application Preset 选择指南

## Application Preset 是什么？

这是让 Vercel 知道你的项目使用什么框架，以便正确配置构建和部署设置。

---

## ✅ 对于后端项目应该怎么选？

### 选项列表（通常会有这些）

你可能看到以下选项：

1. **Next.js** - 前端框架
2. **React** - 前端框架
3. **Vue** - 前端框架
4. **Nuxt** - 前端框架
5. **Express** - 后端框架
6. **NestJS** - 后端框架 ← 优先选择
7. **Other** - 其他 ← 如果没有 NestJS 就选这个

---

## 🎯 推荐选择

### 第一步：查看是否有 NestJS

**如果你看到 "NestJS" 选项**：
```
✅ 选择 NestJS
```

**如果没有 NestJS 选项**：
```
✅ 选择 Other
```

**或者如果看到 Express**：
```
✅ 也可以选择 Express（NestJS 基于 Express）
```

---

## ⚠️ 不要选择的选项

❌ **不要选择 Next.js** - 这是前端框架
❌ **不要选择 React** - 这是前端框架
❌ **不要选择 Vue** - 这是前端框架

---

## 📝 为什么选择 Other 或 NestJS？

- 后端项目使用 NestJS 框架
- Vercel 会自动检测项目配置
- 选择 Other 可以让 Vercel 使用默认配置

---

## 🎯 总结

**最简单的选择方法**：
- 如果有 **NestJS** → 选 **NestJS**
- 如果没有 → 选 **Other**

---

## 📞 如果还有疑问

告诉我你看到了哪些选项，我会帮你选择正确的！

或者截图给我看，我会具体指导你！
