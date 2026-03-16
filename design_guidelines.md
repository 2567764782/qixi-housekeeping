# 柒玺家政小程序设计指南

> 设计灵感来源：参考 design006.com 的设计风格、色彩系统和布局理念

## 品牌定位

- **应用名称**：柒玺家政
- **应用类型**：生活服务类小程序
- **设计风格**：简洁、专业、现代、活力
- **目标用户**：需要家政服务的家庭用户
- **核心价值**：专业、便捷、透明、可信赖

---

## 一、配色方案

### 1.1 主色板（活力红色系 - 代表热情与服务）

| 用途 | Tailwind 类名 | 颜色值 | 说明 |
|------|--------------|--------|------|
| 品牌主色 | `bg-[#F85659]` | #F85659 | 主按钮、重点强调、品牌标识 |
| 主色浅 | `bg-red-50` | #FEF2F2 | 背景色、标签背景 |
| 主色深 | `bg-red-600` | #DC2626 | 按钮按下态 |

### 1.2 中性色

| 用途 | Tailwind 类名 | 颜色值 | 说明 |
|------|--------------|--------|------|
| 页面背景 | `bg-[#f5f5f5]` | #F5F5F5 | 整体页面背景 |
| 标题文字 | `text-[#2E2E30]` | #2E2E30 | 页面标题、重要文字 |
| 正文文字 | `text-gray-600` | #4B5563 | 正文内容 |
| 次要文字 | `text-[#B3B3B3]` | #B3B3B3 | 描述、提示 |
| 边框色 | `border-[#EDEDED]` | #EDEDED | 卡片边框、分割线 |
| 白色背景 | `bg-white` | #FFFFFF | 卡片背景、导航栏 |

### 1.3 服务分类配色系统（参考 design006.com 分类标签）

为每个服务类型分配专属颜色，便于用户快速识别：

| 服务类型 | Tailwind 类名 | 颜色值 | 用途 |
|---------|--------------|--------|------|
| 日常保洁 | `bg-[#F85659]` | #F85659 | 红色 - 基础服务 |
| 深度保洁 | `bg-[#007CFF]` | #007CFF | 蓝色 - 专业服务 |
| 新居开荒 | `bg-[#5DC801]` | #5DC801 | 绿色 - 特殊服务 |
| 家电清洗 | `bg-[#F38F00]` | #F38F00 | 橙色 - 专项服务 |
| 收纳整理 | `bg-[#9B40D8]` | #9B40D8 | 紫色 - 增值服务 |

### 1.4 状态语义色

| 用途 | Tailwind 类名 | 颜色值 | 说明 |
|------|--------------|--------|------|
| 待确认 | `bg-[#F38F00]` | #F38F00 | 橙色 |
| 待上门 | `bg-[#007CFF]` | #007CFF | 蓝色 |
| 服务中 | `bg-[#9B40D8]` | #9B40D8 | 紫色 |
| 已完成 | `bg-[#5DC801]` | #5DC801 | 绿色 |
| 已取消 | `bg-gray-400` | #9CA3AF | 灰色 |

---

## 二、字体规范

遵循简洁现代的排版原则：

| 层级 | Tailwind 类名 | 字号 | 字重 | 用途 |
|------|--------------|------|------|------|
| H1 | `text-xl font-bold` | 20px | 700 | 页面标题 |
| H2 | `text-lg font-bold` | 18px | 700 | 模块标题 |
| H3 | `text-base font-semibold` | 16px | 600 | 卡片标题 |
| Body | `text-sm` | 14px | 400 | 正文内容 |
| Caption | `text-xs` | 12px | 400 | 辅助说明、标签 |

---

## 三、间距系统

统一间距确保视觉一致性：

| 用途 | Tailwind 类名 | 数值 |
|------|--------------|------|
| 页面水平边距 | `px-4` | 16px |
| 页面垂直边距 | `py-4` | 16px |
| 卡片内边距 | `p-4` | 16px |
| 组件间距 | `gap-3` | 12px |
| 列表项间距 | `mb-4` | 16px |
| 模块间距 | `mb-6` | 24px |

---

## 四、圆角规范

采用大圆角设计，体现现代感与亲和力：

| 用途 | Tailwind 类名 | 数值 |
|------|--------------|------|
| 按钮 | `rounded-xl` | 12px |
| 卡片 | `rounded-2xl` | 16px |
| 输入框 | `rounded-xl` | 12px |
| 标签 | `rounded-full` | 完全圆角 |
| 头像 | `rounded-full` | 圆形 |

---

## 五、组件规范

### 5.1 主按钮

```tsx
<View className="w-full bg-[#F85659] text-white text-center py-3 rounded-xl font-medium active:bg-red-600">
  立即预约
</View>
```

### 5.2 次按钮

```tsx
<View className="w-full bg-white border border-[#EDEDED] text-[#2E2E30] text-center py-3 rounded-xl font-medium">
  取消
</View>
```

### 5.3 服务卡片（带分类颜色标识）

```tsx
<View className="bg-white rounded-2xl p-4 border border-[#EDEDED]">
  <View className="flex flex-row items-center">
    {/* 服务图标 - 使用分类颜色 */}
    <View className="w-12 h-12 bg-[#F85659] rounded-xl flex items-center justify-center">
      <Sparkles size={24} color="#fff" />
    </View>
    <View className="ml-3 flex-1">
      <Text className="block text-base font-semibold text-[#2E2E30]">日常保洁</Text>
      <Text className="block text-sm text-[#B3B3B3] mt-1">地面清洁、桌面整理...</Text>
    </View>
    <Text className="text-[#F85659] font-semibold">¥50/小时</Text>
  </View>
</View>
```

### 5.4 分类标签（带颜色区分）

