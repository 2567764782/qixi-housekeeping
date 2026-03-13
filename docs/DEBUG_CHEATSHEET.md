# 📋 调试小抄（打印出来备用）

## 🔍 调试位置速查

| 调试方式 | 位置 | 适用场景 |
|---------|------|---------|
| **微信开发者工具** | 底部「调试器」标签 | 小程序调试 |
| **浏览器 DevTools** | F12 / Ctrl+Shift+I | H5 调试 |
| **vconsole** | 真机右下角按钮 | 真机调试 |

---

## 🎨 常用 console 命令

```typescript
// 基础日志
console.log('普通日志')
console.info('信息日志')
console.warn('警告日志')
console.error('错误日志')

// 对象日志
console.log('用户:', user)
console.log('订单:', order)

// 表格日志
console.table(orders)

// 分组日志
console.group('订单详情')
console.log('ID:', orderId)
console.log('状态:', status)
console.groupEnd()

// 计时
console.time('加载')
// ... 代码 ...
console.timeEnd('加载')

// 堆栈跟踪
console.trace('追踪调用')

// 清空控制台
console.clear()
```

---

## 🌐 网络请求调试

```typescript
// 完整请求调试
const fetchOrders = async () => {
  console.log('📡 开始请求...')

  try {
    const res = await Network.request({
      url: '/api/orders',
      method: 'GET',
      data: { userId: '123' }
    })

    console.log('✅ 请求成功:', res.data)
    console.log('📊 响应状态:', res.statusCode)
    return res.data
  } catch (error) {
    console.error('❌ 请求失败:', error)
    console.error('🔍 错误详情:', error.response?.data)
    throw error
  }
}
```

---

## 🔄 状态更新调试

```typescript
// 监听状态变化
const [count, setCount] = useState(0)

useEffect(() => {
  console.log('✨ count 变化:', count)
}, [count])

// 调试更新过程
const updateCount = () => {
  console.log('🔄 更新前:', count)
  setCount(count + 1)
  console.log('🔄 更新后:', count + 1)
}
```

---

## 🔗 路由跳转调试

```typescript
// 导航调试
const handleNavigation = (id: string) => {
  const url = `/pages/detail/index?id=${id}`

  console.log('🔗 准备跳转到:', url)

  Taro.navigateTo({
    url,
    success: () => {
      console.log('✅ 跳转成功')
    },
    fail: (err) => {
      console.error('❌ 跳转失败:', err)
      console.error('错误码:', err.errno)
      console.error('错误信息:', err.errMsg)
    }
  })
}
```

---

## 🐛 常见错误及解决

### 错误 1：白屏

```typescript
// 添加错误边界和加载状态
const MyPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
      .catch(err => {
        console.error('❌ 加载失败:', err)
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error.message} />
  if (!data) return <Empty />

  return <Content />
}
```

### 错误 2：网络请求 404

```typescript
// 检查请求配置
console.log('🔍 请求配置:', {
  url: '/api/orders',
  baseURL: process.env.PROJECT_DOMAIN,
  fullURL: `${process.env.PROJECT_DOMAIN}/api/orders`
})

// 检查后端是否启动
console.log('🔍 后端状态:', {
  isRunning: isBackendRunning(),
  url: 'http://localhost:3000'
})
```

### 错误 3：状态不更新

```typescript
// 检查状态更新
const [state, setState] = useState({ count: 0 })

useEffect(() => {
  console.log('🔄 状态更新:', state)
}, [state])

// 正确更新
setState(prev => ({ ...prev, count: prev.count + 1 }))

// 错误更新（不会触发更新）
state.count += 1
```

---

## 🛠️ 调试快捷键

