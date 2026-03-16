# 📰 新闻定时抓取功能文档

## 功能概述

系统会自动定时抓取财经、娱乐、家庭类新闻，并提供给前端展示。

---

## ⏰ 定时任务配置

### 1. 每天早上 7:00 抓取
```
时间：每天早上 7:00（北京时间）
任务：抓取财经、娱乐、家庭三个分类的新闻
```

### 2. 每 30 分钟抓取
```
时间：每 30 分钟一次
任务：抓取财经、娱乐、家庭三个分类的新闻
```

---

## 📊 新闻分类

| 分类 | 英文标识 | 说明 |
|------|---------|------|
| 财经 | `finance` | 金融、股市、经济相关新闻 |
| 娱乐 | `entertainment` | 娱乐、明星、影视相关新闻 |
| 家庭 | `family` | 家政、生活、家庭相关新闻 |

---

## 🔌 API 接口

### 1. 获取新闻列表

**接口地址：**
```
GET /api/news/toutiao
```

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 新闻分类（finance/entertainment/family） |
| keyword | string | 否 | 关键词搜索 |

**响应示例：**
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": "1",
      "title": "财经新闻：最新市场动态分析",
      "url": "https://example.com/news/finance/1",
      "source": "头条号",
      "publish_time": "2024-01-15T10:00:00.000Z",
      "description": "这是一条关于财经领域的最新报道...",
      "category": "finance"
    }
  ]
}
```

### 2. 手动触发抓取

**接口地址：**
```
POST /api/news/fetch
```

**响应示例：**
```json
{
  "code": 200,
  "msg": "手动抓取完成",
  "data": {
    "count": 15
  }
}
```

---

## 🗄️ 数据库表结构

### news 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | TEXT | 新闻标题 |
| url | TEXT | 新闻链接 |
| source | TEXT | 来源（默认：头条号） |
| publish_time | TIMESTAMPTZ | 发布时间 |
| description | TEXT | 新闻描述 |
| category | TEXT | 分类 |
| created_at | TIMESTAMPTZ | 创建时间 |

### 索引
- `idx_news_category` - 分类索引
- `idx_news_publish_time` - 发布时间索引（降序）

---

## 🔧 技术实现

### 1. 定时任务服务 (NewsCronService)

```typescript
// 每天早上 7:00
@Cron('0 7 * * *', {
  name: 'dailyMorningNews',
  timeZone: 'Asia/Shanghai'
})
async handleDailyMorningNews() {
  await this.fetchAllCategories()
}

// 每 30 分钟
@Cron(CronExpression.EVERY_30_MINUTES, {
  name: 'periodicNewsFetch',
  timeZone: 'Asia/Shanghai'
})
async handlePeriodicNewsFetch() {
  await this.fetchAllCategories()
}
```

### 2. 数据存储 (NewsRepository)

- 使用 Supabase（PostgreSQL）存储新闻
- 自动创建表和索引
- 保留最近 7 天的新闻
- 支持分类查询和关键词搜索

### 3. 新闻服务 (NewsService)

- 提供新闻获取接口
- 支持分类筛选
- 支持关键词搜索
- 返回前 3 条新闻

---

## 🎨 前端集成

### 1. 首页轮播条

```tsx
// 自动加载并显示前3条新闻
const loadNews = async () => {
  const res = await Network.request({
    url: '/api/news/toutiao',
    method: 'GET'
  })
  setNewsList(res.data || [])
}
```

### 2. 新闻页面

```tsx
// 按分类获取新闻
const loadNews = async (category?: string) => {
  const res = await Network.request({
    url: '/api/news/toutiao',
    method: 'GET',
    data: { category }
  })
  setNewsList(res.data || [])
}
```

---

## 📝 使用示例

### 1. 获取财经新闻

```bash
curl http://localhost:3000/api/news/toutiao?category=finance
```

### 2. 获取娱乐新闻

```bash
curl http://localhost:3000/api/news/toutiao?category=entertainment
```

### 3. 搜索关键词

```bash
curl http://localhost:3000/api/news/toutiao?keyword=市场
```

### 4. 手动触发抓取

```bash
curl -X POST http://localhost:3000/api/news/fetch
```

---

## ⚙️ 配置说明

### 环境变量

在 `server/.env` 中配置：

```bash
# Supabase 配置（必填）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# 时区配置（可选，默认：Asia/Shanghai）
TZ=Asia/Shanghai
```

### 定时任务配置

修改 `server/src/news/news-cron.service.ts`：

```typescript
// 修改为其他时间
@Cron('0 8 * * *') // 改为早上 8:00

