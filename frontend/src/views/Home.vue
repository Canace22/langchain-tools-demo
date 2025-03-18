<template>
  <el-container class="chat-layout">
    <el-aside class="chat-sider" width="260">
      <div class="logo">
        <el-icon><Monitor /></el-icon>
        <span>早安 AI</span>
      </div>
      <el-button type="primary" class="new-chat" @click="createNewChat">
        <el-icon><Plus /></el-icon>
        新建对话
      </el-button>
      <div class="chat-list">
        <el-menu
          :default-active="selectedChat[0]"
          class="chat-menu"
          @select="handleChatSelect"
        >
          <el-menu-item
            v-for="chat in chatList"
            :key="chat.id"
            :index="chat.id"
          >
            <div class="chat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span class="chat-title">{{ chat.title }}</span>
              <el-icon class="delete-icon" @click.stop="deleteChat(chat.id)">
                <Delete />
              </el-icon>
            </div>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 工具面板 -->
      <div class="tools-panel">
        <div class="tools-header">
          <el-icon><Tools /></el-icon>
          <span>工具箱</span>
        </div>
        <el-menu
          :default-active="selectedTool[0]"
          class="tools-menu"
          @select="handleToolSelect"
        >
          <el-menu-item v-for="tool in tools" :key="tool.id" :index="tool.id">
            <div class="tool-item">
              <el-icon><component :is="tool.icon" /></el-icon>
              <span class="tool-title">{{ tool.title }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>

    <!-- <el-container class="chat-container">
      <el-header class="chat-header">
        <div class="header-content">
          <div class="header-title">{{ currentChat?.title || 'AI Chat' }}</div>
          <div class="header-actions">
            <el-tooltip content="清空对话" placement="bottom">
              <el-button @click="clearMessages">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
            <el-dropdown>
              <div class="user-dropdown">
                <el-avatar :size="32" :icon="User" />
                <span class="username">User</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-icon><Monitor /></el-icon>
                    IP: {{ userIP }}
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><Setting /></el-icon>
                    设置
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-icon><SwitchButton /></el-icon>
                    退出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-main class="chat-content" ref="messageContainer">
        <div class="message-list">
          <t-space direction="vertical">
            <chat-item
              v-for="msg in messages"
              :key="msg.id"
              :msg="msg"
              @operation="handleOperation"
            />
          </t-space>
          <div v-if="isTyping" class="message ai">
            <div class="avatar">
              <el-avatar :size="40" style="background-color: #409eff">
                <el-icon><Monitor /></el-icon>
              </el-avatar>
            </div>
            <div class="message-content typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
      </el-main>

      <el-footer class="chat-footer">
        <chat-sender :loading="isTyping" @send="sendMessage" />
      </el-footer>
    </el-container> -->
    <Chat
      :messages="messages"
      :title="currentChat?.title"
      :is-typing="isTyping"
      @send="sendMessage"
      @operation="handleOperation"
    >
      <template #header-actions>
        <el-dropdown>
          <div class="user-dropdown">
              <el-avatar :size="32" :icon="User" />
              <span class="username">User</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><SwitchButton /></el-icon>
                  退出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
      </template>
    </Chat>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import Chat from '@/components/Chat.vue';

// 状态定义
const selectedChat = ref('1');
const inputMessage = ref('');
const isTyping = ref(false);
const messageContainer = ref(null);
const ws = ref(null);
const userIP = ref('获取中...');
const selectedTool = ref('');

// 聊天列表
const chatList = ref([
  { id: '1', title: '新对话 1' },
  { id: '2', title: '新对话 2' }
]);

// 消息列表
const messages = ref([
  {
    id: 1,
    type: 'ai',
    content: '你好，我能为你做些什么？',
    timestamp: Date.now() - 1000,
    showActions: false
  },
  {
    id: 2,
    type: 'user',
    content: '珠海今天天气怎么样？',
    timestamp: Date.now() - 1000
  }
]);

// 工具列表
const tools = ref([
  {
    id: 'image-processor',
    title: '图片处理',
    icon: 'image',
    description: '支持图片批量处理、重命名、整理等功能',
    examples: [
      '处理目录 /path/to/images 按日期',
      '统计目录 /path/to/images',
      '整理图片 /path/to/images 复制'
    ]
  },
  {
    id: 'weather',
    title: '天气查询',
    icon: 'cloud',
    description: '查询全国各地天气信息',
    examples: ['深圳天气怎么样？', '北京今天天气如何？', '查询上海的天气']
  },
  {
    id: 'location',
    title: '地理位置',
    icon: 'location',
    description: '查询地理位置信息',
    examples: ['珠海市在哪里？', '查询广州的位置', '深圳市位置在哪']
  }
]);

// 用户菜单选项
const userMenuOptions = [
  {
    content: `IP: ${userIP.value}`,
    prefixIcon: 'monitor'
  },
  {
    content: '设置',
    prefixIcon: 'setting'
  },
  {
    content: '退出',
    prefixIcon: 'poweroff'
  }
];

// 头像
const userAvatar = 'https://tdesign.gtimg.com/site/avatar.jpg';
const aiAvatar = 'https://tdesign.gtimg.com/site/chat-avatar.png';

// 计算属性
const currentChat = computed(() => {
  return chatList.value.find((chat) => chat.id === selectedChat.value);
});

// 方法定义
const createNewChat = () => {
  const newId = String(chatList.value.length + 1);
  chatList.value.unshift({
    id: newId,
    title: `新对话 ${newId}`
  });
  selectedChat.value = newId;
  messages.value = [];
};

const deleteChat = (id) => {
  const index = chatList.value.findIndex((chat) => chat.id === id);
  if (index > -1) {
    chatList.value.splice(index, 1);
    if (selectedChat.value === id) {
      selectedChat.value = chatList.value.length ? chatList.value[0].id : '';
    }
  }
};

const handleChatSelect = (value) => {
  selectedChat.value = value;
};

const clearMessages = () => {
  messages.value = [];
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP.value = data.ip;
  } catch (error) {
    console.error('获取IP地址失败:', error);
    userIP.value = '获取失败';
  }
};

