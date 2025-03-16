# LangChain Tools Demo Backend

这是一个集成了 LangChain、WebSocket 和 MCP（Model Context Protocol）的后端服务，提供智能对话、图片处理等功能。

## 功能特性

### 主服务 (端口 3000)
- WebSocket 实时对话
- HTTP API 接口
- 智能对话功能：
  - 天气查询
  - 地理位置查询
  - 图片处理工具
- 实时消息推送
- 错误处理和日志记录

### MCP 服务 (端口 3001)
- 图片处理功能：
  - 支持多种格式（jpg, jpeg, png, gif, webp）
  - 按时间戳或日期重命名
  - 自动创建日期子文件夹
  - 生成处理报告
- RESTful API 接口
- 独立的错误处理

## 安装

```bash
# 安装依赖
npm install
```

## 环境变量

创建 .env 文件并配置以下变量：
```env
OPENAI_API_KEY=your_openai_api_key
PORT=3000
MCP_PORT=3001
```

## 运行

```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm start
```

## API 接口

### 1. WebSocket 对话

连接 WebSocket：
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

// 发送消息
ws.send(JSON.stringify({ message: '深圳天气怎么样？' }));

// 接收消息
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.response);
};
```

### 2. HTTP 对话接口

```http
POST /api/chat
Content-Type: application/json

{
  "message": "深圳天气怎么样？"
}
```

响应示例：
```json
{
  "response": "深圳今天天气晴朗，气温 22-28℃，适合外出活动。"
}
```

### 3. 图片处理工具

通过对话接口（WebSocket 或 HTTP）使用以下命令：

#### 处理图片目录
```
处理目录 <目录路径> [选项]
整理图片 <目录路径> [选项]
```

> **注意：** 
> - 目录路径必须是完整的绝对路径
> - 目录必须存在且有读写权限
> - 在 macOS/Linux 上使用 `/` 作为路径分隔符，例如：`/Users/username/Pictures`
> - 在 Windows 上使用 `\` 作为路径分隔符，例如：`C:\Users\username\Pictures`

支持的选项：
- `按日期` 或 `日期格式`: 使用日期格式重命名（YYYYMMDD_hash.ext）
- `不分类` 或 `不创建文件夹`: 不创建日期子文件夹
- `复制` 或 `保留原文件`: 复制而不是移动文件

使用示例：
```bash
# macOS/Linux
处理目录 /Users/username/Pictures/vacation 按日期
整理图片 /home/user/Downloads/photos 复制

# Windows
处理目录 C:\Users\username\Pictures\vacation 按日期
整理图片 D:\Downloads\photos 复制
```

响应示例：
```json
{
  "response": "处理完成！\n- 总文件数：10\n- 成功处理：10\n- 处理失败：0\n- 输出目录：/Users/username/Pictures/vacation/2024-03-16"
}
```

#### 获取目录统计
```
统计目录 <目录路径>
查看图片 <目录路径>
```

使用示例：
```bash
# macOS/Linux
统计目录 /Users/username/Pictures
查看图片 /home/user/Downloads/photos

# Windows
统计目录 C:\Users\username\Pictures
查看图片 D:\Downloads\photos
```

响应示例：
```json
{
  "response": "目录统计信息：\n- 总文件数：15\n- 图片文件：10\n- 总大小：25.50 MB\n\n图片格式分布：\n- .jpg: 5 个\n- .png: 3 个\n- .gif: 2 个"
}
```

### 4. MCP 服务 API

#### 处理图片目录
```http
POST /mcp/images/process
Content-Type: application/json

{
  "sourceDir": "/Users/username/Pictures/vacation",  # 必须是完整的绝对路径
  "options": {
    "renameFormat": "timestamp",    # "timestamp" 或 "date"
    "createSubfolders": true,       # 是否创建子文件夹
    "copyInsteadOfMove": false      # 是否复制而不是移动文件
  }
}
```

#### 获取目录统计
```http
GET /mcp/images/stats/:dir
```

#### 获取处理报告
```http
GET /mcp/images/report/:dir
```

## 项目结构

```
backend/
├── src/
│   ├── app.js              # 主应用入口
│   ├── config/             # 配置文件
│   ├── middleware/         # 中间件
│   ├── tools/             # 工具函数
│   │   ├── weather.js     # 天气查询
│   │   ├── geolocation.js # 地理位置查询
│   │   └── imageProcessor.js # 图片处理工具
│   └── MCP/               # MCP 服务
│       ├── index.js       # MCP 服务入口
│       ├── routes/        # 路由处理
│       └── services/      # 服务实现
├── .env                   # 环境变量
└── package.json
```

## 开发指南

### 添加新的对话功能

在 handleMessage 函数中添加新的处理逻辑：

```javascript
async function handleMessage(message) {
  if (message.includes('新功能')) {
    return await handleNewFeature(message);
  }
  // ... 其他处理
}
```

### 扩展 MCP 服务

1. 在 `src/MCP/services` 中添加新服务
2. 在 `src/MCP/routes` 中添加新路由
3. 在 `src/MCP/index.js` 中注册路由

## 错误处理

服务包含多层错误处理：

1. WebSocket 错误处理
2. HTTP API 错误处理
3. MCP 服务错误处理
4. 全局错误处理中间件

错误响应格式：
```json
{
  "success": false,
  "error": "错误信息"
}
```

## 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

## 许可证

MIT

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request 