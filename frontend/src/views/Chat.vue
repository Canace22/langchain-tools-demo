<template>
  <a-layout class="chat-layout">
    <a-layout-sider class="chat-sider" width="260">
      <div class="logo">
        <robot-outlined class="logo-icon" />
        <span>AI Chat</span>
      </div>
      <a-button type="primary" class="new-chat" block @click="createNewChat">
        <plus-outlined />
        新建对话
      </a-button>
      <div class="chat-list">
        <a-menu mode="inline" theme="dark" v-model:selectedKeys="selectedChat">
          <a-menu-item v-for="chat in chatList" :key="chat.id" @click="selectChat(chat)">
            <div class="chat-item">
              <message-outlined />
              <span class="chat-title">{{ chat.title }}</span>
              <delete-outlined class="delete-icon" @click.stop="deleteChat(chat.id)" />
            </div>
          </a-menu-item>
        </a-menu>
      </div>
      <div class="user-info">
        <a-dropdown>
          <div class="user-dropdown">
            <a-avatar style="background-color: #87d068">
              <template #icon><user-outlined /></template>
            </a-avatar>
            <span class="username">User</span>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="settings">
                <setting-outlined />
                设置
              </a-menu-item>
              <a-menu-item key="logout">
                <logout-outlined />
                退出
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-sider>
    
    <a-layout class="chat-container">
      <a-layout-header class="chat-header">
        <div class="header-content">
          <div class="header-title">{{ currentChat?.title || 'AI Chat' }}</div>
          <div class="header-actions">
            <a-tooltip title="清空对话">
              <a-button type="text" @click="clearMessages">
                <clear-outlined />
              </a-button>
            </a-tooltip>
          </div>
        </div>
      </a-layout-header>
      
      <a-layout-content class="chat-content" ref="messageContainer">
        <div class="message-list">
          <div v-for="msg in messages" :key="msg.id" :class="['message', msg.type]">
            <div class="avatar">
              <a-avatar :size="40" :style="{ backgroundColor: msg.type === 'user' ? '#87d068' : '#1890ff' }">
                <template #icon>
                  <user-outlined v-if="msg.type === 'user'" />
                  <robot-outlined v-else />
                </template>
              </a-avatar>
            </div>
            <div class="message-body">
              <div class="message-info">
                <span class="sender">{{ msg.type === 'user' ? 'You' : 'AI Assistant' }}</span>
                <span class="time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div class="message-content" v-html="formatMessage(msg.content)"></div>
              <div class="message-actions" v-if="msg.type === 'ai'">
                <a-button type="text" size="small" @click="copyMessage(msg.content)">
                  <copy-outlined /> 复制
                </a-button>
              </div>
            </div>
          </div>
          <div v-if="isTyping" class="message ai">
            <div class="avatar">
              <a-avatar :size="40" style="background-color: #1890ff">
                <template #icon><robot-outlined /></template>
              </a-avatar>
            </div>
            <div class="message-content typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </a-layout-content>
      
      <a-layout-footer class="chat-footer">
        <div class="input-container">
          <a-textarea
            v-model:value="inputMessage"
            placeholder="输入消息，比如：“珠海天气怎么样”，按 Enter 发送，Shift + Enter 换行..."
            :auto-size="{ minRows: 1, maxRows: 4 }"
            @pressEnter.prevent="sendMessage"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.prevent="newline"
          />
          <a-button 
            type="primary" 
            class="send-button" 
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isTyping"
          >
            <send-outlined />
            发送
          </a-button>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent, ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { 
  PlusOutlined, 
  MessageOutlined, 
  SendOutlined,
  DeleteOutlined,
  CopyOutlined,
  SettingOutlined,
  LogoutOutlined,
  ClearOutlined,
  UserOutlined,
  RobotOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'Chat',
  components: {
    PlusOutlined,
    MessageOutlined,
    SendOutlined,
    DeleteOutlined,
    CopyOutlined,
    SettingOutlined,
    LogoutOutlined,
    ClearOutlined,
    UserOutlined,
    RobotOutlined
  },
  setup() {
    const selectedChat = ref(['1'])
    const inputMessage = ref('')
    const isTyping = ref(false)
    const messageContainer = ref(null)
    const ws = ref(null)
    
    const chatList = ref([
      { id: '1', title: '新对话 1' },
      { id: '2', title: '新对话 2' },
    ])
    
    const messages = ref([
      { 
        id: 1, 
        type: 'ai', 
        content: '你好！我是AI助手，有什么可以帮你的吗？',
        timestamp: Date.now() - 1000
      },
      { 
        id: 2, 
        type: 'user', 
        content: '你好！',
        timestamp: Date.now()
      },
    ])

    const currentChat = computed(() => {
      return chatList.value.find(chat => chat.id === selectedChat.value[0])
    })
    
    const createNewChat = () => {
      const newId = String(chatList.value.length + 1)
      chatList.value.unshift({
        id: newId,
        title: `新对话 ${newId}`
      })
      selectedChat.value = [newId]
      messages.value = []
    }

    const deleteChat = (id) => {
      const index = chatList.value.findIndex(chat => chat.id === id)
      if (index > -1) {
        chatList.value.splice(index, 1)
        if (selectedChat.value[0] === id) {
          selectedChat.value = chatList.value.length ? [chatList.value[0].id] : []
        }
      }
    }

    const selectChat = (chat) => {
      selectedChat.value = [chat.id]
    }

    const clearMessages = () => {
      messages.value = []
    }

    const scrollToBottom = async () => {
      await nextTick()
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    }

    // WebSocket setup
    const setupWebSocket = () => {
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.BASE_URL
      const wsClient = new WebSocket(`ws://${window.location.hostname}:3000/ws`)
      
      wsClient.onopen = () => {
        console.log('WebSocket connection established')
      }
      
      wsClient.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.error) {
          message.error(data.error)
        } else {
          messages.value.push({
            id: messages.value.length + 1,
            type: 'ai',
            content: data.response,
            timestamp: Date.now()
          })
          scrollToBottom()
        }
      }
      
      wsClient.onerror = (error) => {
        console.error('WebSocket error:', error)
        message.error('Connection error, falling back to HTTP mode')
      }
      
      ws.value = wsClient
    }
    
    const simulateAIResponse = async () => {
      isTyping.value = true
      
      try {
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
          // Send message through WebSocket
          ws.value.send(JSON.stringify({ 
            message: messages.value[messages.value.length - 1].content 
          }))
        } else {
          // Fallback to HTTP request
          await new Promise(resolve => setTimeout(resolve, 1000))
          messages.value.push({
            id: messages.value.length + 1,
            type: 'ai',
            content: '我明白了。让我来帮助你解决这个问题...',
            timestamp: Date.now()
          })
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        message.error('发送消息失败，请重试')
      } finally {
        isTyping.value = false
        scrollToBottom()
      }
    }
    
    // Setup WebSocket on component mount
    onMounted(() => {
      setupWebSocket()
    })
    
    // Cleanup WebSocket on component unmount
    onUnmounted(() => {
      if (ws.value) {
        ws.value.close()
      }
    })
    
    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isTyping.value) return
      
      const userMessage = {
        id: messages.value.length + 1,
        type: 'user',
        content: inputMessage.value,
        timestamp: Date.now()
      }
      
      messages.value.push(userMessage)
      inputMessage.value = ''
      scrollToBottom()
      
      await simulateAIResponse()
    }

    const newline = () => {
      inputMessage.value += '\n'
    }

    const copyMessage = (content) => {
      navigator.clipboard.writeText(content)
      message.success('已复制到剪贴板')
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatMessage = (content) => {
      return content.replace(/\n/g, '<br>')
    }
    
    return {
      selectedChat,
      chatList,
      messages,
      inputMessage,
      isTyping,
      currentChat,
      messageContainer,
      sendMessage,
      createNewChat,
      deleteChat,
      selectChat,
      clearMessages,
      copyMessage,
      newline,
      formatTime,
      formatMessage,
      ws,
      setupWebSocket,
      simulateAIResponse
    }
  }
})
</script>

