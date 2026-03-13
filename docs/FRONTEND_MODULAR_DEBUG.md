# 前端模块化与调试完整指南

## 📦 一、前端页面模块化

### 当前项目结构

```
src/
├── pages/              # 页面目录
│   ├── index/          # 首页
│   ├── booking/        # 预约页
│   ├── orders/         # 订单页
│   ├── profile/        # 个人中心
│   └── ...
├── app.config.ts      # 应用配置
├── app.tsx            # 应用入口
└── network.ts         # 网络请求封装
```

### 1.1 页面级模块化（已有）

每个页面都是独立模块：

```
pages/
├── index/
│   ├── index.tsx      # 页面组件
│   ├── index.config.ts # 页面配置
│   └── index.css      # 页面样式
├── booking/
│   ├── index.tsx
│   ├── index.config.ts
│   └── index.css
```

### 1.2 组件级模块化（推荐创建）

创建可复用组件：

```
src/
├── components/        # 新建组件目录
│   ├── Card/          # 卡片组件
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   └── index.css
│   ├── Button/        # 按钮组件
│   │   ├── index.tsx
│   │   └── index.css
│   ├── OrderCard/     # 订单卡片
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   └── index.css
│   └── ServiceCard/   # 服务卡片
│       ├── index.tsx
│       ├── types.ts
│       └── index.css
```

### 1.3 业务模块化（高级）

按业务功能组织：

```
src/
├── modules/           # 业务模块
│   ├── booking/       # 预约模块
│   │   ├── components/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── ServiceSelector.tsx
│   │   │   └── TimePicker.tsx
│   │   ├── hooks/
│   │   │   └── useBooking.ts
│   │   └── services/
│   │       └── booking.service.ts
│   └── orders/        # 订单模块
│       ├── components/
│       │   ├── OrderList.tsx
│       │   ├── OrderCard.tsx
│       │   └── OrderFilter.tsx
│       ├── hooks/
│       │   └── useOrders.ts
│       └── services/
│           └── orders.service.ts
```

---

## 🔧 二、如何创建可复用组件

### 示例 1：创建订单卡片组件

```typescript
// src/components/OrderCard/index.tsx
import { View, Text, Image } from '@tarojs/components'
import { FC } from 'react'
import './index.css'

interface OrderCardProps {
  id: string
  serviceName: string
  status: string
  date: string
  price: string
  onClick?: () => void
}

export const OrderCard: FC<OrderCardProps> = ({
  id,
  serviceName,
  status,
  date,
  price,
  onClick
}) => {
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'text-yellow-600',
      confirmed: 'text-blue-600',
      completed: 'text-green-600',
      cancelled: 'text-red-600'
    }
    return statusColors[status] || 'text-gray-600'
  }

  return (
    <View className="order-card bg-white rounded-lg p-4 mb-4 shadow-sm" onClick={onClick}>
      <View className="flex justify-between items-start mb-2">
        <Text className="text-lg font-semibold">{serviceName}</Text>
        <Text className={`text-sm ${getStatusColor(status)}`}>{status}</Text>
      </View>
      <View className="flex justify-between items-center">
        <Text className="text-sm text-gray-500">{date}</Text>
        <Text className="text-lg font-bold text-green-600">{price}</Text>
      </View>
    </View>
  )
}

export default OrderCard
```

```css
/* src/components/OrderCard/index.css */
.order-card {
  transition: all 0.3s ease;
}

.order-card:active {
  transform: scale(0.98);
}
```

### 使用组件

```typescript
// src/pages/orders/index.tsx
import { OrderCard } from '@/components/OrderCard'

const OrdersPage = () => {
  const orders = [
    { id: '1', serviceName: '日常保洁', status: 'pending', date: '2024-01-15', price: '88元' },
    { id: '2', serviceName: '深度保洁', status: 'completed', date: '2024-01-10', price: '258元' }
  ]

  return (
    <View className="p-4">
      {orders.map(order => (
        <OrderCard
          key={order.id}
          {...order}
          onClick={() => Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` })}
        />
      ))}
    </View>
  )
}
```

### 示例 2：创建自定义 Hook

```typescript
// src/hooks/useOrders.ts
import { useState, useEffect } from 'react'
import { Network } from '@/network'

