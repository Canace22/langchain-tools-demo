import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import { config, validateConfig } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getWeather } from './tools/weather.js';
import { getGeolocation } from './tools/geolocation.js';

// 验证环境变量
validateConfig();

const app = express();
expressWs(app);

// 中间件
app.use(cors());
app.use(express.json());

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
  if (message.includes('天气')) {
    const city = message.replace(/[天气查询？。，,\.]/g, '').trim();
    return await getWeather(city);
  }
  
  if (message.includes('位置') || message.includes('在哪')) {
    const address = message.replace(/[在哪里位置查询？。，,\.]/g, '').trim();
    return await getGeolocation(address);
  }
  
  return '我可以帮您查询天气和地理位置信息。例如：\n- 查询深圳的天气\n- 珠海市在哪里';
}

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(config.port, () => {
  console.log(`服务器运行在 http://localhost:${config.port}`);
});