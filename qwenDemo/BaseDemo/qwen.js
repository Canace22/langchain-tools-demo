import OpenAI from "openai";
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

async function main() {
    try {
        const completion = await openai.chat.completions.create({
            model: "qwen-plus",  //此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "你是谁？" }
            ],
        });
        console.log(JSON.stringify(completion, null, 2));
    } catch (error) {
        console.error('调用API时出错:', error);
    }
}

main();