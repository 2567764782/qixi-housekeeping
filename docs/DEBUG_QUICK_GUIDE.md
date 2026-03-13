# 🐛 前端调试快速指南

## 📍 在哪里调试

### 1. 微信开发者工具调试器（最常用）

**位置：** 微信开发者工具底部标签栏

```
┌─────────────────────────────────────────┐
│  模拟器  │  调试器  │  控制台  │  ...  │
│          ↑ 点击这里                       │
└─────────────────────────────────────────┘
```

**常用标签：**

| 标签 | 用途 |
|------|------|
| **Console** | 查看日志输出 |
| **Sources** | 查看源码、设置断点 |
| **Network** | 查看网络请求 |
| **Elements** | 查看页面元素 |
| **React** | 查看组件树和状态 |

### 2. 浏览器开发者工具（H5）

```bash
# 启动 H5 开发模式
pnpm dev:web
```

浏览器打开 http://localhost:5000

**快捷键：**
- `F12` - 打开开发者工具
- `Ctrl+Shift+I` - 打开开发者工具
- `Ctrl+Shift+J` - 直接打开 Console
- `F8` - 暂停/继续
- `F10` - 单步执行
- `F11` - 进入函数

### 3. 真机调试（vconsole）

```javascript
// 在控制台执行
localStorage.setItem('enableVConsole', 'true')
```

页面右下角会出现 vconsole 按钮。

---

## 🔍 如何调试

### 调试步骤：

1. **打开调试器**
   - 点击底部的「调试器」标签

2. **查看 Console**
   - 所有 `console.log` 都会显示在这里
   - 网络请求会自动打印

3. **设置断点**
   - 切换到「Sources」标签
   - 点击代码行号设置断点
   - 运行到断点时会暂停

4. **查看变量**
   - 暂停后，鼠标悬停在变量上查看值
   - 或在「Scope」面板查看所有变量

5. **查看网络请求**
   - 切换到「Network」标签
   - 查看所有请求
   - 点击请求查看详情

---

## 📝 常用调试代码

### 打印日志

```typescript
// 普通日志
console.log('普通日志')

// 对象日志
console.log('用户信息:', user)

// 带标识的日志
console.log('🔄 开始加载...')
console.log('✅ 加载成功')
console.log('❌ 加载失败:', error)

// 分组日志
console.group('订单详情')
console.log('订单ID:', orderId)
console.log('状态:', status)
console.groupEnd()
```

### 调试网络请求

```typescript
// 请求前打印
console.log('📡 请求配置:', {
  url: '/api/orders',
  method: 'GET',
  data: { userId: '123' }
})

// 响应后打印
console.log('📡 响应数据:', response.data)

// 错误处理
try {
  const res = await Network.request({ ... })
  console.log('✅ 请求成功:', res.data)
} catch (error) {
  console.error('❌ 请求失败:', error)
}
```

### 调试状态更新

```typescript
const [count, setCount] = useState(0)

useEffect(() => {
  console.log('✨ count 变化:', count)
}, [count])

const handleClick = () => {
  console.log('🔄 更新前:', count)
  setCount(count + 1)
  console.log('🔄 更新后:', count + 1)
}
```

### 调试路由跳转

```typescript
const handleNavigation = () => {
  const url = '/pages/detail/index?id=123'

  console.log('🔗 准备跳转到:', url)

  Taro.navigateTo({
    url,
    success: () => console.log('✅ 跳转成功'),
    fail: (err) => console.error('❌ 跳转失败:', err)
  })
}
```

---

## 🎯 调试技巧

### 1. 条件断点

在 Sources 中，右键点击行号 → 「Add conditional breakpoint」

```javascript
// 当 status === 'error' 时才暂停
status === 'error'
```

### 2. Logpoint（无侵入式日志）

右键点击行号 → 「Add logpoint」

```javascript
// 不暂停代码，只打印日志
'订单ID:', orderId
```

### 3. watch 监听变量

在调试器右侧「Watch」面板添加表达式：

```javascript
// 监控这些变量
orderId
status
user.name
```

### 4. Console 中调试

在 Console 中可以直接执行代码：

```javascript
// 查看全局变量
Taro.getStorageSync('token')

// 测试函数
testFunction()

// 修改状态
setCount(100)
```

