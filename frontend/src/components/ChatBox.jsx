import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Avatar, Space, message } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { TextArea } = Input;

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);
  const listRef = useRef(null);

  // 初始化 WebSocket 连接
  useEffect(() => {
    const wsClient = new WebSocket(`ws://${window.location.hostname}:3000/ws`);
    
    wsClient.onopen = () => {
      console.log('WebSocket 连接已建立');
    };

    wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        message.error(data.error);
      } else {
        addMessage('assistant', data.response);
      }
    };

    wsClient.onerror = (error) => {
      console.error('WebSocket 错误:', error);
      message.error('连接出错，将使用 HTTP 模式');
    };

    setWs(wsClient);

    return () => {
      wsClient.close();
    };
  }, []);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 添加消息到列表
  const addMessage = (type, content) => {
    setMessages(prev => [...prev, {
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    }]);
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    addMessage('user', inputValue);
    setInputValue('');
    setLoading(true);

    try {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message: inputValue }));
      } else {
        const response = await axios.post('/api/chat', {
          message: inputValue,
        });
        addMessage('assistant', response.data.response);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 渲染消息内容
  const renderMessageContent = (content) => (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="chat-container">
      <List
        ref={listRef}
        className="message-list"
        dataSource={messages}
        renderItem={(message) => (
          <List.Item className={`message-item ${message.type}`}>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                  className={`avatar-${message.type}`}
                />
              }
              title={
                <span className="message-header">
                  {message.type === 'user' ? '用户' : '智能助手'} 
                  <span className="message-time">{message.timestamp}</span>
                </span>
              }
              description={
                <div className="message-content">
                  {renderMessageContent(message.content)}
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div ref={messagesEndRef} />
      <div className="input-container">
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="请输入您的问题... (Shift + Enter 换行，Enter 发送)"
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default ChatBox; 