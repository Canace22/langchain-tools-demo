import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.DASHSCOPE_API_KEY,
  qweatherApiKey: process.env.QWEATHER_API_KEY,
  amapApiKey: process.env.AMAP_API_KEY
};

export const validateConfig = () => {
  const requiredEnvVars = [
    'DASHSCOPE_API_KEY',
    'QWEATHER_API_KEY',
    'AMAP_API_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
};