export const useOrders = (userId: string) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await Network.request({
        url: '/api/orders/user/' + userId,
        method: 'GET'
      })
      setOrders(res.data.data)
    } catch (err: any) {
      setError(err.message || '获取订单失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [userId])

  return { orders, loading, error, refresh: fetchOrders }
}
```

使用 Hook：

```typescript
// src/pages/orders/index.tsx
import { useOrders } from '@/hooks/useOrders'

const OrdersPage = () => {
  const userId = Taro.getStorageSync('userId')
  const { orders, loading, error, refresh } = useOrders(userId)

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <View className="p-4">
      {orders.map(order => (
        <OrderCard key={order.id} {...order} />
      ))}
    </View>
  )
}
```

---

## 🐛 三、调试指南

### 3.1 前端调试方法

#### 方法 1：微信开发者工具调试（推荐）

**步骤：**

1. **打开调试器**
   - 微信开发者工具底部有「调试器」标签
   - 点击切换到「调试器」

2. **查看 Console**
   - 所有 `console.log` 都会显示在这里
   - 包括网络请求的打印

3. **断点调试**
   - 点击代码行号设置断点
   - 运行到断点时会暂停
   - 可以查看变量值

4. **查看网络请求**
   - 切换到「Network」标签
   - 查看所有请求
   - 查看请求参数和响应

5. **查看元素**
   - 切换到「Elements」标签
   - 查看页面结构
   - 查看样式

#### 方法 2：浏览器调试（H5）

```bash
# 启动 H5 开发模式
pnpm dev:web
```

然后在浏览器中打开 http://localhost:5000

**浏览器快捷键：**
- `F12` 或 `Ctrl+Shift+I`：打开开发者工具
- `Ctrl+Shift+J`：直接打开 Console
- `F8`：暂停/继续
- `F10`：单步执行
- `F11`：进入函数

#### 方法 3：vconsole 调试（真机）

项目已集成 vconsole，在真机上也能调试！

**启用方法：**

```javascript
// 在控制台执行
localStorage.setItem('enableVConsole', 'true')
```

然后在页面右下角会出现 vconsole 按钮，点击即可查看调试信息。

### 3.2 网络请求调试

项目已配置网络请求自动打印，包括：

```typescript
// 所有网络请求都会打印
console.log('📡 Request:', {
  url: '/api/orders',
  method: 'GET',
  params: { userId: '123' },
  headers: { Authorization: 'Bearer xxx' }
})

console.log('📡 Response:', {
  status: 200,
  data: { orders: [...] }
})
```

### 3.3 React DevTools

微信开发者工具已内置 React DevTools，可以查看：

- 组件树
- 组件 Props
- 组件 State
- Hooks 状态

**位置：**
- 调试器 → React 标签

---

## 📱 四、调试技巧

### 4.1 快速查看组件状态

```typescript
import { useEffect } from 'react'

const MyComponent = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('📊 组件状态:', { count })
  }, [count])

  return <View>{count}</View>
}
```

### 4.2 调试网络请求

```typescript
const fetchOrders = async () => {
  console.log('🔄 开始获取订单...')

  try {
    const res = await Network.request({
      url: '/api/orders',
      method: 'GET'
    })

    console.log('✅ 获取成功:', res.data)
    return res.data
  } catch (error) {
    console.error('❌ 获取失败:', error)
    throw error
  }
}
```

### 4.3 调试路由跳转

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

### 4.4 调试状态更新

```typescript
const [user, setUser] = useState(null)

const updateUser = (newUser) => {
  console.log('🔄 更新前:', user)
  setUser(newUser)
  console.log('🔄 更新后:', newUser)
}

useEffect(() => {
  console.log('✨ user 状态变化:', user)
}, [user])
```

---

## 🎯 五、模块化最佳实践

### 5.1 组件命名规范

- **页面组件**：`{PageName}Page`
- **业务组件**：`{ComponentName}`
- **通用组件**：`Base{ComponentName}`

示例：
```typescript
// 页面组件
export const OrdersPage = () => { ... }

// 业务组件
export const OrderCard = () => { ... }

// 通用组件
export const BaseButton = () => { ... }
```

### 5.2 文件组织规范

```
components/
├── OrderCard/
│   ├── index.tsx        # 组件代码
│   ├── types.ts         # 类型定义
│   ├── index.test.tsx   # 测试文件
│   └── index.css        # 样式
```

### 5.3 Props 类型定义

```typescript
// types.ts
export interface OrderCardProps {
  id: string
  serviceName: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  date: string
  price: string
  onClick?: () => void
}

// index.tsx
import type { OrderCardProps } from './types'

export const OrderCard: FC<OrderCardProps> = ({ ... }) => { ... }
```

### 5.4 按需导出

```typescript
// 导出默认组件
export default OrderCard

// 导出类型
export type { OrderCardProps }

// 导出子组件
export { OrderCardHeader } from './OrderCardHeader'
```

---

## 💡 六、常见调试问题

### Q1: 页面白屏怎么办？

**A:** 查看调试器 Console，通常有以下原因：
- 组件渲染错误
- 数据未加载
- 路由配置错误

```typescript
// 添加错误边界
const ErrorBoundary = ({ children }) => {
  return <View>{children}</View>
}
```

### Q2: 网络请求失败？

**A:** 检查以下几点：
- 域名是否配置正确
- 是否关闭域名校验（开发时）
- 请求参数是否正确

```typescript
// 检查网络请求
console.log('请求配置:', {
  url,
  method,
  data
})
```

### Q3: 状态不更新？

**A:** 检查：
- 是否正确使用 `useState`
- 依赖数组是否正确
- 是否有异步问题

```typescript
// 调试状态更新
useEffect(() => {
  console.log('状态更新:', state)
}, [state])
```

---

## 📚 七、推荐工具

### 开发工具
- **微信开发者工具**：调试小程序
- **VS Code**：代码编辑
- **React DevTools**：查看组件状态

### 插件推荐
- **ESLint**：代码检查
- **Prettier**：代码格式化
- **GitLens**：Git 增强

---

## 🎊 总结

### 模块化建议：
1. ✅ 创建 `components/` 目录存放可复用组件
2. ✅ 创建 `hooks/` 目录存放自定义 Hooks
3. ✅ 按业务功能组织代码
4. ✅ 统一命名规范

### 调试建议：
1. ✅ 微信开发者工具调试器
2. ✅ 使用 console.log 打印信息
3. ✅ 利用 React DevTools 查看状态
4. ✅ 真机使用 vconsole

**现在开始模块化你的项目吧！** 🚀
