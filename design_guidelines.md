# 柒玺家政小程序设计指南

## 品牌定位

- **应用名称**：柒玺家政
- **应用类型**：生活服务类小程序
- **设计风格**：简洁、专业、可信赖
- **目标用户**：需要家政服务的家庭用户
- **核心价值**：专业、便捷、透明

## 配色方案

### 主色板（绿色系 - 代表专业与信任）

| 用途 | Tailwind 类名 | 颜色值 | 说明 |
|------|--------------|--------|------|
| 主色 | `bg-emerald-500` | #10B981 | 品牌主色，用于主按钮、重点强调 |
| 主色浅 | `bg-emerald-50` | #ECFDF5 | 背景色、卡片背景 |
| 主色深 | `bg-emerald-600` | #059669 | 按钮按下态 |

### 中性色

| 用途 | Tailwind 类名 | 颜色值 | 说明 |
|------|--------------|--------|------|
| 标题文字 | `text-gray-800` | #1F2937 | 页面标题 |
| 正文文字 | `text-gray-600` | #4B5563 | 正文内容 |
| 次要文字 | `text-gray-400` | #9CA3AF | 描述、提示 |
| 边框 | `border-gray-100` | #F3F4F6 | 卡片边框 |
| 分割线 | `border-gray-200` | #E5E7EB | 分割线 |

### 语义色

| 用途 | Tailwind 类名 | 颜色值 | 说明 |
|------|--------------|--------|------|
| 成功 | `bg-green-500` | #22C55E | 完成状态 |
| 警告 | `bg-orange-500` | #F97316 | 进行中状态 |
| 错误 | `bg-red-500` | #EF4444 | 取消状态 |
| 信息 | `bg-blue-500` | #3B82F6 | 链接、提示 |

## 字体规范

| 层级 | Tailwind 类名 | 字号 | 用途 |
|------|--------------|------|------|
| H1 | `text-xl font-bold` | 20px | 页面标题 |
| H2 | `text-lg font-bold` | 18px | 模块标题 |
| H3 | `text-base font-semibold` | 16px | 卡片标题 |
| Body | `text-sm` | 14px | 正文内容 |
| Caption | `text-xs` | 12px | 辅助说明 |

## 间距系统

| 用途 | Tailwind 类名 | 数值 |
|------|--------------|------|
| 页面边距 | `px-4` | 16px |
| 卡片内边距 | `p-4` | 16px |
| 组件间距 | `gap-3` | 12px |
| 列表项间距 | `mb-4` | 16px |

## 组件规范

### 主按钮

```tsx
<View className="w-full bg-emerald-500 text-white text-center py-3 rounded-xl font-medium">
  立即预约
</View>
```

### 次按钮

```tsx
<View className="w-full bg-white border border-emerald-500 text-emerald-500 text-center py-3 rounded-xl font-medium">
  取消
</View>
```

### 服务卡片

```tsx
<View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
  <View className="flex flex-row items-center">
    <View className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
      <Sparkles size={24} color="#fff" />
    </View>
    <View className="ml-3 flex-1">
      <Text className="block text-base font-semibold text-gray-800">日常保洁</Text>
      <Text className="block text-sm text-gray-500 mt-1">地面清洁、桌面整理...</Text>
    </View>
    <Text className="text-emerald-500 font-semibold">50元/小时</Text>
  </View>
</View>
```

### 订单状态标签

```tsx
// 待上门
<View className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">待上门</View>
// 已完成
<View className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs">已完成</View>
// 已取消
<View className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">已取消</View>
```

## 导航结构

### TabBar 配置

| 页面 | 文本 | 图标 |
|------|------|------|
| pages/index/index | 首页 | house |
| pages/orders/index | 我的预约 | file-text |
| pages/profile/index | 我的 | user |

### 页面路由

- 首页 → 服务详情：`/pages/service-detail/index?id=xxx`
- 服务详情 → 在线预约：`/pages/booking/index?serviceId=xxx`
- 首页 → 我的预约：`switchTab /pages/orders/index`
- 首页 → 个人中心：`switchTab /pages/profile/index`
- 个人中心 → 联系我们：`/pages/contact/index`
- 个人中心 → 关于我们：`/pages/about/index`
- 个人中心 → 隐私政策：`/pages/privacy/index`
- 个人中心 → 用户协议：`/pages/terms/index`

## 轮播图规范

- 尺寸：宽度 100%，高度约 160px
- 圆角：rounded-2xl (16px)
- 间距：mb-4 (16px)
- 自动播放：是
- 指示器：显示

## 小程序约束

- 包体积：主包不超过 2MB
- 图片策略：使用 CDN 加载轮播图，本地只保留 TabBar 图标
- 性能优化：列表使用虚拟滚动，图片懒加载

## 服务列表数据

```typescript
const services = [
  { id: '1', name: '日常保洁', price: '50元/小时', duration: '2小时起', icon: 'Sparkles' },
  { id: '2', name: '深度保洁', price: '100元/小时', duration: '4小时起', icon: 'Sparkles' },
  { id: '3', name: '新居开荒', price: '8元/平米', duration: '全天', icon: 'Home' },
  { id: '4', name: '家电清洗', price: '80元/台起', duration: '1-2小时', icon: 'Tv' },
  { id: '5', name: '收纳整理', price: '200元/次', duration: '3小时起', icon: 'LayoutGrid' },
]
```
