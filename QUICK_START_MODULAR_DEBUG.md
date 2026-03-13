# 🚀 快速开始小抄

## 📋 前端模块化 & 调试快速参考

### 一键创建模块

```bash
bash scripts/create-module.sh
```

**创建选项：**
- 1. 创建组件（Component）
- 2. 创建页面（Page）
- 3. 创建 Hook
- 4. 创建服务层（Service）
- 5. 查看项目结构

---

## 📍 在哪里调试

### 微信开发者工具

```
位置：底部「调试器」标签
```

| 标签 | 用途 |
|------|------|
| Console | 查看日志 |
| Sources | 查看源码、断点 |
| Network | 网络请求 |
| Elements | 页面元素 |
| React | 组件树、状态 |

### 浏览器 DevTools（H5）

```bash
# 启动 H5
pnpm dev:web

# 快捷键
F12  # 打开开发者工具
Ctrl+Shift+J  # 打开 Console
```

### 真机调试

```javascript
// 启用 vconsole
localStorage.setItem('enableVConsole', 'true')
```

---

## 🔍 常用调试代码

### 打印日志

```typescript
console.log('🔄 开始加载...')
console.log('✅ 加载成功:', data)
console.error('❌ 加载失败:', error)

// 分组日志
console.group('订单详情')
console.log('ID:', orderId)
console.log('状态:', status)
console.groupEnd()
```

### 网络请求调试

```typescript
const fetchData = async () => {
  console.log('📡 请求配置:', { url, method, data })

  try {
    const res = await Network.request({ ... })
    console.log('✅ 响应数据:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ 请求失败:', error)
    throw error
  }
}
```

### 状态调试

```typescript
const [count, setCount] = useState(0)

useEffect(() => {
  console.log('✨ count 变化:', count)
}, [count])
```

### 路由调试

```typescript
const handleNavigation = (id: string) => {
  const url = `/pages/detail/index?id=${id}`
  console.log('🔗 跳转到:', url)

  Taro.navigateTo({
    url,
    success: () => console.log('✅ 跳转成功'),
    fail: (err) => console.error('❌ 跳转失败:', err)
  })
}
```

---

## 📦 模块化结构

```
src/
├── components/    # 可复用组件
│   ├── OrderCard/
│   └── ServiceCard/
├── hooks/         # 自定义 Hooks
│   └── useOrders.ts
├── services/      # 服务层
│   └── orders.service.ts
└── pages/         # 页面
    ├── index/
    └── orders/
```

---

## 🎯 快速创建组件

```bash
# 1. 运行创建工具
bash scripts/create-module.sh

# 2. 选择 1. 创建组件

# 3. 输入组件名称：OrderCard

# 4. 组件自动生成在：
#    src/components/OrderCard/
```

### 使用组件

```typescript
// 导入组件
import { OrderCard } from '@/components/OrderCard'

// 使用组件
<OrderCard
  id="123"
  serviceName="日常保洁"
  status="pending"
  date="2024-01-15"
  price="88元"
  onClick={() => handleDetail('123')}
/>
```

---

## 🐛 常见问题

### 问题 1：白屏

```typescript
// 添加加载状态
if (loading) return <Loading />
if (error) return <Error message={error.message} />
if (!data) return <Empty />
```

### 问题 2：网络请求失败

```typescript
// 检查请求配置
console.log('🔍 请求配置:', {
  url: '/api/orders',
  baseURL: process.env.PROJECT_DOMAIN
})

// 检查是否关闭域名校验
// 微信开发者工具 → 详情 → 本地设置 → 勾选「不校验合法域名」
```

### 问题 3：状态不更新

```typescript
// 检查状态更新
useEffect(() => {
  console.log('🔄 状态更新:', state)
}, [state])

// 正确更新
setState(prev => ({ ...prev, count: prev.count + 1 }))
```

---

## 🔧 调试快捷键

### 微信开发者工具

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+S` | 保存文件 |
| `Ctrl+R` | 刷新页面 |
| `F12` | 打开调试器 |

### 浏览器 DevTools

| 快捷键 | 功能 |
|--------|------|
| `F12` | 打开开发者工具 |
| `Ctrl+Shift+J` | 打开 Console |
| `F8` | 暂停/继续 |
| `F10` | 单步执行 |
| `F11` | 进入函数 |

---

## 💡 最佳实践

### ✅ 推荐

```typescript
// 1. 有意义的日志
console.log('🔄 获取订单列表...')

// 2. 错误处理
try {
  await fetchData()
} catch (error) {
  console.error('❌ 获取失败:', error)
  Taro.showToast({ title: '加载失败' })
}

// 3. 条件日志
if (process.env.NODE_ENV === 'development') {
  console.log('调试信息')
}
```

### ❌ 不推荐

```typescript
// 1. 删除日志
// console.log('调试')  // ❌ 删除

// 2. 用 alert
alert('调试信息')  // ❌

// 3. 硬编码
const url = 'http://localhost:3000'  // ❌
```

---

## 📚 完整文档

- 📖 [前端模块化完整指南](docs/FRONTEND_MODULAR_DEBUG.md)
- 🐛 [调试快速指南](docs/DEBUG_QUICK_GUIDE.md)
- 📋 [调试小抄](docs/DEBUG_CHEATSHEET.md)
- 🔧 [创建模块工具](scripts/create-module.sh)

---

## 🆘 遇到问题？

### 检查清单

- [ ] Console 有错误吗？
- [ ] Network 请求成功吗？
- [ ] 组件 Props 正确吗？
- [ ] 状态更新了吗？

### 常用检查命令

```typescript
// 检查环境
console.log('🔍 环境:', process.env.NODE_ENV)
console.log('🔍 域名:', process.env.PROJECT_DOMAIN)

// 检查用户
console.log('🔍 用户:', Taro.getStorageSync('userInfo'))

// 检查网络
console.log('🔍 网络:', await Taro.getNetworkType())
```

---

**记住：遇到问题先看 Console！** 🎯

**现在开始创建模块和调试代码吧！** 🚀
