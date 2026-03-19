# 🎯 Railway 生成域名并访问应用

## 当前状态

从截图看到：
- ✅ **Deployment successful**（部署成功）
- ✅ **ACTIVE**（服务运行中）
- ⚠️ **Unexposed service**（未对外暴露服务）

**服务已经运行，但还没有生成公开域名！**

---

## 第一步：点击 Settings 标签

### 在右侧面板中：
1. **找到顶部的标签页**：Deployments | Variables | Metrics | **Settings**
2. **点击 "Settings" 标签**

---

## 第二步：滚动找到 Domains 部分

### 在 Settings 页面中：
1. **向下滚动**
2. **找到 "Domains" 或 "Public Domain" 部分**

---

## 第三步：生成域名

### 在 Domains 部分：
1. **点击 "Generate Domain" 按钮**
2. **Railway 会自动分配一个域名**

### 域名格式：
```
https://qixi-housekeeping.up.railway.app
```
或
```
https://qixi-housekeeping-xxx.up.railway.app
```

---

## 第四步：访问你的应用

### 生成域名后：

#### 1. 访问前端页面
**在浏览器中打开**：
```
https://你的域名.up.railway.app
```

#### 2. 测试后端 API
**在浏览器中打开**：
```
https://你的域名.up.railway.app/api
```

#### 3. 预期返回：
```json
{
  "message": "Hello World"
}
```

---

## 🔧 如果找不到 "Generate Domain" 按钮

### 方法 A：使用端口转发

#### 在 Railway 界面中：
1. **点击右上角的 "Details" 按钮**
2. **找到 "Connect" 或 "Port Forwarding"**
3. **点击 "Forward Port"**
4. **输入端口号**：`3000`（或你的应用端口）
5. **点击 "Enable"**

---

### 方法 B：添加环境变量 PORT

#### 在 Variables 标签中：
1. **点击 "Variables" 标签**
2. **添加变量**：
   - **Name**：`PORT`
   - **Value**：`3000`
3. **点击 "Save"**
4. **服务会自动重启**

---

## 📋 完整检查清单

- [ ] 点击 Settings 标签
- [ ] 找到 Domains 部分
- [ ] 点击 Generate Domain
- [ ] 等待域名生成
- [ ] 在浏览器中访问域名
- [ ] 测试 API 是否正常

---

## 🎯 快速步骤

### 1️⃣ 点击右侧的 **Settings** 标签
### 2️⃣ 滚动找到 **Domains**
### 3️⃣ 点击 **Generate Domain**
### 4️⃣ 访问生成的域名

---

## 📞 如果还是找不到

**请截图 Settings 页面给我看**

**或者告诉我你在 Settings 页面看到了什么选项**

**我会帮你找到生成域名的方法！**
