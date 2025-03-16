import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressWs from 'express-ws';
import MCPService from './mcp/index.js';
import { config, validateConfig } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getWeather } from './tools/weather.js';
import { getGeolocation } from './tools/geolocation.js';
import { processImages, getDirectoryStats } from './tools/imageProcessor.js';

// 验证环境变量
validateConfig();

const app = express();
const port = process.env.PORT || 3000;

// 设置 WebSocket
expressWs(app);

// 中间件
app.use(cors());
app.use(bodyParser.json());

// WebSocket 连接处理
app.ws('/ws', (ws, req) => {
  console.log('新的 WebSocket 连接');

  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);
      const response = await handleMessage(data.message);
      ws.send(JSON.stringify({ response }));
    } catch (error) {
      console.error('处理消息失败:', error);
      ws.send(JSON.stringify({ 
        error: error.message || '处理消息失败'
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket 连接关闭');
  });
});

// HTTP API 路由
app.post('/api/chat', async (req, res, next) => {
  try {
    const { message } = req.body;
    const response = await handleMessage(message);
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

// 消息处理函数
async function handleMessage(message) {
  // 图片处理相关命令
  if (message.includes('处理目录') || message.includes('整理图片')) {
    return await processImages(message);
  }
  
  if (message.includes('统计目录') || message.includes('查看图片')) {
    return await getDirectoryStats(message);
  }

  // 天气查询
  if (message.includes('天气')) {
    const city = message.replace(/[天气查询？。，,\.]/g, '').trim();
    return await getWeather(city);
  }
  
  // 位置查询
  if (message.includes('位置') || message.includes('在哪')) {
    const address = message.replace(/[在哪里位置查询？。，,\.]/g, '').trim();
    return await getGeolocation(address);
  }
  
  return `我可以帮您：
1. 查询天气和地理位置信息
   - 查询深圳的天气
   - 珠海市在哪里
2. 处理图片目录
   - 处理目录 /path/to/images
   - 整理图片 /path/to/images 按日期分类
   - 统计目录 /path/to/images`;
}

// 创建并启动 MCP 服务
const mcpService = new MCPService({
  port: process.env.MCP_PORT || 3001
});

// 启动 MCP 服务
mcpService.start()
  .then(() => {
    console.log('MCP 服务已启动');
  })
  .catch(error => {
    console.error('MCP 服务启动失败:', error);
    process.exit(1);
  });

// 处理进程退出
process.on('SIGTERM', () => {
  mcpService.stop()
    .then(() => {
      process.exit(0);
    });
});

// 错误处理中间件
app.use(errorHandler);

// 启动主服务器
app.listen(port, () => {
  console.log(`主服务运行在 http://localhost:${port}`);
}); 