<style scoped>
.chat-layout {
  height: 100vh;
}

.chat-sider {
  background: #1e1e1e;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  color: white;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  font-size: 24px;
  margin-right: 8px;
}

.new-chat {
  margin: 16px;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 8px;
}

.chat-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-icon {
  opacity: 0;
  transition: opacity 0.2s;
}

.chat-item:hover .delete-icon {
  opacity: 1;
}

.user-info {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
}

.username {
  flex: 1;
}

.chat-container {
  background: #fff;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
}

.chat-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.message-list {
  max-width: 800px;
  margin: 0 auto;
}

.message {
  display: flex;
  margin-bottom: 24px;
  gap: 16px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-body {
  flex: 1;
  max-width: 80%;
}

.message-info {
  margin-bottom: 4px;
  font-size: 12px;
  color: #999;
}

.message.user .message-info {
  text-align: right;
}

.message-content {
  padding: 12px 16px;
  border-radius: 8px;
  background: #f5f5f5;
  line-height: 1.5;
}

.message.user .message-content {
  background: #1890ff;
  color: white;
}

.message-actions {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-actions {
  opacity: 1;
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.chat-footer {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.input-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 16px;
}

.send-button {
  flex-shrink: 0;
  height: auto;
}

:deep(.ant-input) {
  border-radius: 8px;
}

:deep(.ant-btn) {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style> 