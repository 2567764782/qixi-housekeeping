# 保洁和局部改造小程序设计指南

## 品牌定位

- **应用定位**：生活服务类小程序，提供保洁服务和局部改造服务
- **目标用户**：需要家庭服务的用户，注重便捷、专业、可靠
- **设计风格**：温暖、专业、便捷、值得信赖
- **核心价值**：快速预约、专业服务、透明价格

## 配色方案

### 主色系（绿/橙暖色）
- **主色调**：`#10B981` (emerald-500) - 代表清洁、健康、可靠
- **辅助色**：`#F59E0B` (amber-500) - 代表活力、服务、温暖
- **强调色**：`#3B82F6` (blue-500) - 用于操作按钮、链接

### 中性色
- **主背景**：`#F9FAFB` (gray-50)
- **卡片背景**：`#FFFFFF` (white)
- **边框色**：`#E5E7EB` (gray-200)
- **分割线**：`#F3F4F6` (gray-100)

### 语义色
- **成功**：`#10B981` (emerald-500)
- **警告**：`#F59E0B` (amber-500)
- **错误**：`#EF4444` (red-500)
- **信息**：`#3B82F6` (blue-500)

## Tailwind 类名映射

```tsx
// 主色
className="bg-emerald-500 text-white"
className="text-emerald-500"
className="border-emerald-500"

// 辅助色
className="bg-amber-500 text-white"
className="text-amber-500"

// 强调色
className="bg-blue-500 text-white"

// 背景
className="bg-gray-50"
className="bg-white"

// 边框
className="border border-gray-200"
className="border-gray-100"
```

## 字体规范

| 层级 | 字体大小 | 字重 | 用途 |
|------|---------|------|------|
| H1 | `text-2xl` | `font-bold` | 页面标题 |
| H2 | `text-xl` | `font-semibold` | 卡片标题 |
| H3 | `text-lg` | `font-medium` | 列表标题 |
| Body | `text-base` | `font-normal` | 正文内容 |
| Small | `text-sm` | `font-normal` | 辅助文字 |
| Caption | `text-xs` | `font-normal` | 提示文字 |

## 间距系统

| 类名 | 用途 |
|------|------|
| `p-4` | 页面内边距 |
| `px-4` | 左右内边距 |
| `py-4` | 上下内边距 |
| `mb-4` | 元素下间距 |
| `gap-4` | Flex/Grid 间距 |
| `gap-2` | 小间距 |

## 组件规范

### 按钮

```tsx
// 主按钮
<View className="w-full">
  <Button className="w-full bg-emerald-500 text-white rounded-lg py-3">
    立即预约
  </Button>
</View>

// 次按钮
<View className="w-full">
  <Button className="w-full bg-white text-emerald-500 border border-emerald-500 rounded-lg py-3">
    查看详情
  </Button>
</View>

// 禁用态
<Button className="w-full bg-gray-200 text-gray-400 rounded-lg py-3" disabled>
  不可用
</Button>
```

### 卡片

```tsx
<View className="bg-white rounded-xl shadow-sm p-4 mb-4">
  <Text className="block text-lg font-semibold mb-2">标题</Text>
  <Text className="block text-sm text-gray-500">描述文字</Text>
</View>
```

### 输入框（跨端兼容）

```tsx
<View className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
  <Input className="w-full bg-transparent" placeholder="请输入内容" />
</View>
```

### 文本域（跨端兼容）

```tsx
<View className="bg-gray-50 rounded-2xl p-4 mb-4">
  <Textarea
    style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent' }}
    placeholder="请输入详细描述..."
    maxlength={500}
  />
</View>
```

### 空状态

```tsx
<View className="flex flex-col items-center justify-center py-16">
  <View className="mb-4">
    {/* 图标 */}
  </View>
  <Text className="block text-base text-gray-500">暂无数据</Text>
</View>
```

### 加载状态

```tsx
<View className="flex flex-col items-center justify-center py-16">
  <Text className="block text-sm text-gray-500">加载中...</Text>
</View>
```

## 导航结构

### TabBar 配置

```typescript
tabBar: {
  color: '#999999',
  selectedColor: '#10B981',  // 主色
  backgroundColor: '#ffffff',
  borderStyle: 'black',
  list: [
    {
      pagePath: 'pages/index/index',
      text: '服务大厅',
      iconPath: './assets/tabbar/home.png',
      selectedIconPath: './assets/tabbar/home-active.png',
    },
    {
      pagePath: 'pages/orders/index',
      text: '订单',
      iconPath: './assets/tabbar/list.png',
      selectedIconPath: './assets/tabbar/list-active.png',
    },
    {
      pagePath: 'pages/profile/index',
      text: '我的',
      iconPath: './assets/tabbar/user.png',
      selectedIconPath: './assets/tabbar/user-active.png',
    }
  ]
}
```

### 页面跳转规范

- TabBar 页面使用 `Taro.switchTab()`
- 普通页面使用 `Taro.navigateTo()`
- 返回上一页使用 `Taro.navigateBack()`

## 小程序约束

### 包体积限制
- 主包不超过 2MB
- 所有分包不超过 20MB
- 使用 CDN 加载大文件

### 图片策略
- 优先使用 WebP 格式
- 使用对象存储管理图片
- 避免使用 base64 大图

### 性能优化
- 使用分包加载
- 图片懒加载
- 避免 setData 过频
- 合理使用缓存

## 特殊要求

### 文本换行（跨端）
```tsx
<Text className="block text-lg font-semibold">标题</Text>
<Text className="block text-sm text-gray-500">说明</Text>
```

### Fixed + Flex（H5 兼容）
```tsx
<View style={{
  position: 'fixed', bottom: 50, left: 0, right: 0,
  display: 'flex', flexDirection: 'row', gap: '12px',
  padding: '12px', backgroundColor: '#fff', borderTop: '1px solid #e5e5e5', zIndex: 100
}}>
  {/* 内容 */}
</View>
```

### 底部避让 TabBar
```tsx
// 列表底部添加内边距
<ScrollView className="pb-20">
  {/* 内容 */}
</ScrollView>
```
