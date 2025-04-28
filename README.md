# 早安 AI

一个基于Vue 3的智能聊天助手应用，提供多对话支持和工具集成。

## 功能

- 多对话管理：支持创建和管理多个独立对话
- 对话缓存：切换对话时自动保存和恢复聊天记录
- 本地存储：将对话历史保存到localStorage，浏览器关闭后数据不丢失
- 工具集成：支持图片处理、天气查询、地理位置等多种工具
- Markdown支持：AI回复支持Markdown格式化
- WebSocket通信：实时消息传输

## 技术栈

- Vue 3 组合式API
- Element Plus UI组件库
- WebSocket实时通信
- 响应式设计
- localStorage数据持久化

## 使用方法

1. 创建新对话：点击"新建对话"按钮
2. 切换对话：在左侧对话列表中选择需要的对话
3. 使用工具：在左侧工具箱中选择需要的工具
4. 发送消息：在底部输入框中输入消息后按Enter或点击发送按钮
5. 清除数据：点击右上角用户头像 → 清除所有数据

## 数据持久化

应用使用localStorage实现了以下数据的持久化存储：

- 对话列表：保存所有创建的对话信息
- 消息历史：每个对话的完整聊天记录
- 当前选择：记住最后选择的对话

数据在以下情况下会自动保存：
- 创建新对话时
- 删除对话时
- 对话内容变化时
- 切换对话时

## 开发

```bash
# Make the script executable first
chmod +x start.sh
# Run the script
./start.sh
```

### On Windows:
```bash
start.bat
```

These scripts will:
- Check for npm installation
- Install dependencies if needed
- Start both frontend and backend services in separate terminal windows
- The frontend will be available at http://localhost:5173
- The backend API at http://localhost:3000
- The MCP service at http://localhost:3001