const handleToolSelect = (value) => {
  const tool = tools.value.find((t) => t.id === value);
  if (tool) {
    selectTool(tool);
  }
};

const selectTool = (tool) => {
  const newId = String(chatList.value.length + 1);
  chatList.value.unshift({
    id: newId,
    title: `${tool.title} 对话`,
    toolId: tool.id
  });
  selectedChat.value = newId;
  messages.value = [
    {
      id: Date.now(),
      type: 'ai',
      content: `我是${tool.title}助手，${
        tool.description
      }\n\n您可以这样问我：\n${tool.examples.map((e) => `- ${e}`).join('\n')}`,
      timestamp: Date.now(),
      showActions: true
    }
  ];
  selectedTool.value = tool.id;
};

const sendMessage = async (inputMessage) => {
  if (!inputMessage.trim() || isTyping.value) return;

  const currentToolId = currentChat.value?.toolId;
  const messageText = inputMessage.trim();

  messages.value.push({
    id: Date.now(),
    type: 'user',
    content: messageText,
    timestamp: Date.now()
  });

  inputMessage = '';
  scrollToBottom();

  isTyping.value = true;

  try {
    ws.value.send(
      JSON.stringify({
        message: messageText,
        toolId: currentToolId
      })
    );
  } catch (error) {
    console.error('发送消息失败:', error);
    MessagePlugin.error('发送消息失败，请重试');
  } finally {
    isTyping.value = false;
  }
};

const handleOperation = (value) => {
  console.log('operation', value);
};

const newline = () => {
  inputMessage.value += '\n';
};

const handleUserMenuClick = (data) => {
  console.log('Menu clicked:', data);
};

// WebSocket 设置
const setupWebSocket = () => {
  const wsClient = new WebSocket(`ws://${window.location.hostname}:3000/ws`);

  wsClient.onopen = () => {
    console.log('WebSocket connection established');
  };

  wsClient.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.error) {
      MessagePlugin.error(data.error);
    } else {
      messages.value.push({
        id: messages.value.length + 1,
        type: 'ai',
        content: data.response,
        timestamp: Date.now(),
        showActions: true
      });
      scrollToBottom();
    }
  };

  wsClient.onerror = (error) => {
    console.error('WebSocket error:', error);
    MessagePlugin.error('Connection error, falling back to HTTP mode');
  };

  ws.value = wsClient;
};

// 生命周期钩子
onMounted(() => {
  setupWebSocket();
  getUserIP();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
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
  width: 260px;
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

.logo .el-icon {
  font-size: 24px;
  margin-right: 8px;
}

.new-chat {
  margin: 16px;
  width: calc(100% - 32px);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-menu {
  border-right: none;
  background-color: transparent;
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

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.username {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
}

.tools-panel {
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}

.tools-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.85);
}

.tools-header .el-icon {
  margin-right: 8px;
  font-size: 16px;
}

.tools-menu {
  border-right: none;
  background-color: transparent;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-menu) {
  background-color: transparent;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.65);
}

:deep(.el-menu-item.is-active) {
  color: #409eff;
}

:deep(.el-menu-item:hover) {
  color: #409eff;
}

:deep(.el-menu-item .el-icon) {
  color: inherit;
}
</style>