### 微信开发者工具

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+S` | 保存文件 |
| `Ctrl+R` | 刷新页面 |
| `Ctrl+Shift+R` | 强制刷新 |
| `F12` | 打开调试器 |
| `Ctrl+Shift+I` | 打开调试器 |

### 浏览器 DevTools

| 快捷键 | 功能 |
|--------|------|
| `F12` | 打开开发者工具 |
| `Ctrl+Shift+I` | 打开开发者工具 |
| `Ctrl+Shift+J` | 打开 Console |
| `Ctrl+Shift+C` | 元素选择器 |
| `F8` | 暂停/继续 |
| `F10` | 单步执行 |
| `F11` | 进入函数 |
| `Shift+F11` | 跳出函数 |

---

## 📊 React DevTools

### 查看组件树

```
调试器 → React 标签 → Components 面板
```

**功能：**
- 查看组件层级
- 选择组件查看 Props
- 选择组件查看 State
- 查看 Hooks 状态

### 查看性能

```
调试器 → React 标签 → Profiler 面板
```

**功能：**
- 记录组件渲染
- 查看渲染次数
- 查看渲染时间

---

## 🔧 调试技巧

### 1. 条件日志

```typescript
// 只在开发环境打印
if (process.env.NODE_ENV === 'development') {
  console.log('调试信息')
}

// 条件打印
data.length > 0 && console.log('有数据:', data)
```

### 2. 对象美化

```typescript
// 格式化输出
console.log(JSON.stringify(data, null, 2))

// 表格输出
console.table(data)

// 树形输出
console.dir(data)
```

### 3. 性能监控

```typescript
console.time('加载')
await loadData()
console.timeEnd('加载')
```

### 4. 内存监控

```typescript
console.log('内存使用:', performance.memory)
```

---

## 🚀 模块化创建命令

```bash
# 运行创建工具
bash scripts/create-module.sh

# 创建选项：
# 1. 创建组件
# 2. 创建页面
# 3. 创建 Hook
# 4. 创建服务层
# 5. 查看项目结构
```

---

## 📱 真机调试

### 启用 vconsole

```javascript
localStorage.setItem('enableVConsole', 'true')
```

### vconsole 功能

| 标签 | 功能 |
|------|------|
| **Console** | 查看日志 |
| **System** | 系统信息 |
| **Network** | 网络请求 |
| **Elements** | 页面元素 |
| **Storage** | 本地存储 |

---

## 🔍 常用调试代码片段

### 检查网络连接

```typescript
const checkNetwork = async () => {
  const networkType = await Taro.getNetworkType()
  console.log('📶 网络类型:', networkType.networkType)
  console.log('📶 网络类型:', networkType)
}
```

### 检查存储数据

```typescript
console.log('💾 Token:', Taro.getStorageSync('token'))
console.log('💾 用户:', Taro.getStorageSync('userInfo'))
console.log('💾 所有存储:', Taro.getStorageInfoSync())
```

### 检查环境信息

```typescript
console.log('📱 平台:', Taro.getEnv())
console.log('📱 系统信息:', await Taro.getSystemInfo())
console.log('📱 版本信息:', await Taro.getAppBaseInfo())
```

---

## 💡 调试流程

```
1. 发现问题
   ↓
2. 添加日志
   console.log('🔄 开始...')
   ↓
3. 保存代码
   Ctrl+S
   ↓
4. 查看输出
   调试器 → Console
   ↓
5. 分析问题
   根据日志信息
   ↓
6. 修复问题
   修改代码
   ↓
7. 验证修复
   重复步骤 2-6
```

---

## 🆘 遇到问题？

### 检查清单

- [ ] Console 有错误吗？
- [ ] Network 请求成功吗？
- [ ] 组件 Props 正确吗？
- [ ] 状态更新了吗？
- [ ] 路由正确吗？
- [ ] 样式加载了吗？

### 常用检查命令

```typescript
// 检查环境
console.log('🔍 环境:', process.env.NODE_ENV)
console.log('🔍 域名:', process.env.PROJECT_DOMAIN)

// 检查用户
console.log('🔍 用户:', Taro.getStorageSync('userInfo'))

// 检查 Token
console.log('🔍 Token:', Taro.getStorageSync('token'))

// 检查网络
console.log('🔍 网络:', await Taro.getNetworkType())
```

---

## 📚 更多帮助

- 📖 [完整调试指南](docs/FRONTEND_MODULAR_DEBUG.md)
- 🚀 [快速调试指南](docs/DEBUG_QUICK_GUIDE.md)
- 🎯 [模块化指南](docs/FRONTEND_MODULAR_DEBUG.md#一前端页面模块化)
- 🔧 [创建模块工具](scripts/create-module.sh)

---

**记住：遇到问题先看 Console！** 🎯
