import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/imageProcessor.js';

class MCPService {
  constructor(options = {}) {
    this.app = express();
    this.port = options.port || 3001;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }

  setupRoutes() {
    // 图片处理路由
    this.app.use('/mcp/images', router);

    // 健康检查
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy' });
    });
  }

  setupErrorHandler() {
    this.app.use((err, req, res, next) => {
      console.error('MCP 服务错误:', err);
      res.status(500).json({
        success: false,
        error: '服务器内部错误'
      });
    });
  }

  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`MCP 服务运行在 http://localhost:${this.port}`);
        resolve(this.server);
      });
    });
  }

  stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log('MCP 服务已停止');
          resolve();
        });
      });
    }
    return Promise.resolve();
  }
}

export default MCPService; 