```tsx
{/* 日常保洁 - 红色 */}
<View className="px-4 py-2 bg-[#F85659] text-white rounded-full text-xs">日常保洁</View>

{/* 深度保洁 - 蓝色 */}
<View className="px-4 py-2 bg-[#007CFF] text-white rounded-full text-xs">深度保洁</View>

{/* 新居开荒 - 绿色 */}
<View className="px-4 py-2 bg-[#5DC801] text-white rounded-full text-xs">新居开荒</View>
```

### 5.5 订单状态标签

```tsx
// 待确认
<View className="px-3 py-1 bg-[#FFF7ED] text-[#F38F00] rounded-full text-xs">待确认</View>
// 待上门
<View className="px-3 py-1 bg-[#EFF6FF] text-[#007CFF] rounded-full text-xs">待上门</View>
// 服务中
<View className="px-3 py-1 bg-[#FAF5FF] text-[#9B40D8] rounded-full text-xs">服务中</View>
// 已完成
<View className="px-3 py-1 bg-[#F0FDF4] text-[#5DC801] rounded-full text-xs">已完成</View>
// 已取消
<View className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">已取消</View>
```

### 5.6 搜索框（参考 design006.com 搜索设计）

```tsx
<View className="flex flex-row items-center bg-white rounded-full px-4 py-2 border border-[#EDEDED]">
  <Search size={20} color="#B3B3B3" />
  <Input 
    className="flex-1 ml-2 text-sm text-[#2E2E30]" 
    placeholder="搜索服务..."
    placeholderTextColor="#B3B3B3"
  />
</View>
```

### 5.7 空状态组件

```tsx
<View className="flex flex-col items-center justify-center py-20">
  <Inbox size={64} color="#EDEDED" />
  <Text className="block text-sm text-[#B3B3B3] mt-4">暂无预约记录</Text>
</View>
```

---

## 六、导航结构

### TabBar 配置

| 页面 | 文本 | 图标 | Lucide图标名 |
|------|------|------|-------------|
| pages/index/index | 首页 | 房子 | House |
| pages/orders/index | 我的预约 | 文档 | FileText |
| pages/profile/index | 我的 | 用户 | User |

### TabBar 样式配置

```typescript
// app.config.ts
tabBar: {
  color: '#B3B3B3',           // 未选中文字颜色
  selectedColor: '#F85659',   // 选中文字颜色（品牌主色）
  backgroundColor: '#ffffff', // 背景色
  borderStyle: 'white',
  // ...
}
```

---

## 七、页面布局规范

### 7.1 首页布局结构

```
┌─────────────────────────────┐
│         搜索栏              │  固定定位
├─────────────────────────────┤
│                             │
│       轮播图区域            │  高度 160px
│                             │
├─────────────────────────────┤
│                             │
│    服务分类网格（2列）       │
│    ┌─────┐  ┌─────┐        │
│    │保洁 │  │清洗 │        │
│    └─────┘  └─────┘        │
│    ┌─────┐  ┌─────┐        │
│    │开荒 │  │收纳 │        │
│    └─────┘  └─────┘        │
│                             │
├─────────────────────────────┤
│    热门服务推荐             │
│    ┌───────────────────┐   │
│    │ 服务卡片 1         │   │
│    └───────────────────┘   │
│    ┌───────────────────┐   │
│    │ 服务卡片 2         │   │
│    └───────────────────┘   │
└─────────────────────────────┘
```

### 7.2 轮播图规范

- 尺寸：宽度 100%，高度 160px
- 圆角：rounded-2xl (16px)
- 外边距：mb-4 (16px)
- 自动播放：是
- 指示器：显示，使用品牌主色

---

## 八、服务数据结构

```typescript
interface Service {
  id: string
  name: string
  description: string
  price: string
  unit: string
  duration: string
  icon: string
  color: string  // 分类专属颜色
  category: 'cleaning' | 'washing' | 'organizing'
}

const services: Service[] = [
  { 
    id: '1', 
    name: '日常保洁', 
    price: '50', 
    unit: '元/小时',
    duration: '2小时起', 
    icon: 'Sparkles',
    color: '#F85659',
    category: 'cleaning'
  },
  { 
    id: '2', 
    name: '深度保洁', 
    price: '100', 
    unit: '元/小时',
    duration: '4小时起', 
    icon: 'Sparkles',
    color: '#007CFF',
    category: 'cleaning'
  },
  { 
    id: '3', 
    name: '新居开荒', 
    price: '8', 
    unit: '元/平米',
    duration: '全天', 
    icon: 'Home',
    color: '#5DC801',
    category: 'cleaning'
  },
  { 
    id: '4', 
    name: '家电清洗', 
    price: '80', 
    unit: '元/台起',
    duration: '1-2小时', 
    icon: 'Tv',
    color: '#F38F00',
    category: 'washing'
  },
  { 
    id: '5', 
    name: '收纳整理', 
    price: '200', 
    unit: '元/次',
    duration: '3小时起', 
    icon: 'LayoutGrid',
    color: '#9B40D8',
    category: 'organizing'
  },
]
```

---

## 九、小程序约束

- **包体积**：主包不超过 2MB
- **图片策略**：轮播图使用 CDN，本地仅保留 TabBar 图标
- **性能优化**：
  - 列表使用虚拟滚动
  - 图片懒加载
  - 避免不必要的重渲染

---

## 十、设计原则总结

参考 design006.com 的设计理念：

1. **简洁至上**：去除多余装饰，突出内容本身
2. **色彩系统化**：每个分类有专属颜色，便于快速识别
3. **圆角友好**：大圆角设计增加亲和力
4. **搜索优先**：搜索作为核心入口，放在显眼位置
5. **分类清晰**：网格布局展示分类，一目了然
6. **状态明确**：不同状态使用不同语义色，信息传达清晰
