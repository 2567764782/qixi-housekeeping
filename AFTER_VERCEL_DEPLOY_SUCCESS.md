# 🚀 Vercel 部署成功后的配置步骤

## 第一步：获取 Vercel 部署地址

### 1. 在 Vercel Dashboard 中找到你的项目地址

**格式通常是**：
```
https://你的项目名.vercel.app
```

**例如**：
```
https://qixi-housekeeping.vercel.app
```

---

## 第二步：配置环境变量（重要！）

### 1. 在 Vercel 中配置环境变量

**Settings → Environment Variables**

### 2. 添加以下环境变量

#### **变量 1：SUPABASE_URL**
- **Name**：`SUPABASE_URL`
- **Value**：你的 Supabase 项目 URL
  ```
  https://你的项目ID.supabase.co
  ```

#### **变量 2：SUPABASE_ANON_KEY**
- **Name**：`SUPABASE_ANON_KEY`
- **Value**：你的 Supabase 匿名密钥（Anon Key）

#### **变量 3：PROJECT_DOMAIN**（可选）
- **Name**：`PROJECT_DOMAIN`
- **Value**：你的 Vercel 域名
  ```
  https://你的项目名.vercel.app
  ```

### 3. 添加完成后，重新部署

**Settings → Environment Variables → Save**

**Deployments → Redeploy**

---

## 第三步：验证后端 API 是否正常

### 1. 测试健康检查接口

**在浏览器中访问**：
```
https://你的项目名.vercel.app/api
```

**预期返回**：
```json
{
  "message": "Hello World"
}
```

---

### 2. 测试数据库连接

**在浏览器中访问**：
```
https://你的项目名.vercel.app/api/test-db
```

**如果返回数据，说明数据库连接正常**

---

## 第四步：配置微信小程序

### 1. 获取前端构建产物

**Vercel 会自动构建并部署前端**

**访问**：
```
https://你的项目名.vercel.app
```

---

### 2. 配置微信小程序服务器域名

**登录微信公众平台**：
```
https://mp.weixin.qq.com
```

**开发 → 开发管理 → 开发设置 → 服务器域名**

**添加 request 合法域名**：
```
https://你的项目名.vercel.app
```

---

### 3. 下载微信小程序代码

**在 Vercel 的 Deployment 详情页**：

1. **点击 "Download Build" 或查看构建产物**
2. **找到 `dist/weapp` 目录**
3. **下载到本地**

---

### 4. 使用微信开发者工具导入项目

1. **打开微信开发者工具**
2. **导入项目**
3. **选择下载的 `dist/weapp` 目录**
4. **填写 AppID**
5. **点击编译预览**

---

## 第五步：配置微信小程序 AppID

### 1. 在项目中配置 AppID

**找到项目中的 `project.config.json` 文件**

**修改 `appid` 字段**：
```json
{
  "miniprogramRoot": "dist/weapp/",
  "projectname": "qixi-housekeeping",
  "description": "柒玺家政",
  "appid": "你的微信小程序AppID",
  "setting": {
    "urlCheck": false,
    "es6": false,
    "enhance": false,
    "postcss": false,
    "preloadBackgroundData": false,
    "minified": false,
    "newFeature": false,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "bundle": false,
    "useIsolateContext": true,
    "useCompilerModule": true,
    "userConfirmedUseCompilerModuleSwitch": false,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true
  }
}
```

---

## 第六步：提交微信小程序审核

### 1. 在微信开发者工具中上传代码

**点击 "上传" 按钮**

**填写版本号和描述**

---

### 2. 在微信公众平台提交审核

**登录微信公众平台**

**管理 → 版本管理 → 开发版本**

**点击 "提交审核"**

---

## 📋 完整配置清单

- [ ] 获取 Vercel 部署地址
- [ ] 配置环境变量（SUPABASE_URL、SUPABASE_ANON_KEY）
- [ ] 验证后端 API 是否正常
- [ ] 配置微信小程序服务器域名
- [ ] 下载微信小程序代码
- [ ] 配置微信小程序 AppID
- [ ] 使用微信开发者工具预览
- [ ] 提交微信小程序审核

---

## 🎯 现在请告诉我

1. **你的 Vercel 项目地址是什么？**
2. **你已经有 Supabase 的 URL 和 Anon Key 了吗？**
3. **你已经有微信小程序的 AppID 了吗？**

**我会帮你完成后续配置！** 🚀