---

## ❗ 常见问题

### 问题 1：页面白屏

**原因：**
- 组件渲染错误
- 数据未加载
- 路由配置错误

**解决方法：**
```typescript
// 添加错误边界
const ErrorBoundary = ({ children }) => {
  return <View>{children}</View>
}

// 检查数据加载
if (loading) return <Loading />
if (error) return <Error message={error} />
```

### 问题 2：网络请求失败

**检查清单：**
- [ ] 域名是否配置正确
- [ ] 是否关闭域名校验（开发时）
- [ ] 请求参数是否正确
- [ ] 后端接口是否正常

```typescript
// 调试网络请求
console.log('请求配置:', { url, method, data })
console.log('环境变量:', process.env)
```

### 问题 3：状态不更新

**检查清单：**
- [ ] 是否正确使用 `useState`
- [ ] 依赖数组是否正确
- [ ] 是否有异步问题

```typescript
// 调试状态更新
useEffect(() => {
  console.log('状态更新:', state)
}, [state])
```

### 问题 4：样式不生效

**检查清单：**
- [ ] 类名是否正确
- [ ] Tailwind 类名是否拼写正确
- [ ] 是否有优先级冲突

```typescript
// 调试样式
<View className="bg-red-500 p-4 debug-border">
  <Text>调试样式</Text>
</View>

/* 添加调试边框 */
.debug-border {
  border: 2px solid red;
}
```

---

## 🚀 快速调试工作流

```
1. 修改代码
   ↓
2. 保存文件（自动热更新）
   ↓
3. 打开微信开发者工具 → 调试器 → Console
   ↓
4. 查看日志输出
   ↓
5. 如有错误，根据错误信息修改代码
   ↓
6. 重复步骤 1-5
```

---

## 📱 真机调试

### 1. 扫码预览

```
微信开发者工具 → 点击「预览」→ 扫码
```

### 2. 启用 vconsole

```javascript
// 在控制台执行
localStorage.setItem('enableVConsole', 'true')
```

### 3. 查看真机日志

真机上的 vconsole 会显示：
- Console 日志
- Network 请求
- 页面元素
- Storage 数据

---

## 💡 调试最佳实践

### ✅ 推荐

1. **有意义的日志**
   ```typescript
   console.log('🔄 获取订单列表...')  // ✅
   console.log('loading...')          // ❌
   ```

2. **分组日志**
   ```typescript
   console.group('订单详情')
   console.log('ID:', orderId)
   console.log('状态:', status)
   console.groupEnd()
   ```

3. **错误处理**
   ```typescript
   try {
     await fetchData()
   } catch (error) {
     console.error('❌ 获取数据失败:', error)
     Taro.showToast({ title: '加载失败', icon: 'none' })
   }
   ```

### ❌ 不推荐

1. **删除所有 console**
   ```typescript
   // 不要删除，用注释标记
   // console.log('调试日志')
   ```

2. **alert 调试**
   ```typescript
   // 不要用 alert
   alert('调试信息')  // ❌
   console.log('调试信息')  // ✅
   ```

3. **硬编码调试代码**
   ```typescript
   // 使用环境变量
   if (process.env.NODE_ENV === 'development') {
     console.log('调试信息')
   }
   ```

---

## 📊 调速工具

### React DevTools

**位置：** 调试器 → React 标签

**功能：**
- 查看组件树
- 查看组件 Props
- 查看组件 State
- 查看 Hooks 状态

### Network 面板

**功能：**
- 查看所有网络请求
- 查看请求参数
- 查看响应数据
- 查看请求时间

### Storage 面板

**功能：**
- 查看本地存储
- 修改存储数据
- 清空存储

---

## 🎊 总结

**调试三步曲：**

1. **打开调试器**
   ```bash
   微信开发者工具 → 调试器
   ```

2. **添加日志**
   ```typescript
   console.log('🔄 开始加载...')
   console.log('✅ 加载成功:', data)
   console.error('❌ 加载失败:', error)
   ```

3. **查看输出**
   ```
   Console 标签 → 查看日志
   ```

**记住：**
- ✅ 善用 console.log
- ✅ 使用断点调试
- ✅ 查看网络请求
- ✅ 检查组件状态

**现在开始调试你的代码吧！** 🚀