// 修改抓取频率
@Cron('0 */30 * * * *') // 每 30 分钟
@Cron('0 */15 * * * *') // 每 15 分钟
```

---

## 🔍 日志查看

### 后端日志

```bash
# 查看定时任务日志
tail -f /tmp/coze-logs/dev.log | grep "新闻"
```

### 日志示例

```
[NewsCronService] 🌅 开始执行每天早上 7:00 新闻抓取任务...
[NewsCronService] 📰 开始抓取 finance 分类新闻...
[NewsRepository] ✅ 成功保存 5 条新闻到数据库
[NewsCronService] ✅ 成功抓取并保存 5 条 finance 新闻
[NewsCronService] ✅ 每天早上新闻抓取任务完成
```

---

## 🚀 扩展功能

### 1. 接入真实新闻源

修改 `news-cron.service.ts` 中的 `generateMockNews` 方法：

```typescript
private async fetchRealNews(category: string): Promise<NewsItem[]> {
  // 使用 FetchClient 抓取真实新闻
  const response = await fetch(`https://news-api.com/${category}`)
  const data = await response.json()
  
  return data.articles.map(article => ({
    title: article.title,
    url: article.url,
    source: article.source.name,
    publish_time: article.publishedAt,
    description: article.description,
    category
  }))
}
```

### 2. 添加更多分类

```typescript
const categories = ['finance', 'entertainment', 'family', 'sports', 'tech']
```

### 3. 添加新闻去重

```typescript
// 在保存前检查是否已存在
const exists = await this.checkIfExists(news.url)
if (!exists) {
  await this.saveNews(news)
}
```

### 4. 添加情感分析

```typescript
// 使用 AI 分析新闻情感
const sentiment = await this.analyzeSentiment(news.description)
news.sentiment = sentiment
```

---

## ⚠️ 注意事项

### 1. 数据库配置
- 确保 Supabase 已正确配置
- 首次运行会自动创建表
- 如果配置缺失，会使用内存存储

### 2. 抓取频率
- 避免过于频繁的抓取
- 建议间隔至少 15 分钟
- 不同分类之间有 5 秒间隔

### 3. 数据清理
- 自动清理 7 天前的新闻
- 可根据需要调整保留时间

---

## 📊 性能优化

### 1. 数据库索引
```sql
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_publish_time ON news(publish_time DESC);
```

### 2. 缓存策略
- 使用 Redis 缓存热门新闻
- 设置 5 分钟缓存过期时间

### 3. 批量插入
- 使用批量插入提高性能
- 每次插入 5 条新闻

---

## 🆘 常见问题

### Q1: 定时任务不执行？

**A:** 检查：
- 服务是否正常启动
- 时区配置是否正确
- 日志中是否有错误信息

### Q2: 数据库连接失败？

**A:** 检查：
- Supabase URL 和 Key 是否正确
- 网络连接是否正常
- 数据库表是否已创建

### Q3: 新闻数据为空？

**A:** 检查：
- 定时任务是否已执行
- 手动触发接口是否正常
- 数据库中是否有数据

---

## 📚 相关文档

- [NestJS Schedule 文档](https://docs.nestjs.com/techniques/task-scheduling)
- [Supabase 文档](https://supabase.com/docs)
- [Cron 表达式生成器](https://crontab.guru/)

---

**新闻定时抓取功能已集成！** 🎉
