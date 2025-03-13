import express from 'express';
import expressWs from 'express-ws';
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "@langchain/core/tools";
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 配置环境变量
dotenv.config();

const app = express();
const wsInstance = expressWs(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置静态文件服务
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 创建天气查询工具
const weatherTool = new DynamicTool({
    name: "get_weather",
    description: "获取指定城市的天气信息",
    func: async (location) => {
        try {
            // 先获取城市ID
            const locationResponse = await axios.get('https://geoapi.qweather.com/v2/city/lookup', {
                params: {
                    key: process.env.QWEATHER_API_KEY,
                    location: location
                }
            });

            if (!locationResponse.data.location || locationResponse.data.location.length === 0) {
                return `抱歉，未找到"${location}"的城市信息。`;
            }

            const cityId = locationResponse.data.location[0].id;
            
            // 获取天气信息
            const weatherResponse = await axios.get('https://devapi.qweather.com/v7/weather/now', {
                params: {
                    key: process.env.QWEATHER_API_KEY,
                    location: cityId
                }
            });

            const weatherData = weatherResponse.data.now;
            return `${location}的当前天气：${weatherData.text}，温度 ${weatherData.temp}°C，体感温度 ${weatherData.feelsLike}°C，相对湿度 ${weatherData.humidity}%，风向 ${weatherData.windDir}，风速 ${weatherData.windSpeed}公里/小时。`;
        } catch (error) {
            console.error('Weather API Error:', error.response?.data || error.message);
            return `抱歉，无法获取${location}的天气信息。`;
        }
    },
});

// 创建地理位置查询工具
const geoTool = new DynamicTool({
    name: "get_geolocation",
    description: "获取指定地址的地理坐标",
    func: async (address) => {
        try {
            const response = await axios.get(`https://restapi.amap.com/v3/geocode/geo`, {
                params: {
                    address: address,
                    key: process.env.AMAP_API_KEY,
                    output: 'json'
                }
            });
            const data = response.data;
            if (data.geocodes && data.geocodes.length > 0) {
                const location = data.geocodes[0].location.split(',');
                const formatted_address = data.geocodes[0].formatted_address;
                return `${address}的完整地址是：${formatted_address}，地理坐标是：经度 ${location[0]}，纬度 ${location[1]}。`;
            }
            return `未找到"${address}"的地理位置信息。`;
        } catch (error) {
            console.error('Geocoding API Error:', error.response?.data || error.message);
            return `抱歉，无法获取"${address}"的地理位置信息。`;
        }
    },
});

// 创建 ChatOpenAI 实例
const model = new ChatOpenAI({
    modelName: "qwen-plus",
    openAIApiKey: process.env.DASHSCOPE_API_KEY,
    configuration: {
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    },
});

// 初始化 agent
const executor = await initializeAgentExecutorWithOptions(
    [weatherTool, geoTool],
    model,
    {
        agentType: "chat-conversational-react-description",
        verbose: true,
    }
);

// WebSocket 路由
app.ws('/chat', (ws, req) => {
    ws.on('message', async (msg) => {
        try {
            const userInput = JSON.parse(msg);
            const result = await executor.invoke({
                input: userInput.message,
            });
            ws.send(JSON.stringify({ type: 'response', content: result.output }));
        } catch (error) {
            console.error('Chat Error:', error);
            ws.send(JSON.stringify({ type: 'error', content: '处理消息时出错' }));
        }
    });
});

// 创建前端页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});